import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

export default function SoundBath() {
  const [playback, setPlayback] = useState(false);
  const [initialized, setInitialized] = useState(false); // track if AudioContext is initialized
  const [isToggling, setIsToggling] = useState(false);
  const [wasPreviouslyPlaying, setWasPreviouslyPlaying] = useState(false);

  // use refs to store tone objects
  const masterGainRef = useRef(null);
  const synthRef = useRef(null);
  const bassSynthRef = useRef(null);
  const tremoloRef = useRef(null);

  useEffect(() => {
    return () => {
      if (initialized) {
        // dispose audio nodes when component unmounts
        if (synthRef.current) synthRef.current.dispose();
        if (bassSynthRef.current) bassSynthRef.current.dispose();
        if (tremoloRef.current) tremoloRef.current.dispose();
        if (masterGainRef.current) masterGainRef.current.dispose();
      }
    };
  }, [initialized]);

  // initialize audio system only after user interaction
  const initializeAudio = async () => {
    if (!initialized) {
      try {
        await Tone.start(); // start tone.js after user interaction, avoid error with AudioContext
        console.log("AudioContext started:", Tone.context.state);

        // create master gain to control volume
        masterGainRef.current = new Tone.Gain(1).toDestination();

        // create synths
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          // soft, warm tones
          maxPolyphony: 4,
          oscillator: { type: "sine" },
          envelope: { attack: 5, decay: 2, sustain: 0.9, release: 5 },
        });

        bassSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          // deeper tones
          maxPolyphony: 4, // increase from default 4 to prevent error max polyphony exceeded, reduce if too many clashing tones
          oscillator: { type: "sine", detune: -5 }, // detune slightly for binaural effect
          envelope: { attack: 12, decay: 6, sustain: 1, release: 8 },
        });

        // create effects
        tremoloRef.current = new Tone.Tremolo(0.1, 0.3); // 0.1 Hz = slow pulsing? 0.3 depth is less intense supposedly
        tremoloRef.current.start();

        // connect the audio graph
        synthRef.current.connect(tremoloRef.current);
        tremoloRef.current.connect(masterGainRef.current);
        bassSynthRef.current.connect(masterGainRef.current);

        setInitialized(true);
        console.log("audio system initialized successfully");
      } catch (error) {
        console.error("Failed to initiatize audio", error);
      }
    }
  };

  // function to toggle sound
  const toggleSound = async () => {
    if (isToggling) return; // prevent user spamming clicks
    setIsToggling(true);

    try {
      if (!initialized) {
        // initialize audio if not already
        await initializeAudio();
      }
      if (playback) {
        console.log(`stopping sound bath, playback state: ${playback}`);
        setWasPreviouslyPlaying(true); // remember that user already clicked play before
        stopSoundBath();
      } else {
        console.log("starting sound bath");
        setPlayback(true);
        setWasPreviouslyPlaying(false);

        if (masterGainRef.current) {
          // Make sure master gain is audible
          // masterGainRef.current.gain.setValueAtTime(1, Tone.now()); // reset volume before starting
          masterGainRef.current.gain.value = 1;
          console.log("master gain set to:", masterGainRef.current.gain.value);

          playSoundBath();
        } else {
          console.error("Master gain not initialized");
        }
      }
    } catch (error) {
      console.error("Error in toggleSound:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const stopSoundBath = () => {
    setPlayback(false);

    masterGainRef.current.gain.setTargetAtTime(0, Tone.now(), 1.5); // fade out audio over 1.5s

    // // debugging, checking gain value every 500ms
    // let checkGain = setInterval(() => {
    //   console.log("Current gain:", masterGainRef.current.gain.value);
    // }, 500);

    // stop synths after fade out
    setTimeout(() => {
      if (synthRef.current) synthRef.current.releaseAll();
      if (bassSynthRef.current) bassSynthRef.current.releaseAll();
      console.log("all notes released");
    }, 2000);
  };

  // function to play sound bath sequence
  const playSoundBath = async () => {
    if (!synthRef.current || !bassSynthRef.current) {
      console.error("synths not initialized"); // check synth exists before playing, prevent tone.js from crashing
      return;
    }

    console.log("playing note sequence");
    const notes1 = ["C4", "E4", "G4", "B4"]; // higher pitched crystal bowls
    const notes2 = ["C2", "D2", "E2", "G2"]; // lower pitched crystal bowls

    // debugging - play initial notes immediately to test sound
    synthRef.current.triggerAttackRelease(notes1[0], "8s");
    bassSynthRef.current.triggerAttackRelease(notes2[0], "10s");
    console.log("initial notes triggered");

    for (let i = 0; i < notes1.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 4000)); // wait 4s before next notes
      //     if (!playback) {
      //       console.log("playback stopped, breaking loop"); // check if we're still in playback mode before playing next note
      //       break;
      //   }
      console.log(`playing note ${i}: ${notes1[i]} and ${notes2[i]}`);
      synthRef.current.triggerAttackRelease(notes1[i], "8s");
      bassSynthRef.current.triggerRelease(); // stop last bass note before playing new one
      bassSynthRef.current.triggerAttackRelease(notes2[i], "10s");
    }
    //debugging
    console.log("Sound sequence complete");
    console.log(Tone.context.state); // should be "running" or "suspended"
    console.log(Tone.context.sampleRate); // should be 44100 or 48000
    // if cpu usage is too high reduce polyphony/simplify effects/filters
  };

  const getButtonText = () => {
    if (playback) {
      return "Stop";
    } else if (wasPreviouslyPlaying) {
      return "Resume";
    } else {
      return "Start";
    }
  };
  return (
    <>
      <button onClick={toggleSound} disabled={isToggling}>
        {getButtonText()} sounds
      </button>
      {/* <div>{initialized ? "Audio initialized" : "Audio not initialized"}</div>
      <div>{playback ? "Sound playing" : "Sound stopped"}</div> */}
    </>
  );
}
