/**
 * Kleiner Zwischenspeicher mit Ablaufzeit im Arbeitsspeicher der Instanz.
 * Gleichzeitige Anfragen für denselben Schlüssel teilen sich einen Ladevorgang.
 * Fehlgeschlagene Ladevorgänge landen nicht im Cache, der nächste Aufruf
 * versucht es erneut.
 */
export class TtlCache<T> {
  private readonly entries = new Map<string, { value: T; expiresAt: number }>();
  private readonly inFlight = new Map<string, Promise<T>>();

  constructor(
    private readonly ttlMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  async getOrLoad(key: string, load: () => Promise<T>): Promise<T> {
    const cached = this.entries.get(key);
    if (cached && cached.expiresAt > this.now()) {
      return cached.value;
    }
    const running = this.inFlight.get(key);
    if (running) {
      return running;
    }
    const loading = load()
      .then((value) => {
        this.entries.set(key, { value, expiresAt: this.now() + this.ttlMs });
        return value;
      })
      .finally(() => this.inFlight.delete(key));
    this.inFlight.set(key, loading);
    return loading;
  }
}
