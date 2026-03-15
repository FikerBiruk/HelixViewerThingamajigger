import { getDefaultSequence, sanitizeSequence } from "./dna.js";

export function setupUI({ onGenerate }) {
  const sequenceInput = document.getElementById("sequenceInput");
  const generateBtn = document.getElementById("generateBtn");
  const statusText = document.getElementById("statusText");

  function emitGenerate() {
    const cleaned = sanitizeSequence(sequenceInput.value);
    const finalSequence = cleaned || getDefaultSequence();
    const usingDefault = !cleaned;
    onGenerate(finalSequence);

    statusText.textContent = usingDefault
      ? `Using default sequence (${finalSequence.length} bases)`
      : `Loaded ${finalSequence.length} bases`;
  }

  generateBtn.addEventListener("click", emitGenerate);
  sequenceInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      emitGenerate();
    }
  });

  sequenceInput.value = getDefaultSequence();
  emitGenerate();
}

