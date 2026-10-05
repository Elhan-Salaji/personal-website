import { describe, expect, it } from "vitest";
import { FailedAttemptLimiter } from "./rate-limit";

const WINDOW = 15 * 60 * 1000;

describe("FailedAttemptLimiter", () => {
  it("erlaubt Versuche bis zur Grenze und sperrt danach", () => {
    const limiter = new FailedAttemptLimiter(3, WINDOW);
    for (let i = 0; i < 3; i++) {
      expect(limiter.retryAfterMs("ip", 1000)).toBe(0);
      limiter.recordFailure("ip", 1000);
    }
    expect(limiter.retryAfterMs("ip", 1000)).toBe(WINDOW);
  });

  it("gibt nach Ablauf des Fensters wieder frei", () => {
    const limiter = new FailedAttemptLimiter(1, WINDOW);
    limiter.recordFailure("ip", 0);
    expect(limiter.retryAfterMs("ip", WINDOW - 1)).toBe(1);
    expect(limiter.retryAfterMs("ip", WINDOW)).toBe(0);
  });

  it("zählt Adressen getrennt", () => {
    const limiter = new FailedAttemptLimiter(1, WINDOW);
    limiter.recordFailure("a", 0);
    expect(limiter.retryAfterMs("a", 0)).toBeGreaterThan(0);
    expect(limiter.retryAfterMs("b", 0)).toBe(0);
  });

  it("setzt den Zähler nach erfolgreichem Login zurück", () => {
    const limiter = new FailedAttemptLimiter(1, WINDOW);
    limiter.recordFailure("ip", 0);
    limiter.reset("ip");
    expect(limiter.retryAfterMs("ip", 0)).toBe(0);
  });

  it("begrenzt die Zahl gespeicherter Adressen", () => {
    const limiter = new FailedAttemptLimiter(1, WINDOW, 2);
    limiter.recordFailure("a", 0);
    limiter.recordFailure("b", 0);
    limiter.recordFailure("c", 0);
    expect(limiter.retryAfterMs("a", 0)).toBe(0);
    expect(limiter.retryAfterMs("c", 0)).toBeGreaterThan(0);
  });
});
