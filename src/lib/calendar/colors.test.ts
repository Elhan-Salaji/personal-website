import { describe, expect, it } from "vitest";
import { normalizeHexColor } from "./colors";

describe("normalizeHexColor", () => {
  it("übernimmt sechsstellige Farben in Kleinbuchstaben", () => {
    expect(normalizeHexColor("#9EA0A8")).toBe("#9ea0a8");
  });

  it("schneidet den Alphakanal von Apple-Farben ab", () => {
    expect(normalizeHexColor("#FF2968FF")).toBe("#ff2968");
  });

  it.each([undefined, null, 42, "", "rot", "#fff", "#12345", "#1234567", "#gggggg", "#123456;background:url(x)"])(
    "verwirft ungültige Werte: %j",
    (raw) => {
      expect(normalizeHexColor(raw)).toBeNull();
    },
  );
});
