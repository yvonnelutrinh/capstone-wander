import { Howl } from "howler";
import sfxData from "../../data/sfxData";
import { useState, useEffect } from "react";

export default function SoundEffects() {
  const [sounds, setSounds] = useState({}); // store howler instances
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // load sounds
    const loadedSounds = Object.fromEntries(
      Object.entries(sfxData).map(([name, { src, volume }]) => [
        name,
        new Howl({ src: [src], volume: [volume], preload: true }),
      ])
    );

    setSounds(loadedSounds);

    return () => {
      // cleanup howler instances
      Object.values(loadedSounds).forEach((sound) => sound.unload());
    };
  }, []);
  const playSound = (soundName) => {
    if (isPlaying || !sounds[soundName]) return;

    setIsPlaying(true);
    sounds[soundName].play();

    setTimeout(() => setIsPlaying(false), 4000); // prevent rapid triggering
  };

  return (
    <>
      <div>
        {Object.keys(sfxData).map((soundName) => (
          <button
            key={soundName}
            onClick={() => playSound(soundName)}
            disabled={isPlaying}
          >
            {soundName}
          </button>
        ))}
      </div>
    </>
  );
}
