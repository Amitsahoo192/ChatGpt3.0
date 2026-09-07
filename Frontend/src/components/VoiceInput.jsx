import { useState } from "react";

function VoiceInput({ setInput }) {
  const [listening, setListening] = useState(false);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      setInput(text);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();
  }

  return (
    <button
      onClick={startListening}
      className={`px-3 py-2 rounded-full transition ${
        listening
          ? "bg-red-500 text-white"
          : "bg-neutral-800 text-white hover:bg-neutral-700"
      }`}
    >
      {listening ? "●" : "🎙️"}
    </button>
  );
}

export default VoiceInput;