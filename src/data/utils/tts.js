// utils/tts.js
export function speakDutch(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  // You may pick a Dutch voice if available
  const voices = window.speechSynthesis.getVoices();
  for (let v of voices) {
    if (v.lang.startsWith('nl')) {
      utter.voice = v;
      break;
    }
  }
  utter.lang = 'nl-NL';
  window.speechSynthesis.speak(utter);
}
