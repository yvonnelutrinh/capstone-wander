import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { IndexContext } from "../../data/IndexProvider.jsx";
import NextButton from "../NextButton/NextButton";
import Proverb from "../Proverb/Proverb.jsx";
import {
  getNumberOfSprites,
  getTextSource,
} from "../SlidesManager/SlidesManager.jsx";
import "./Slide.scss";

function Slide({ setShowWords, setShowInsight, setWordsFinalized }) {
  const location = useLocation().pathname;
  const cleanPath = () => `/${location.split("/")[1]}`;
  const currentRoute = cleanPath().slice(1);
  const indexStore = useContext(IndexContext);
  const currentTextIndex = indexStore.currentIndex;
  const currentText = indexStore.currentText;

  const numberOfSprites = getNumberOfSprites(currentRoute);

  const isTransitioningRef = useRef(false);

  // update text whenever route or index changes
  const updateCurrentText = () => {
    const text = getTextSource(currentRoute, currentTextIndex);

    indexStore.setCurrentText(text);
  };

  function handleNext() {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextIndex = indexStore.currentIndex + 1;
    const nextText = getTextSource(currentRoute, nextIndex);

    // increment the currentTextIndex and update the text
    if (nextText) {
      indexStore.setIndex(nextIndex);
    } else {
      indexStore.setIndex(indexStore.currentIndex);
    }
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  }

  const getButtonText = () => {
    if (currentText.includes("Ready to begin")) return "Begin";
    if (currentText.includes("Generate")) return "Generate Words";
    if (currentText.includes("happy")) return "Ponder Words";
    if (currentText.includes("Ready to share")) return "Share";
    return "Skip";
  };
  useEffect(() => updateCurrentText(), [currentTextIndex]);

  return (
    <>
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
            {currentText}
          </motion.h1>
        </AnimatePresence>
        {currentRoute === "end" && <Proverb />}
        <motion.div
          className="slide__buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {(currentTextIndex > 0 || currentText.includes("lead")) && (
            <motion.button
              className="slide__button"
              initial={{ opacity: 0.8 }}
              whileHover={{
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
              onClick={() => {
                const nextIndex = indexStore.currentIndex - 1;
                const index = Math.max(0, nextIndex);
                indexStore.setIndex(index);
              }}
            >
              Back
            </motion.button>
          )}
          {currentTextIndex + 1 < numberOfSprites && (
            <motion.button
              initial={{ opacity: 0.8 }}
              whileHover={
                getButtonText() === "Skip"
                  ? {
                      opacity: 1,
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
                    }
                  : {
                      scale: 1.1,
                      opacity: 1,
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
                    }
              }
              className="slide__button"
              onClick={() => {
                if (getButtonText() === "Generate Words") setShowWords(true);
                if (getButtonText() === "Ponder Words") setWordsFinalized(true);
                if (getButtonText() === "Share") setShowInsight(true);
                handleNext();
              }}
            >
              {getButtonText()}
            </motion.button>
          )}
          {currentTextIndex + 1 >= numberOfSprites &&
            location !== "/compare" && <NextButton />}
        </motion.div>
      </motion.div>
    </>
  );
}

export default observer(Slide);
