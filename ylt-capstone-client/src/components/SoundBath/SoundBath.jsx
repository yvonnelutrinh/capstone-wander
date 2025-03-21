import * as Tone from "tone";

export default function SoundBath() {
  // synth for soft, warm tones
  const synth1 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 5, decay: 2, sustain: 0.9, release: 8 },
  }).toDestination();
  // synth for deeper tones
  const synth2 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 12, decay: 6, sustain: 1, release: 18 },
  }).toDestination();

  // function to replicate a sound bath notes sequence
  const startSoundBath = () => {
    Tone.start();

    const notes1 = ["C3", "E3", "G3", "B3"];
    const notes2 = ["D2", "F2", "A2", "C2"];

    let index = 0;
    setInterval(() => {
      let note1 = notes1[index % notes1.length];
      let note2 = notes2[index % notes1.length];

      synth1.triggerAttackRelease(note1, "8s");
      synth2.triggerAttackRelease(note2, "10s");

      index++;
    }, 4000); // switch notes every 4s
  };

  return <button onClick={() => startSoundBath()}>Start sounds</button>;
}
