import { Howl } from "howler";
import { soundEffects, music } from "../../data/sfxData";
import { useState, useEffect } from "react";

export default function SoundEffects({ currentRoute, volume, mute }) {
  const audioFiles = {
    ...soundEffects,
    ...music,
  };

  const [sounds, setSounds] = useState({}); // store howler instances
  const [currentSound, setCurrentSound] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction

  // group volume control methods
  const setGroupVolume = (groupName, volume) => {
    Howler.volume(volume, groupName);
  };

  const muteGroup = (groupName) => {
    Howler.mute(true, groupName);
  };

  const unmuteGroup = (groupName) => {
    Howler.mute(false, groupName);
  };

  useEffect(() => {
    // check if user has interacted with page
    const userHasInteracted = localStorage.getItem("hasInteracted");
    if (userHasInteracted) {
      setHasInteracted(true);
    }

    // load sounds
    const loadedSounds = Object.fromEntries(
      Object.entries(audioFiles).map(([name, { src, volume, loop }]) => {
        // determine group based on source object
        const group = Object.keys(soundEffects).includes(name)
          ? "soundEffects"
          : "music";

        const sound = new Howl({
          src: [src],
          volume: volume,
          preload: true,
          loop: loop === true, // set loop only if explicitly true
          group: group,
        });

        // registerChannel(name, sound);

        if (typeof loop === "number") {
          sound.on("end", () => handleLoopedSoundEnd(sound, name, loop));
        }
        return [name, sound];
      })
    );
    setSounds(loadedSounds);
    setGroupVolume("soundEffects", 0.5);
    setGroupVolume("music", 0.3);

    return () => {
      // unregister channels and unload sounds
      Object.values(loadedSounds).forEach((sound) => sound.unload());
    };
  }, []);

  useEffect(() => {
    // play sound if user has interacted
    if (hasInteracted) {
      const soundName = getSoundForRoute(currentRoute);
      if (soundName) {
        playSound(soundName);
      }
    }
  }, [currentRoute, hasInteracted]);

  function getSoundForRoute(route) {
    const soundMapping = {
      "": "intro",
      ground: "windChimesMedium",
      compare: "whimsical",
      end: "end",
    };

    return soundMapping[route] || null;
  }

  const playSound = (soundName) => {
    if (!sounds[soundName]) return;

    // stop the currently playing sound (if any)
    if (currentSound) {
      currentSound.fade(currentSound.volume(), 0, 1000);
      setTimeout(() => currentSound.stop(), 1000);
    }

    const newSound = sounds[soundName];
    newSound.play();
    setCurrentSound(newSound);
  };

  const playCountMap = new Map(); // track how many times each sound has played

  // handle the end of a non-looped sound and handle looping it a specific number of times
  function handleLoopedSoundEnd(sound, soundName, maxPlays) {
    const currentPlayCount = playCountMap.get(soundName) || 0;

    if (currentPlayCount < maxPlays - 1) {
      playCountMap.set(soundName, currentPlayCount + 1);
      sound.play();
    } else {
      playCountMap.delete(soundName); // reset after max loops
    }
  }

  // function to handle user interaction (click, key press, etc.)
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem("hasInteracted", "true"); // store the interaction flag
    }
  };

  useEffect(() => {
    // add event listeners for user interactions
    const handleInteraction = () => handleUserInteraction();

    // listen for any user interaction
    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    // cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (Object.keys(sounds).length > 0) {
      Object.keys(sounds).map((soundName) => {
        sounds[soundName].volume(volume);
        sounds[soundName].mute(mute);
      });
    }
  }, [volume, mute, sounds]);

  return null;
}
