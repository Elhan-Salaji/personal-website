/**
 * Einfaches Rate Limiting für Fehlversuche, gehalten im Arbeitsspeicher.
 *
 * Grenzen auf Vercel: Jede Serverless-Instanz hat ihren eigenen Speicher.
 * Laufen mehrere Instanzen parallel, zählt jede für sich, und nach einem
 * Kaltstart beginnt die Zählung neu. Für einen Freundeskreis-Kalender reicht
 * das als Bremse gegen Durchprobieren, ein verteilter Angriff kommt durch.
 * Für einen harten Schutz bräuchte es einen gemeinsamen Speicher wie Redis.
 */
export class FailedAttemptLimiter {
  private readonly attempts = new Map<string, { count: number; windowStart: number }>();

  constructor(
    private readonly maxFailures: number,
    private readonly windowMs: number,
    private readonly maxTrackedKeys = 10_000,
  ) {}

  /** Liefert die Wartezeit in Millisekunden, oder 0, wenn ein Versuch erlaubt ist. */
  retryAfterMs(key: string, now: number = Date.now()): number {
    const entry = this.attempts.get(key);
    if (!entry) {
      return 0;
    }
    const windowEnd = entry.windowStart + this.windowMs;
    if (now >= windowEnd) {
      this.attempts.delete(key);
      return 0;
    }
    return entry.count >= this.maxFailures ? windowEnd - now : 0;
  }

  recordFailure(key: string, now: number = Date.now()): void {
    const entry = this.attempts.get(key);
    if (entry && now < entry.windowStart + this.windowMs) {
      entry.count += 1;
      return;
    }
    this.evictExpired(now);
    this.attempts.set(key, { count: 1, windowStart: now });
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  private evictExpired(now: number): void {
    if (this.attempts.size < this.maxTrackedKeys) {
      return;
    }
    for (const [key, entry] of this.attempts) {
      if (now >= entry.windowStart + this.windowMs) {
        this.attempts.delete(key);
      }
    }
    // Bleibt die Map voll, fliegt der älteste Eintrag raus, damit der Speicher begrenzt bleibt.
    if (this.attempts.size >= this.maxTrackedKeys) {
      const oldestKey = this.attempts.keys().next().value;
      if (oldestKey !== undefined) {
        this.attempts.delete(oldestKey);
      }
    }
  }
}
