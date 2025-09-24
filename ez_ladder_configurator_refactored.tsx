import React, { useMemo, useState } from "react";

/**
 * EZ Ladder Configurator (refactored)
 * - Ladder Height inputs (feet + inches) — RESTORED
 * - Standoff Distance slider (single control): 7.000" → 15.375" (1'–3 3/8")
 *
 * Notes:
 * - This component is self-contained and avoids external UI deps.
 * - Replace/merge into your project as needed.
 */

// ---------- Helpers ----------

function feetToInches(feet: number): number {
  return Math.round((feet || 0) * 12 * 1000) / 1000;
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num));
}

function fmtInches(totalInches: number): string {
  if (!isFinite(totalInches)) return "—";
  const sign = totalInches < 0 ? "-" : "";
  const abs = Math.abs(totalInches);
  const feet = Math.floor(abs / 12);
  const inches = abs - feet * 12;
  // show to 1/8" precision
  const eighths = Math.round(inches * 8) / 8;
  const whole = Math.floor(eighths);
  const frac = eighths - whole;

  const fracToUnicode = (f: number) => {
    const map: Record<number, string> = {
      [1/8]: "⅛",
      [1/4]: "¼",
      [3/8]: "⅜",
      [1/2]: "½",
      [5/8]: "⅝",
      [3/4]: "¾",
      [7/8]: "⅞",
    };
    // floating point safe lookup
    for (const k of Object.keys(map)) {
      const key = Number(k);
      if (Math.abs(f - key) < 1e-6) return map[key];
    }
    return "";
  };

  const fracStr = fracToUnicode(frac);
  const inchStr =
    fracStr && whole === 0
      ? `${fracStr}″`
      : fracStr
      ? `${whole}${fracStr}″`
      : `${Math.round(eighths * 1000) / 1000}″`;

  if (feet === 0) return `${sign}${inchStr}`;
  return `${sign}${feet}′-${inchStr}`;
}

function inchesToFeetInches(totalInches: number): { feet: number; inches: number } {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.max(0, Math.round((totalInches - feet * 12) * 1000) / 1000);
  return { feet, inches };
}

// Example resolver for standoff SKU; replace with project-specific logic if you already have it.
function resolveStandoffSpec(inches: number): { sku: string; valueInches: number } {
  // Example buckets for demonstration
  // SO2: 7.0" - 11.0", SO3: 11.125" - 15.375"
  if (inches <= 11.0) {
    return { sku: "SO2", valueInches: 9.0 };
  }
  return { sku: "SO3", valueInches: 13.5 };
}

export default function EzLadderConfiguratorRefactored() {
  // ---------- State ----------

  // RESTORED: Ladder Height as separate feet/inches inputs
  const [ladderFeet, setLadderFeet] = useState<number>(20);
  const [ladderInches, setLadderInches] = useState<number>(0);

  // Standoff Distance: single slider (inches)
  const [standoffInches, setStandoffInches] = useState<number>(12); // default ~ 1'-0"

  // ---------- Derived values ----------

  const requestedLadderHeightInches = useMemo(() => {
    const f = Number.isFinite(ladderFeet) ? ladderFeet : 0;
    const i = Number.isFinite(ladderInches) ? ladderInches : 0;
    const safeInches = clamp(i, 0, 11.999); // keep inches < 12
    return feetToInches(f) + safeInches;
  }, [ladderFeet, ladderInches]);

  const requestedStandoffInches = useMemo(() => {
    const min = 7.0;
    const max = 15.375; // 1' 3-3/8"
    return clamp(Number(standoffInches) || 0, min, max);
  }, [standoffInches]);

  const standoffResolved = useMemo(() => resolveStandoffSpec(requestedStandoffInches), [requestedStandoffInches]);

  // Placeholder examples demonstrating downstream usage
  const wallSku = standoffResolved.sku;
  const wallOffset = standoffResolved.valueInches;

  // ---------- Handlers ----------

  const onFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(0, Math.floor(Number(e.target.value) || 0));
    setLadderFeet(v);
  };
  const onInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value) || 0, 0, 11.999);
    setLadderInches(v);
  };

  // ---------- UI ----------

  const ladderHeightDisplay = fmtInches(requestedLadderHeightInches);
  const { feet: ladderFeetOut, inches: ladderInchesOut } = inchesToFeetInches(requestedLadderHeightInches);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, padding: 24 }}>
      {/* LEFT PANE */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Ladder Height (Feet/Inches) — RESTORED */}
        <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Ladder Height</h3>
          <p style={{ marginTop: 6, marginBottom: 10, fontSize: 12, color: "#6b7280" }}>
            Enter the total ladder height. Feet and inches are separate fields.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#374151" }}>Feet</label>
              <input
                type="number"
                min={0}
                step={1}
                value={ladderFeet}
                onChange={onFeetChange}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#374151" }}>Inches</label>
              <input
                type="number"
                min={0}
                max={11.999}
                step={0.125}
                value={ladderInches}
                onChange={onInchesChange}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#374151" }}>
            Height: <strong>{ladderHeightDisplay}</strong>{" "}
            <span style={{ color: "#6b7280" }}>
              ({ladderFeetOut}′-{fmtInches(ladderInchesOut).replace("″", "")}″)
            </span>
          </div>
        </section>

        {/* Standoff Distance (Slider) */}
        <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Standoff Distance</h3>
          <p style={{ marginTop: 6, marginBottom: 10, fontSize: 12, color: "#6b7280" }}>
            Set the distance from mounting surface to rail centerline.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#374151" }}>Selected</span>
            <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{fmtInches(requestedStandoffInches)}</span>
          </div>

          <input
            type="range"
            min={7}
            max={15.375}
            step={0.125}
            value={standoffInches}
            onChange={(e) => setStandoffInches(Number(e.target.value))}
            aria-label="Standoff distance slider"
            style={{ width: "100%", marginTop: 12 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginTop: 6 }}>
            <span>7″</span>
            <span>1′-3⅜″</span>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#374151" }}>
            Selected SKU: <strong>{wallSku}</strong> @ {fmtInches(wallOffset)}
          </div>
        </section>
      </div>

      {/* RIGHT PANE (Preview / Derived values) */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Preview / Derived</h3>
        <ul style={{ marginTop: 10, lineHeight: 1.8, color: "#374151", fontSize: 13 }}>
          <li>Total ladder height: <strong>{ladderHeightDisplay}</strong></li>
          <li>Requested standoff: <strong>{fmtInches(requestedStandoffInches)}</strong></li>
          <li>Resolved standoff offset: <strong>{fmtInches(wallOffset)}</strong></li>
          <li>Resolved standoff SKU: <strong>{wallSku}</strong></li>
        </ul>

        <p style={{ marginTop: 16, fontSize: 12, color: "#6b7280" }}>
          Hook your existing visualizer, BOM, and pricing logic to
          <code style={{ marginLeft: 6, marginRight: 6, background: "#F3F4F6", padding: "2px 6px", borderRadius: 6 }}>
            requestedLadderHeightInches
          </code>
          and
          <code style={{ marginLeft: 6, marginRight: 6, background: "#F3F4F6", padding: "2px 6px", borderRadius: 6 }}>
            requestedStandoffInches
          </code>
          as needed.
        </p>
      </div>
    </div>
  );
}
