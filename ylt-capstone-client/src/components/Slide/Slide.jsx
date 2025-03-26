import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import NextButton from "../NextButton/NextButton";
import {
  getNumberOfSprites,
  getTextSource,
} from "../SlidesManager/SlidesManager.jsx";
import VoiceOver from "../VoiceOver/VoiceOver";
import "./Slide.scss";

export default function Slide({
  setShowWords,
  setShowInsight,
  setWordsFinalized,
}) {
  const location = useLocation().pathname;
  const cleanPath = () => `/${location.split("/")[1]}`;
  const currentRoute = cleanPath().slice(1);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const currentText = useRef({}); // try storing current text in a ref

  const numberOfSprites = getNumberOfSprites(currentRoute);

  const isTransitioningRef = useRef(false);
  const [isManualBreak, setIsManualBreak] = useState(false);
  const [manualContinueTrigger, setManualContinueTrigger] = useState(0);

  // update text whenever route or index changes
  const updateCurrentText = () => {
    const text = getTextSource(currentRoute, currentTextIndex);
    currentText.current = text || ""; // store it in the ref
  };

  function handleNext() {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // increment the currentTextIndex and update the text
    setCurrentTextIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return getTextSource(currentRoute, nextIndex) ? nextIndex : prevIndex;
    });

    if (numberOfSprites === currentTextIndex + 1) {
      // if we're at the end of the sprites available, enforce manual break
      setIsManualBreak(true);
    }

    // reset transitioning state
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  }

  const onVoiceOverEnd = (autoContinue = true) => {
    updateCurrentText(); // update current text when the voice-over ends
    if (autoContinue) {
      handleNext(); // move to the next index automatically
    } else {
      setIsManualBreak(true); // require manual click to continue
    }
  };

  const getButtonText = () => {
    if (currentText.current.includes("Ready to begin")) return "Begin";
    if (currentText.current.includes("Generate")) return "Generate Words";
    if (currentText.current.includes("happy")) return "Ponder Words";
    if (currentText.current.includes("share")) return "Share";
    return "Skip";
  };

  updateCurrentText();

  return (
    <>
      <VoiceOver
        currentTextIndex={currentTextIndex}
        onVoiceOverEnd={onVoiceOverEnd}
        manualContinue={manualContinueTrigger}
        currentRoute={currentRoute}
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
            {/* {currentText.current} */}
            {typeof currentText === "object"
              ? currentText.current
              : currentText}
          </motion.h1>
        </AnimatePresence>

        <div className="slide__buttons">
          {currentTextIndex > 0 && (
            <button
              className="slide__button"
              onClick={() =>
                setCurrentTextIndex((prev) => Math.max(0, prev - 1))
              }
            >
              Back
            </button>
          )}
          {currentTextIndex + 1 < numberOfSprites && (
            <motion.button
              style={
                ["Begin", "Generate Words", "Ponder Words", "Share"].includes(
                  getButtonText()
                ) && { opacity: 1 }
              }
              className="slide__button"
              onClick={() => {
                if (getButtonText() === "Generate Words") setShowWords(true);
                if (getButtonText() === "Ponder Words") setWordsFinalized(true);
                if (getButtonText() === "Share") setShowInsight(true);
                handleNext();
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {getButtonText()}
            </motion.button>
          )}
          {currentTextIndex + 1 >= numberOfSprites &&
            location !== "/compare" && <NextButton />}
        </div>
      </motion.div>
    </>
  );
}
