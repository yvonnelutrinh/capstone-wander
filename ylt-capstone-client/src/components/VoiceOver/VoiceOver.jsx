import { Howl } from "howler";
import voiceData from "../../data/voiceData.js";
import { useLocation } from "react-router-dom";
import "./VoiceOver.scss";
import { useEffect, useState, useRef } from "react";

export default function VoiceOver({ currentTextIndex, onVoiceOverEnd }) {
  console.log("VoiceOver rendering with index:", currentTextIndex);
  const location = useLocation().pathname;
  const cleanPath = () => {
    const basePath = location.split("/")[1];
    const cleanPath = `/${basePath}`;
    return cleanPath;
  };
  
  const spritePath = `${cleanPath()}_${currentTextIndex + 1}`;
  const currentSprites = voiceData.sprites[cleanPath()] || []; 
  const formattedSprites = Object.fromEntries(
    currentSprites.map((time, index) => [`${cleanPath()}_${index + 1}`, time])
  );
  
  const narrationRef = useRef(null);
  const [currentSoundId, setCurrentSoundId] = useState(null);
  const handlerAttachedRef = useRef(false);
  const isPlayingRef = useRef(false);

  // initialize Howl only once
  useEffect(() => {
    if (!narrationRef.current) {
      narrationRef.current = new Howl({
        src: [voiceData.source],
        sprite: formattedSprites,
        volume: 0.5,
      });
    }
    
    // clean up on unmount
    return () => {
      if (narrationRef.current) {
        narrationRef.current.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    if (narrationRef.current) {
      narrationRef.current._sprite = formattedSprites;
    }
  }, [formattedSprites]);

  // handle voice over end event - set up only once
  useEffect(() => {
    if (narrationRef.current && !handlerAttachedRef.current) {
      narrationRef.current.on('end', (soundId) => {
        console.log("voiceover end")
          console.log("Sound ended, triggering onVoiceOverEnd");
          isPlayingRef.current = false;
          
          if (onVoiceOverEnd) {
            setTimeout(() => {
              onVoiceOverEnd();
            }, 250);
          
        }
      });
      
      handlerAttachedRef.current = true;
    }
  }, [onVoiceOverEnd, currentSoundId]);

  // play audio when currentTextIndex changes
  useEffect(() => {
    playSprite(spritePath);
  }, [currentTextIndex, spritePath]);

  function playSprite(s) {
    const narration = narrationRef.current;
    if (!narration) return;

    // stop any current playback
    if (currentSoundId !== null) {
      narration.stop(currentSoundId);
      isPlayingRef.current = false;
    }

    // play new sprite if it exists
    if (formattedSprites[s]) {
      isPlayingRef.current = true;
      const newSoundId = narration.play(s);
      setCurrentSoundId(newSoundId);
    } else {
      console.error("Sprite not found:", s);
    }
  }
  
  return null;
}
