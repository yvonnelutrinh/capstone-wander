import { Howl } from "howler";
import { motion, AnimatePresence } from "motion/react";
import { slides } from "../../data/slidesData";
import "./Slide.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Audio from "../Audio/Audio";

export default function Slide() {
  const location = useLocation().pathname;
  const slide = slides[location];
  const text = slide.text;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const navigate = useNavigate();

//   const playNarration() {
//     useEffect(() => {
//     if (currentTextIndex === spriteKey) {
//       narration.play(spriteKey);
//     }
//   }, [currentTextIndex]);
//   if (!slide) return <p>Slide not found</p>;
//   }
  function handleNext() {
    if (text[currentTextIndex + 1]) {
      setCurrentTextIndex(currentTextIndex + 1);
    }

    if (text[currentTextIndex] === 0) {
      navigate(-1);
    }

    if (text[currentTextIndex] === text.length - 1) {
      navigate(slide.nextPage);
    }
  }

  // TODO loading state for end should load slide text "interesting..."
  return (
    <>
      <Audio currentTextIndex={currentTextIndex} />
      <motion.div
        className="slide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTextIndex} // triggers re-animation on change
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
            <button onClick={() => setCurrentTextIndex(currentTextIndex - 1)}>
              Back
            </button>
          )}
          <button onClick={() => handleNext()}>Next</button>
        </div>
      </motion.div>
    </>
  );
}
