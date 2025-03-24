import { Howl } from "howler";
import voiceData from "../../data/voiceData.js";
import { slides } from "../../data/slidesData";
import { useLocation } from "react-router-dom";
import "./VoiceOver.scss";
import { useEffect, useState, useRef } from "react";

export default function VoiceOver({ currentTextIndex, onVoiceOverEnd, manualContinue }) {
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
  const wasManualBreakRef = useRef(false);

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
        console.log("voiceover end");
        isPlayingRef.current = false;
        
        // Check if this was a manual break point
        const isManualBreakPoint = isManualBreakText(cleanPath(), currentTextIndex);
        
        if (onVoiceOverEnd && !wasManualBreakRef.current) {
          setTimeout(() => {
            wasManualBreakRef.current = isManualBreakPoint;
            onVoiceOverEnd(!isManualBreakPoint); // Pass false if it's a manual break point
          }, 250);
        }
      });
      
      handlerAttachedRef.current = true;
    }
  }, [onVoiceOverEnd, currentTextIndex, currentSoundId]);

  // Check if the current text is a manual break point
  function isManualBreakText(path, index) {
    // Check if the sprite for this position is an empty array in voiceData
    if (currentSprites[index] && currentSprites[index].length === 0) {
      return true;
    }
    
    // Also check text content for specific phrases that require manual continuation
    const slideText = slides[path]?.text[index];
    if (slideText) {
      const breakPhrases = [
        "Ready to begin",
        "Click the button to generate your words"
      ];
      
      return breakPhrases.some(phrase => slideText.includes(phrase));
    }
    
    return false;
  }

  // play audio when currentTextIndex changes
  useEffect(() => {
    // Check if this is a manual break point
    const isManualBreak = isManualBreakText(cleanPath(), currentTextIndex);
    
    if (isManualBreak) {
      console.log("Manual break detected, requiring user action");
      wasManualBreakRef.current = true;
      onVoiceOverEnd(false); // Require manual continuation
    } else {
      playSprite(spritePath);
    }
  }, [currentTextIndex, spritePath]);

  // Listen for manual continue trigger from parent
  useEffect(() => {
    if (manualContinue && wasManualBreakRef.current) {
      console.log("Manual continue triggered, playing next sprite");
      wasManualBreakRef.current = false;
      
      // play the current sprite
      playSprite(spritePath);
    }
  }, [manualContinue]);

  function playSprite(s) {
    const narration = narrationRef.current;
    if (!narration) return;

    // stop any current playback
    if (currentSoundId !== null) {
      narration.stop(currentSoundId);
      isPlayingRef.current = false;
    }

    // Check if this sprite is an empty array (break)
    if (Array.isArray(formattedSprites[s]) && formattedSprites[s].length === 0) {
      console.log("Empty sprite array detected, requiring manual continuation.");
      wasManualBreakRef.current = true;
      onVoiceOverEnd(false);
      return;
    }

    // otherwise play new sprite if it exists
    if (formattedSprites[s]) {
      console.log("Playing sprite:", s);
      isPlayingRef.current = true;
      const newSoundId = narration.play(s);
      setCurrentSoundId(newSoundId);
    } else {
      console.error("Sprite not found:", s);
    }
  }
  
  return null;
}