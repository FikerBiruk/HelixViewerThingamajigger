import { getDefaultSequence, getSequenceStats, sanitizeSequence } from "./dna.js";

export function setupUI({ onGenerate }) {
  const sequenceInput = document.getElementById("sequenceInput");
  const generateBtn = document.getElementById("generateBtn");
  const statusText = document.getElementById("statusText");
  const sequenceLength = document.getElementById("sequenceLength");
  const gcPercent = document.getElementById("gcPercent");

  function updateStatus(message) {
    statusText.style.opacity = "0";
    window.setTimeout(() => {
      statusText.textContent = message;
      statusText.style.opacity = "1";
    }, 90);
  }

  function updateMetrics(sequence) {
    const stats = getSequenceStats(sequence);
    sequenceLength.textContent = String(stats.length);
    gcPercent.textContent = `${stats.gcPercentage.toFixed(1)}%`;
  }

  function emitGenerate() {
    const cleaned = sanitizeSequence(sequenceInput.value);
    const finalSequence = cleaned || getDefaultSequence();
    const usingDefault = !cleaned;

    onGenerate(finalSequence);
    updateMetrics(finalSequence);

    updateStatus(
      usingDefault
        ? `Using default sequence (${finalSequence.length} bases)`
        : `Loaded ${finalSequence.length} bases`
    );
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

