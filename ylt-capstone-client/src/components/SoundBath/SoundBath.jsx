import { useState, useRef } from "react";
import * as Tone from "tone";

export default function SoundBath() {
  const [playback, setPlayback] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [wasPreviouslyPlaying, setWasPreviouslyPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(5); // default 5 minutes

  const sessionEndTimeRef = useRef(null);

  // global variables for audio objects instead of useRef
  let masterGain, synth, bassSynth, reverb, tremolo, delay;

  // crystal singing bowl notes
  const crystalBowls = {
    high: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"], // higher pitched bowls
    low: ["C3", "D3", "E3", "F3", "G3", "A3", "B3"], // lower pitched bowls
  };

  // calculate 432hz tuning frequency
  const get432Frequency = (note) => {
    const noteMap = {
      C3: 130.81,
      D3: 146.83,
      E3: 164.81,
      F3: 174.61,
      G3: 196.0,
      A3: 220.0,
      B3: 246.94,
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
    };
    // adjust from 440hz to 432hz
    return (noteMap[note] || 440) * 0.9818;
  };

  const initializeAudio = async () => {
    if (initialized) return;
    try {
      await Tone.start();
      console.log("AudioContext started:", Tone.context.state);

      masterGain = new Tone.Gain(1).toDestination(); // set gain control

      // synth for soft, warm tones
      synth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 6, // increase from default 4 to prevent error max polyphony exceeded
        oscillator: { type: "sine" },
        envelope: { attack: 5, decay: 2, sustain: 0.9, release: 5 },
      });
      // synth for deeper tones
      bassSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 4,
        oscillator: { type: "sine", detune: -5 },
        envelope: { attack: 12, decay: 6, sustain: 1, release: 8 },
      });

      // effects for immersive sound experience
      tremolo = new Tone.Tremolo(0.1, 0.3).start();
      reverb = new Tone.Reverb({ decay: 4, wet: 0.6 });
      delay = new Tone.FeedbackDelay("8n", 0.5);

      // connect the audio graph
      synth.chain(tremolo, reverb, masterGain);
      bassSynth.chain(delay, masterGain);

      setInitialized(true);
      console.log("audio system initialized successfully");
    } catch (error) {
      console.error("failed to initialize audio:", error);
    }
  };

  const stopSoundBath = () => {
    setPlayback(false);

    // fade out audio
    if (masterGain) {
        try {
          masterGain.gain.rampTo(0, 2);
        } catch (error) {
          console.error("error fading out:", error);
          masterGain.gain.value = 0;
        }
      }
    // reset session end time
    sessionEndTimeRef.current = null;
    
    Tone.Transport.cancel(); // stop any scheduled sounds

    setTimeout(() => {
      // stop synths after fade out
      if (synth) synth.releaseAll();
      if (bassSynth) bassSynth.releaseAll();
      console.log("all notes released");
    }, 2000);
  };

  const playSoundBath = async () => {
    if (!synth || !bassSynth) {
      console.error("synths not initialized");
      return;
    }

    setPlayback(true);
    masterGain.gain.setValueAtTime(1, Tone.now());

    console.log("starting sound bath sequence");
    // session duration in milliseconds
    const sessionLengthMs = sessionDuration * 60 * 1000;
    sessionEndTimeRef.current = Date.now() + sessionLengthMs;

    const notes1 = crystalBowls.high.map((note) => ({
      note,
      frequency: get432Frequency(note),
    }));
    const notes2 = crystalBowls.low.map((note) => ({
      note,
      frequency: get432Frequency(note),
    }));
    for (let i = 0; i < notes1.length; i++) {
      synth.triggerAttackRelease(notes1[i].frequency, "8s");
      bassSynth.triggerAttackRelease(notes2[i].frequency, "10s");
      console.log(`playing: ${notes1[i].note} and ${notes2[i].note}`);
      await new Promise((resolve) => setTimeout(resolve, 4000));
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
        console.log("stopping sound bath");
        setWasPreviouslyPlaying(true);
        stopSoundBath();
      } else {
        console.log("starting sound bath");
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
      <label htmlFor="duration">Session Duration (minutes): </label>
      <select
        id="duration"
        value={sessionDuration}
        onChange={(e) => setSessionDuration(parseInt(e.target.value))}
        disabled={playback}
      >
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
    </>
  );
}
