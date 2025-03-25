import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { slides } from "../../data/slidesData";
import NextButton from "../NextButton/NextButton";
import VoiceOver from "../VoiceOver/VoiceOver";
import "./Slide.scss";

export default function Slide({
  setShowWords,
  setShowInsight,
  setWordsFinalized
}) {
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
  const [isManualBreak, setIsManualBreak] = useState(false);
  const [manualContinueTrigger, setManualContinueTrigger] = useState(0);

  function handleNext() {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (isManualBreak) {
      // when manually continuing after a break
      setManualContinueTrigger((prev) => prev + 1);

      // explicitly move to the next slide text
      setCurrentTextIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= text.length ? prevIndex : nextIndex;
      });

      // reset manual break state
      setIsManualBreak(false);
    } else {
      // normal flow will advance to next slide
      setCurrentTextIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= text.length ? prevIndex : nextIndex;
      });
    }

    // reset transitioning ref after delay
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 750);
  }

  const onVoiceOverEnd = (autoContinue = true) => {
    if (autoContinue) {
      handleNext();
    } else {
      setIsManualBreak(true); // require manual click from user to continue
    }
  };

  // helper function to determine button text
  const getButtonText = () => {
    // if we're not on the last slide
    if (currentTextIndex + 1 < text.length) {
      if (isManualBreak) {
        const currentText = text[currentTextIndex] || "";
        if (currentText.includes("Ready to begin")) {
          return "Begin";
        } else if (currentText.includes("Generate")) {
          return "Generate Words";
        } else if (currentText.includes("happy")) {
          return "Ponder Words";
        } 
      else if (currentText.includes("share")) {
        return "Share";
      } 
        return "Start"; // default to start
      }
      return "Skip";
    }
    return ""; // return empty string for last slide
  };

  if (!slide) return <p>Slide not found</p>;

  return (
    <>
      <VoiceOver
        currentTextIndex={currentTextIndex}
        onVoiceOverEnd={onVoiceOverEnd}
        manualContinue={manualContinueTrigger}
      />
      <motion.div
        className="slide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentTextIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {text[currentTextIndex]}
          </motion.h1>
        </AnimatePresence>

        <div className="slide__buttons">
          {currentTextIndex !== 0 && (
            <button
              className="slide__button"
              onClick={() => {
                setCurrentTextIndex(currentTextIndex - 1);
                setIsManualBreak(false);
              }}
            >
              Back
            </button>
          )}
          {currentTextIndex + 1 < text.length && (
            <motion.button
              style={
                ["Begin", "Generate Words", "Ponder Words", "Share"].includes(
                  getButtonText()
                ) && { opacity: 1 }
              }
              className="slide__button"
              onClick={() => {
                if (getButtonText() === "Generate Words") {
                  setShowWords(true);
                }
                if (getButtonText() === "Ponder Words") {
                  setWordsFinalized(true);
                }
                if (getButtonText() === "Share") {
                  setShowInsight(true);
                }
                handleNext();
              }}
              whileHover={
                ["Begin", "Generate Words", "Ponder Words", "Share"].includes(
                  getButtonText()
                ) && { scale: 1.1 }
              }
              transition={{ duration: 0.2 }}
            >
              {getButtonText()}
            </motion.button>
          )}
          {currentTextIndex + 1 >= text.length && location !== "/compare" && (
            <NextButton />
          )}
        </div>
      </motion.div>
    </>
  );
}
