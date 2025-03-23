import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

// global variables
let masterGain = null;
let synth = null;
let bassSynth = null;
let reverb = null;
let tremolo = null;
let initialized = false;

export default function SoundBath() {
  const [playback, setPlayback] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [wasPreviouslyPlaying, setWasPreviouslyPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(5); // default 5 minutes

  // refs to track ongoing processes
  const timeoutsRef = useRef([]);
  const playbackRef = useRef(false);
  const sessionEndTimeRef = useRef(null);

  // track currently playing notes
  const activeHighNotesRef = useRef([]);
  const activeBassNoteRef = useRef(null);

  // crystal singing bowl notes
  const crystalBowls = {
    high: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"], // higher pitched bowls
    low: ["C3", "D3", "E3", "F3", "G3", "A3", "B3"], // lower pitched bowls
  };

  // update ref when state changes
  useEffect(() => {
    playbackRef.current = playback;
  }, [playback]);

  // clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    console.log("cleaning up audio resources");

    // clear timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // cancel transport events
    Tone.Transport.cancel();

    // dispose audio nodes
    if (initialized) {
      try {
        if (synth && !synth.disposed) synth.releaseAll();
        if (bassSynth && !bassSynth.disposed) bassSynth.releaseAll();

        if (synth) synth.dispose();
        if (bassSynth) bassSynth.dispose();
        if (tremolo) tremolo.dispose();
        if (reverb) reverb.dispose();
        if (masterGain) masterGain.dispose();

        initialized = false;
      } catch (error) {
        console.error("error during cleanup:", error);
      }
    }

    // reset tracking arrays
    activeHighNotesRef.current = [];
    activeBassNoteRef.current = null;
  };

  // initialize audio after user interaction
  const initializeAudio = async () => {
    if (initialized) {
      console.log("audio already initialized");
      return true;
    }

    try {
      await Tone.start(); // start tone.js after user interaction
      console.log("audiocontext started:", Tone.context.state);

      // master volume control
      masterGain = new Tone.Gain(0.8).toDestination();

      // high notes synth
      synth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 8, decay: 3, sustain: 0.9, release: 15 },
      });

      // low notes synth with smoother settings to prevent choppiness
      bassSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 2, // reduced to prevent overload
        oscillator: {
          type: "sine",
          detune: -5, // slight detune for binaural effect
        },
        envelope: {
          attack: 20, // longer attack to prevent pops/clicks
          decay: 15, // longer decay
          sustain: 0.9, // higher sustain level for smoother sound
          release: 30, // much longer release for smooth fadeout
        },
      });

      // limiter to prevent distortion
      const limiter = new Tone.Limiter(-3);

      // reverb effect
      reverb = new Tone.Reverb({
        decay: 8,
        wet: 0.5,
      });

      await reverb.generate(); // wait for reverb to generate

      // slow pulsing effect with less depth to reduce choppiness
      tremolo = new Tone.Tremolo(0.05, 0.1); // slower rate, less depth
      tremolo.start();

      // connect audio graph
      synth.connect(tremolo);
      tremolo.connect(reverb);
      reverb.connect(limiter);
      limiter.connect(masterGain);

      // bass synth is quieter with smoother processing
      bassSynth.volume.value = -8; // quieter (-8dB)

      // add a low pass filter to bass to make it smoother
      const bassFilter = new Tone.Filter(500, "lowpass");
      bassSynth.connect(bassFilter);
      bassFilter.connect(reverb);

      initialized = true;
      console.log("audio system initialized");
      return true;
    } catch (error) {
      console.error("failed to initialize audio", error);
      return false;
    }
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
    const stdFreq = noteMap[note] || 440;
    return stdFreq * 0.9818;
  };

  // toggle sound on/off
  const toggleSound = async () => {
    if (isToggling) return; // prevent user multiple clicks
    setIsToggling(true);

    try {
      if (playback) {
        console.log(`stopping sound bath, playback state: ${playback}`);
        setWasPreviouslyPlaying(true);
        stopSoundBath();
        setPlayback(false);
      } else {
        // clean up if needed
        if (initialized) {
          cleanupAudio();
        }

        // initialize audio
        const success = await initializeAudio();
        if (!success) {
          console.error("failed to initialize audio");
          setIsToggling(false);
          return;
        }

        console.log("starting sound bath");
        setPlayback(true);
        setWasPreviouslyPlaying(false);

        if (masterGain) {
          masterGain.gain.value = 0.8;
          console.log("master gain set to:", masterGain.gain.value);

          playSoundBath();
        } else {
          console.error("master gain not initialized");
        }
      }
    } catch (error) {
      console.error("error in toggling sound:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const stopSoundBath = () => {
    if (!initialized) return;

    // fade out audio
    if (masterGain) {
      try {
        masterGain.gain.rampTo(0, 2);
      } catch (error) {
        console.error("error fading out:", error);
        masterGain.gain.value = 0;
      }
    }

    // clear timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // reset session end time
    sessionEndTimeRef.current = null;

    // release notes after fade
    const releaseTimeout = setTimeout(() => {
      if (synth && !synth.disposed) synth.releaseAll();
      if (bassSynth && !bassSynth.disposed) bassSynth.releaseAll();

      // clear active notes tracking
      activeHighNotesRef.current = [];
      activeBassNoteRef.current = null;

      console.log("all notes released");
    }, 2500);

    timeoutsRef.current.push(releaseTimeout);
  };

  // get random time interval
  const getRandomInterval = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // get random note
  const getRandomNote = (bowlSet) => {
    return bowlSet[Math.floor(Math.random() * bowlSet.length)];
  };

  // check if notes sound good together
  const isComplementary = (note1, note2) => {
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    const root1 = note1.slice(0, -1);
    const root2 = note2.slice(0, -1);

    const note1Index = notes.indexOf(root1);
    const note2Index = notes.indexOf(root2);

    // good harmonic intervals: 3rds, 5ths, octaves
    const diff = Math.abs(note1Index - note2Index);
    return diff === 0 || diff === 2 || diff === 4 || diff === 7;
  };

  // play high note with management of active notes
  const playHighNote = (note, duration) => {
    if (!synth || synth.disposed || !playbackRef.current) return;

    // keep track of high notes, limit to max 3 high notes at a time
    if (activeHighNotesRef.current.length >= 3) {
      // find the oldest note to release
      const oldestNote = activeHighNotesRef.current.shift();
      synth.triggerRelease(get432Frequency(oldestNote));
      console.log(`releasing oldest high note: ${oldestNote}`);
    }

    // add new note to active notes
    activeHighNotesRef.current.push(note);

    // play the new note
    console.log(`playing high note: ${note} for ${duration}s`);
    const freq = get432Frequency(note);
    synth.triggerAttack(freq);

    // schedule the release
    const releaseTimeout = setTimeout(() => {
      if (!synth || synth.disposed || !playbackRef.current) return;

      synth.triggerRelease(freq);
      console.log(`releasing high note: ${note}`);

      // remove from active notes
      const index = activeHighNotesRef.current.indexOf(note);
      if (index > -1) {
        activeHighNotesRef.current.splice(index, 1);
      }
    }, duration * 1000);

    timeoutsRef.current.push(releaseTimeout);

    return releaseTimeout;
  };

  // play bass note with management of active notes
  const playBassNote = (note, duration) => {
    if (!bassSynth || bassSynth.disposed || !playbackRef.current) return;

    // if there's an active bass note, release it first
    if (activeBassNoteRef.current) {
      console.log(`releasing previous bass note: ${activeBassNoteRef.current}`);
      bassSynth.triggerRelease(get432Frequency(activeBassNoteRef.current));

      // add a small delay to avoid clicks when transitioning bass notes
      const transitionDelay = 200; // 200ms transition delay
      const transitionTimeout = setTimeout(() => {
        triggerBassNote();
      }, transitionDelay);

      timeoutsRef.current.push(transitionTimeout);
    } else {
      triggerBassNote();
    }

    function triggerBassNote() {
      if (!bassSynth || bassSynth.disposed || !playbackRef.current) return;

      // set as active bass note
      activeBassNoteRef.current = note;

      // play the new note
      console.log(`playing bass note: ${note} for ${duration}s`);
      const freq = get432Frequency(note);
      bassSynth.triggerAttack(freq);

      // schedule the release
      const releaseTimeout = setTimeout(() => {
        if (!bassSynth || bassSynth.disposed || !playbackRef.current) return;

        bassSynth.triggerRelease(freq);
        console.log(`releasing bass note: ${note}`);

        // clear the active bass note reference
        if (activeBassNoteRef.current === note) {
          activeBassNoteRef.current = null;
        }
      }, duration * 1000);

      timeoutsRef.current.push(releaseTimeout);

      return releaseTimeout;
    }
  };

  // play sound bath sequence
  const playSoundBath = () => {
    if (!synth || !bassSynth) {
      console.error("synths not initialized");
      return;
    }

    console.log("playing sound bath session");

    // session duration in milliseconds
    const sessionLengthMs = sessionDuration * 60 * 1000;
    sessionEndTimeRef.current = Date.now() + sessionLengthMs;

    // current notes - define here but trigger immediately
    let initialHighNote = getRandomNote(crystalBowls.high);
    let initialLowNote = getRandomNote(crystalBowls.low);

    // make sure first notes are complementary
    while (!isComplementary(initialHighNote, initialLowNote)) {
      initialLowNote = getRandomNote(crystalBowls.low);
    }

    // FIX: play high note immediately
    console.log(`playing initial high note immediately: ${initialHighNote}`);
    const initialHighDuration = getRandomInterval(20, 30);

    // direct call to synth to make sure the high note plays immediately
    const highFreq = get432Frequency(initialHighNote);
    synth.triggerAttack(highFreq);
    activeHighNotesRef.current.push(initialHighNote);

    // schedule release of initial high note
    const releaseHighTimeout = setTimeout(() => {
      if (!synth || synth.disposed || !playbackRef.current) return;

      synth.triggerRelease(highFreq);
      console.log(`releasing initial high note: ${initialHighNote}`);

      // remove from active notes
      const index = activeHighNotesRef.current.indexOf(initialHighNote);
      if (index > -1) {
        activeHighNotesRef.current.splice(index, 1);
      }
    }, initialHighDuration * 1000);

    timeoutsRef.current.push(releaseHighTimeout);

    // play first low note after a delay (doesn't cut off high note)
    const initialLowDelay = 10000; // 10 seconds delay
    const initialLowTimeout = setTimeout(() => {
      if (!playbackRef.current) return;
      console.log(`playing initial low note: ${initialLowNote}`);
      const lowDuration = getRandomInterval(60, 120); // 1-2 minutes
      playBassNote(initialLowNote, lowDuration);
    }, initialLowDelay);

    timeoutsRef.current.push(initialLowTimeout);

    // schedule high notes to play periodically
    const scheduleHighNotes = () => {
      if (!playbackRef.current) return;
      if (
        sessionEndTimeRef.current &&
        Date.now() >= sessionEndTimeRef.current
      ) {
        console.log("session duration reached, stopping");
        stopSoundBath();
        setPlayback(false);
        return;
      }

      // choose a note that's not currently playing if possible
      let nextNote;
      let attempts = 0;
      while (activeHighNotesRef.current.includes(nextNote) && attempts < 10) {
        nextNote = getRandomNote(crystalBowls.high);
        attempts++;
        // break after a few attempts to avoid infinite loop if all notes are playing
        if (attempts > 10) break;
      } 

      // play the high note for 15-30 seconds
      const duration = getRandomInterval(15, 30);
      playHighNote(nextNote, duration);

      // schedule next high note with gap
      const nextInterval = getRandomInterval(10000, 25000); // 10-25 seconds gap
      console.log(`next high note in ${nextInterval / 1000} seconds`);
      const nextTimeout = setTimeout(scheduleHighNotes, nextInterval);
      timeoutsRef.current.push(nextTimeout);
    };

    // schedule bass notes to play periodically
    const scheduleBassNotes = () => {
      if (!playbackRef.current) return;
      if (sessionEndTimeRef.current && Date.now() >= sessionEndTimeRef.current)
        return;

      // find a complementary bass note that works with current high notes
      let nextBassNote;
      let isComplementaryToAll = false;

      // try to find a note complementary to all current high notes, if not possible after several attempts just pick a random one
      let attempts = 0;
      while (!isComplementaryToAll && attempts < 10) {
        nextBassNote = getRandomNote(crystalBowls.low);
        isComplementaryToAll = true;

        // check if complementary to all active high notes
        for (const highNote of activeHighNotesRef.current) {
          if (!isComplementary(highNote, nextBassNote)) {
            isComplementaryToAll = false;
            break;
          }
        }
        attempts++;
      }

      // play the bass note 1-2 mins
      const duration = getRandomInterval(60, 120);
      playBassNote(nextBassNote, duration);

      // schedule next bass note with longer gap
      // nts we schedule the next one before the current one ends but won't play until the current one finishes due to logic in playBassNote
      const nextInterval = getRandomInterval(40000, 80000); // 40-80 seconds
      console.log(`next bass note scheduled in ${nextInterval / 1000} seconds`);
      const nextTimeout = setTimeout(scheduleBassNotes, nextInterval);
      timeoutsRef.current.push(nextTimeout);
    };

    // start high note sequence after initial high note ends
    const highNotesTimeout = setTimeout(() => {
      scheduleHighNotes();
    }, initialHighDuration * 1000 + 5000); // start after first high note ends + 5s

    timeoutsRef.current.push(highNotesTimeout);

    // start bass note sequence after first bass note
    const bassNotesTimeout = setTimeout(() => {
      scheduleBassNotes();
    }, initialLowDelay + 60000); // start after first bass played for a minute

    timeoutsRef.current.push(bassNotesTimeout);

    console.log("sound sequence started");
    console.log(Tone.context.state);
    console.log(Tone.context.sampleRate);
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
      <div>
        <div>
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
        </div>
        <button onClick={toggleSound} disabled={isToggling}>
          {getButtonText()} sounds
        </button>
      </div>
    </>
  );
}
