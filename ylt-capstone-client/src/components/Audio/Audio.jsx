import { Howl } from "howler";
import audioData from "../../data/audioData.js";
import { useLocation } from "react-router-dom";
import "./Audio.scss";
import { useEffect, useState, useRef } from "react";

//TODO: check if howler distorts audio/compresses - randomly sounds robotic
//TODO: FIX OVERLAP/STOP AUDIO WHEN PAGE CHANGING

export default function Audio({ currentTextIndex }) {
  const location = useLocation().pathname;
  const cleanPath = () => {
    const basePath = location.split("/")[1];
    const cleanPath = `/${basePath}`;
    return cleanPath;
  };
  let spritePath = `${cleanPath()}_${currentTextIndex + 1}`;
  const currentSprites = audioData.sprites[cleanPath()] || []; // get sprites for current route
  // convert sprite array into an object with keys like "/_1", "/_2", etc.
  const formattedSprites = Object.fromEntries(
    currentSprites.map((time, index) => [`${cleanPath()}_${index + 1}`, time])
  );
  // use ref to persist howl instance
  const narrationRef = useRef(null);
  const [currentSoundId, setCurrentSoundId] = useState(null);

  useEffect(() => {
    if (!narrationRef.current) {
      narrationRef.current = new Howl({
        src: [audioData.source],
        sprite: formattedSprites,
        volume: 0.5,
      });
    }
  }, [formattedSprites]); // re-render only if sprites change

  useEffect(() => {
    playSprite(spritePath);
  }, [currentTextIndex]);

  function playSprite(s) {
    const narration = narrationRef.current;

    if (!narration) return;

    if (currentSoundId !== null) {
      narration.stop(currentSoundId);
    }

    if (formattedSprites[s]) {
      const newSoundId = narration.play(s);
      setCurrentSoundId(newSoundId);
    } else {
      console.error("sprite not found:", s);
    }
  }
  return null;
}
