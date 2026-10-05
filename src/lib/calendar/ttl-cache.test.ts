import { describe, expect, it, vi } from "vitest";
import { TtlCache } from "./ttl-cache";

describe("TtlCache", () => {
  it("liefert innerhalb der Laufzeit den gespeicherten Wert", async () => {
    let now = 0;
    const cache = new TtlCache<string>(1000, () => now);
    const load = vi.fn().mockResolvedValue("a");
    await cache.getOrLoad("k", load);
    now = 999;
    expect(await cache.getOrLoad("k", load)).toBe("a");
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("lädt nach Ablauf neu", async () => {
    let now = 0;
    const cache = new TtlCache<string>(1000, () => now);
    const load = vi.fn().mockResolvedValueOnce("alt").mockResolvedValueOnce("neu");
    await cache.getOrLoad("k", load);
    now = 1000;
    expect(await cache.getOrLoad("k", load)).toBe("neu");
  });

  it("bündelt gleichzeitige Anfragen zu einem Ladevorgang", async () => {
    const cache = new TtlCache<string>(1000);
    const load = vi.fn().mockResolvedValue("a");
    await Promise.all([cache.getOrLoad("k", load), cache.getOrLoad("k", load)]);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("speichert Fehler nicht", async () => {
    const cache = new TtlCache<string>(1000);
    await expect(cache.getOrLoad("k", () => Promise.reject(new Error("offline")))).rejects.toThrow("offline");
    expect(await cache.getOrLoad("k", () => Promise.resolve("wieder da"))).toBe("wieder da");
  });
});
