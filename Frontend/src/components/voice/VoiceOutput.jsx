import { useEffect, useState } from "react";

function VoiceOutput({ text }) {
  const [speaking, setSpeaking] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  useEffect(() => {
    function loadVoices() {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);

      if (list.length > 0 && !selectedVoice) {
        setSelectedVoice(list[0].name);
      }
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  function speak() {
    const speech = new SpeechSynthesisUtterance(text);

    const voice = voices.find(
      (v) => v.name === selectedVoice
    );

    if (voice) {
      speech.voice = voice;
      speech.lang = voice.lang;
    }

    speech.rate = 0.9;

    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return (
    <div className="relative flex gap-3 mt-2">

      <button
        onClick={speaking ? stop : speak}
        className="text-neutral-500 hover:text-white"
      >
        {speaking ? "⏹" : "🔊"}
      </button>

      <button
        onClick={() => setShowOptions(!showOptions)}
        className="text-neutral-500 hover:text-white"
      >
        ⋯
      </button>

      {showOptions && (
        <div className="absolute bottom-8 left-6 w-52 bg-neutral-900 border border-neutral-700 rounded-lg p-3">

          <p className="text-xs text-neutral-500 mb-2">
            Voice
          </p>

          <select
            value={selectedVoice}
            onChange={(e) =>
              setSelectedVoice(e.target.value)
            }
            className="w-full bg-neutral-800 text-white text-sm p-2 rounded"
          >
            {voices.map((voice) => (
              <option
                key={voice.name}
                value={voice.name}
              >
                {voice.name}
              </option>
            ))}
          </select>

        </div>
      )}

    </div>
  );
}

export default VoiceOutput;