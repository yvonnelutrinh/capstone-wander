import { motion, AnimatePresence } from "motion/react";
import { slides } from "../../data/slidesData";
import "./Slide.scss";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import VoiceOver from "../VoiceOver/VoiceOver";
import NextButton from "../NextButton/NextButton";

export default function Slide() {
  const location = useLocation().pathname;
  const cleanPath = () => {
    const basePath = location.split("/")[1];
    const cleanPath = `/${basePath}`;
    return cleanPath;
  };

  const slide = slides[cleanPath()];
  const text = slide.text;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const isTransitioningRef = useRef(false);

  function handleNext() {
    if (isTransitioningRef.current) {
      console.log("Skipping - already transitioning");
      return;
    }

    isTransitioningRef.current = true;
    console.log("Starting transition");

    setCurrentTextIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      console.log(`Current: ${prevIndex}, Next: ${nextIndex}`);

      if (nextIndex >= text.length) {
        return prevIndex; // keep same index if we navigating away
      }

      return nextIndex;
    });

    // reset transitioning ref after delay
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 750);
  }

  const onVoiceOverEnd = () => {
    handleNext();
  };

  if (!slide) return <p>Slide not found</p>;

  return (
    <>
      <VoiceOver
        currentTextIndex={currentTextIndex}
        onVoiceOverEnd={onVoiceOverEnd}
      />
      <motion.div
        className="slide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTextIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {text[currentTextIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="slide__buttons">
          {currentTextIndex !== 0 && (
            <button
              className="slide__button"
              onClick={() => {
                if (!isTransitioningRef.current) {
                  setCurrentTextIndex(currentTextIndex - 1);
                }
              }}
            >
              Back
            </button>
          )}
          {currentTextIndex + 1 < text.length && (
            <button className="slide__button" onClick={handleNext}>
              Skip
            </button>
          )}
          {currentTextIndex + 1 >= text.length && <NextButton />}
        </div>
      </motion.div>
    </>
  );
}
