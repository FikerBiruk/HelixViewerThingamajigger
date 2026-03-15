const DEFAULT_SEQUENCE = "ATGCGTACGTTAGCTAGGCTTACGATCGATCGGATCGA";

const COMPLEMENT_MAP = {
  A: "T",
  T: "A",
  C: "G",
  G: "C",
};

export const BASE_COLORS = {
  A: 0x31d07d,
  T: 0xff5757,
  C: 0x5f9dff,
  G: 0xffd94a,
};

export function getDefaultSequence() {
  return DEFAULT_SEQUENCE;
}

export function sanitizeSequence(input) {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^ATCG]/g, "");
}

export function generateComplementaryStrand(sequence) {
  return sequence
    .split("")
    .map((base) => COMPLEMENT_MAP[base] || "N")
    .join("");
}

export function buildHelixLayoutData(sequence, options = {}) {
  const radius = options.radius ?? 4;
  const risePerBase = options.risePerBase ?? 1.05;
  const twistPerBase = options.twistPerBase ?? (Math.PI / 5);

  const complement = generateComplementaryStrand(sequence);
  const centerOffset = ((sequence.length - 1) * risePerBase) / 2;
  const pairs = [];

  for (let i = 0; i < sequence.length; i += 1) {
    const angle = i * twistPerBase;
    const y = i * risePerBase - centerOffset;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;

    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    pairs.push({
      index: i + 1,
      forwardBase: sequence[i],
      complementBase: complement[i],
      p1: { x: x1, y, z: z1 },
      p2: { x: x2, y, z: z2 },
      angle,
    });
  }

  return {
    sequence,
    complement,
    pairs,
    options: { radius, risePerBase, twistPerBase },
  };
}

