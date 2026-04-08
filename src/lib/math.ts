
export interface ExactCoord {
  x: string;
  y: string;
  xVal: number;
  yVal: number;
}

export interface AngleInfo {
  degrees: number;
  radians: string;
  radiansVal: number;
  exact: ExactCoord;
  quadrant: number;
  referenceAngle: number;
}

const SQRT2 = Math.sqrt(2);
const SQRT3 = Math.sqrt(3);

export const STANDARD_ANGLES = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330
];

export function getExactCoord(deg: number): ExactCoord {
  const normalized = ((deg % 360) + 360) % 360;
  
  // Helper to format fractions
  const f = (num: string, den: string) => {
    if (den === "1") return num;
    return `${num}/${den}`;
  };

  // Standard values
  // 0: 1, 0
  // 30: sqrt(3)/2, 1/2
  // 45: sqrt(2)/2, sqrt(2)/2
  // 60: 1/2, sqrt(3)/2
  
  const getVal = (d: number) => {
    const r = (d * Math.PI) / 180;
    const x = Math.cos(r);
    const y = Math.sin(r);
    
    let xStr = x.toFixed(3);
    let yStr = y.toFixed(3);

    // Check for standard values
    const check = (val: number) => {
      const abs = Math.abs(val);
      const sign = val < 0 ? "-" : "";
      if (Math.abs(abs - 1) < 0.001) return sign + "1";
      if (Math.abs(abs - 0) < 0.001) return "0";
      if (Math.abs(abs - 0.5) < 0.001) return sign + "1/2";
      if (Math.abs(abs - SQRT2 / 2) < 0.001) return sign + "√2/2";
      if (Math.abs(abs - SQRT3 / 2) < 0.001) return sign + "√3/2";
      return val.toFixed(2);
    };

    return { x: check(x), y: check(y), xVal: x, yVal: y };
  };

  return getVal(normalized);
}

export function getRadians(deg: number): { str: string; val: number } {
  const normalized = ((deg % 360) + 360) % 360;
  const val = (normalized * Math.PI) / 180;
  
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  
  const formatRad = (d: number) => {
    if (d === 0) return "0";
    if (d === 180) return "π";
    
    const common = gcd(d, 180);
    const num = d / common;
    const den = 180 / common;
    
    const numStr = num === 1 ? "π" : `${num}π`;
    return den === 1 ? numStr : `${numStr}/${den}`;
  };

  // Handle special cases for 45-degree multiples that might not be caught by simple GCD if we want pretty π/4 etc.
  return { str: formatRad(normalized), val };
}

export function getAngleInfo(deg: number): AngleInfo {
  const normalized = ((deg % 360) + 360) % 360;
  const rad = getRadians(normalized);
  const exact = getExactCoord(normalized);
  
  let quadrant = 1;
  if (normalized > 90 && normalized <= 180) quadrant = 2;
  else if (normalized > 180 && normalized <= 270) quadrant = 3;
  else if (normalized > 270 && normalized < 360) quadrant = 4;

  let referenceAngle = normalized;
  if (quadrant === 2) referenceAngle = 180 - normalized;
  else if (quadrant === 3) referenceAngle = normalized - 180;
  else if (quadrant === 4) referenceAngle = 360 - normalized;

  return {
    degrees: Math.round(normalized * 10) / 10,
    radians: rad.str,
    radiansVal: rad.val,
    exact,
    quadrant,
    referenceAngle: Math.round(referenceAngle * 10) / 10
  };
}

export function getClosestStandardAngle(deg: number): number {
  const normalized = ((deg % 360) + 360) % 360;
  return STANDARD_ANGLES.reduce((prev, curr) => {
    return Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev;
  });
}
