import { Howl } from "howler";
import { soundEffects, music } from "../../data/sfxData";
import { useState, useEffect } from "react";

export default function SoundEffects() {
  const audioFiles = {
    ...soundEffects,
    ...music,
  };
  const [sounds, setSounds] = useState({}); // store howler instances
  // const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);

  useEffect(() => {
    // load sounds
    const loadedSounds = Object.fromEntries(
      Object.entries(audioFiles).map(([name, { src, volume }]) => [
        name,
        new Howl({ src: [src], volume: [volume], preload: true }),
      ])
    );

    setSounds(loadedSounds);

    return () => {
      // clean up howler instances
      Object.values(loadedSounds).forEach((sound) => sound.unload());
    };
  }, []);

  const playSound = (soundName) => {
    if (!sounds[soundName]) return;

    // stop the currently playing sound (if any)
    if (currentSound) {
      currentSound.fade(currentSound.volume(), 0, 1000); // fade out over 1 second
      setTimeout(() => currentSound.stop(), 1000);
    }

    const newSound = sounds[soundName];
    newSound.play();
    setCurrentSound(newSound);
    // setTimeout(() => setIsPlaying(false), 2000); // prevent rapid triggering
  };

  return (
    <>
      <div>
        {Object.keys(audioFiles).map((soundName) => (
          <button key={soundName} onClick={() => playSound(soundName)}>
            {soundName}
          </button>
        ))}
      </div>
    </>
  );
}
