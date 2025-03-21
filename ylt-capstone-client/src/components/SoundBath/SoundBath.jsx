import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

// master gain controls overall volume
const masterGain = new Tone.Gain(1).toDestination();

export default function SoundBath() {
  const [playback, setPlayback] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [wasPreviouslyPlaying, setWasPreviouslyPlaying] = useState(false);

  // use refs to store tone objects
  const masterGainRef = useRef(null);
  const synthRef = useRef(null);
  const bassSynthRef = useRef(null);
  const tremoloRef = useRef(null);
  const reverbRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    masterGain.gain.setValueAtTime(1, Tone.now()); // set gain control
  }, []);

  const initializeAudio = async () => {
    if (initialized) return;
    try {
      await Tone.start();
      console.log("AudioContext started:", Tone.context.state);

      masterGainRef.current = new Tone.Gain(1).toDestination(); // set gain control

      // synth for soft, warm tones
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 4, // increase from default 4 to prevent error max polyphony exceeded
        oscillator: { type: "sine" },
        envelope: { attack: 5, decay: 2, sustain: 0.9, release: 5 },
      });
      // synth for deeper tones
      bassSynthRef.current = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 4,
        oscillator: { type: "sine", detune: -5 },
        envelope: { attack: 12, decay: 6, sustain: 1, release: 8 },
      });

      // effects for immersive sound experience
      tremoloRef.current = new Tone.Tremolo(0.1, 0.3).start();
      reverbRef.current = new Tone.Reverb({ decay: 4, wet: 0.6 });
      delayRef.current = new Tone.FeedbackDelay("8n", 0.5);

      // connect the audio graph
      synthRef.current.chain(
        tremoloRef.current,
        reverbRef.current,
        masterGainRef.current
      );
      bassSynthRef.current.chain(delayRef.current, masterGainRef.current);

      setInitialized(true);
      console.log("audio system initialized successfully");
    } catch (error) {
      console.error("failed to initialize audio:", error);
    }
  };

  const stopSoundBath = () => {
    setPlayback(false);

    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0, Tone.now(), 1.5); // fade out audio over 1.5s
    }

    setTimeout(() => {
      // stop synths after fade out
      if (synthRef.current) synthRef.current.releaseAll();
      if (bassSynthRef.current) bassSynthRef.current.releaseAll();
      console.log("all notes released");
    }, 2000);
  };

  const playSoundBath = async () => {
    if (!synthRef.current || !bassSynthRef.current) {
      console.error("synths not initialized");
      return;
    }

    setPlayback(true);
    masterGain.gain.setValueAtTime(1, Tone.now());

    console.log("starting sound bath sequence");

    const notes1 = ["C4", "E4", "G4", "B4"];
    const notes2 = ["C2", "D2", "E2", "G2"];

    for (let i = 0; i < notes1.length; i++) {
      synthRef.current.triggerAttackRelease(notes1[i], "8s");
      bassSynthRef.current.triggerAttackRelease(notes2[i], "10s");
      await new Promise((resolve) => setTimeout(resolve, 4000));

      console.log(`playing: ${notes1[i]} and ${notes2[i]}`);
    }

    console.log("sound sequence complete");
  };

  const toggleSound = async () => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      if (!initialized) {
        await initializeAudio();
      }

      if (playback) {
        console.log("Stopping sound bath");
        setWasPreviouslyPlaying(true);
        stopSoundBath();
      } else {
        console.log("Starting sound bath");
        setPlayback(true);
        setWasPreviouslyPlaying(false);
        playSoundBath();
      }
    } catch (error) {
      console.error("error in toggleSound:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const getButtonText = () =>
    playback ? "Stop" : wasPreviouslyPlaying ? "Resume" : "Start";

  return (
    <>
      <button onClick={toggleSound} disabled={isToggling}>
        {getButtonText()} Sound Bath
      </button>
    </>
  );
}
