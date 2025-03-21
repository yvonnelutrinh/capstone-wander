import { useEffect, useState } from "react";
import * as Tone from "tone";

const masterGain = new Tone.Gain(1);
masterGain.toDestination(); // master gain controls everything

export default function SoundBath() {
  const [playback, setPlayback] = useState(false);
  const [initialized, setInitialized] = useState(false); // track if AudioContext is initialized

  useEffect(() => {
    masterGain.gain.setValueAtTime(1, Tone.now()); // set gain control
  }, []);


  // synth for soft, warm tones
  const synth = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 4, // increase from default 4 to prevent error max polyphony exceeded
    oscillator: { type: "sine" },
    // oscillator: { type: "custom", partials: [0, 1, 0.3, 0.1] }, // custom waveform, or use sine
    envelope: { attack: 5, decay: 2, sustain: 0.9, release: 5 },
  }).connect(masterGain);
  // synth for deeper tones
  const bassSynth = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 8,
    oscillator: { type: "sine", detune: -5 }, // detune slightly for binaural effect
    envelope: { attack: 12, decay: 6, sustain: 1, release: 8 },
  }).connect(masterGain);
  // consider tremolo for natural flow on higher tones (avoid on lower tones, can sound choppy)
  const tremolo = new Tone.Tremolo(0.1, 0.3); // 0.1 Hz = very slow pulsing, 0.3 depth is less intense

    // const lowPassFilter = new Tone.Filter({
    //   type: "lowpass",
    //   frequency: 500, // remove high frequencies for softer, warmer sound
    //   Q: 0.8, // slight resonance
    // }).connect(masterGain);

    // synth.connect(lowPassFilter);
    // bassSynth.connect(lowPassFilter);

  // function to replicate a sound bath notes sequence
  const startSoundBath = async () => {

    if (playback) {
      console.log(`playback state is: ${playback}, setting to ${!playback}`);
      setPlayback(false);

      // fade out audio over 3s
      console.log("stopping sound bath");
      masterGain.gain.setTargetAtTime(0, Tone.now(), 1.5); // fade over 1.5s

      // debugging, checking gain value every 500ms
      let checkGain = setInterval(() => {
        console.log("Current gain:", masterGain.gain.value);
      }, 500);

      // stop synths after fade out
      setTimeout(() => {
        clearInterval(checkGain);
    // synth.volume.value = -Infinity; // instantly mute synth
    // bassSynth.volume.value = -Infinity; // instantly mute bassSynth
        synth.releaseAll(); // stop synths
        bassSynth.releaseAll();
      }, 3000);

      return;
    }
    console.log("starting sound bath");
    setPlayback(true);
    masterGain.gain.setValueAtTime(1, Tone.now()); // reset volume before starting

    const notes1 = ["C4", "E4", "G4", "B4"]; // higher pitched crystal bowls
    const notes2 = ["C2", "D2", "E2", "G2"]; // lower pitched crystal bowls

    for (let i = 0; i < notes1.length; i++) {
      synth.triggerAttackRelease(notes1[i], "8s");
      bassSynth.triggerAttackRelease(notes2[i], "10s");
    //   synth.triggerRelease(); // stop last note before playing new one
    //   bassSynth.triggerRelease();

      await new Promise((resolve) => setTimeout(resolve, 4000)); // wait 4s before next notes
    }

    // console.log(Tone.context.state); // should be "running" or "suspended"
    // console.log(Tone.context.sampleRate); // should be 44100 or 48000
    // if cpu usage is too high reduce polyphony/simplify effects/filters
  };

  return (
    <button onClick={startSoundBath}>
      {playback === true ? "Stop" : "Start"} sounds
    </button>
  );
}
