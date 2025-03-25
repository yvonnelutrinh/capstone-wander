import chroma from "chroma-js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./BreatheAnimation.scss";
import axios from "axios";
import { SERVER_URL, SERVER_PORT } from "../../App";

export default function BreatheAnimation({
  inhaleTime = 5000,
  exhaleTime = 5000,
  transitionTime = 0
}) {
  const totalCycleTime = inhaleTime + exhaleTime + transitionTime * 2;
  const [phase, setPhase] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [colorPalette, setColorPalette] = useState([]);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  // fetch color palette from server
  useEffect(() => {
    const fetchPalette = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/colors`);
        setColorPalette(response.data);
      } catch (error) {
        console.error("Failed to fetch color palette:", error);
        if (storedPalette) {
          setColorPalette(storedPalette.split(','));
        } else {
          // default palette as fallback
          setColorPalette(['#5E7B6C', '#8CA39B', '#3D5A4F', '#A2B9B0', '#768F81']);
        }
      }
    };

    fetchPalette();
  }, []);

  // Set phase and progress
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastTimeRef.current = 0;
      return;
    }

    const animate = (time) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const timeElapsed = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // update cycle progress from 0 to 1
      setProgress((prev) => {
        const newProgress = (prev + timeElapsed / totalCycleTime) % 1;

        // breathing phases, calculate cycle positions
        const inhaleEnd = inhaleTime / totalCycleTime;
        const inhaleTransitionEnd =
          (inhaleTime + transitionTime) / totalCycleTime;
        const exhaleEnd =
          (inhaleTime + transitionTime + exhaleTime) / totalCycleTime;

        if (newProgress < inhaleEnd) {
          setPhase("inhale");
        } else if (newProgress < inhaleTransitionEnd) {
          // Transition period - keep previous phase
        } else if (newProgress < exhaleEnd) {
          setPhase("exhale");
        } else {
          // final transition period - keep previous phase
        }
        return newProgress;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, inhaleTime, exhaleTime, transitionTime, totalCycleTime]);

  // calculate breathing circle size and glow properties
  const calculateBreathingScale = () => {
    const cyclePosition = progress * totalCycleTime;
    const inhaleEnd = inhaleTime / totalCycleTime;
    const inhaleTransitionEnd = (inhaleTime + transitionTime) / totalCycleTime;
    const exhaleEnd =
      (inhaleTime + transitionTime + exhaleTime) / totalCycleTime;

    if (progress < inhaleEnd) {
      // inhale - growing from 1.0 to 1.5
      return 1 + (0.5 * progress) / inhaleEnd;
    } else if (progress < inhaleTransitionEnd) {
      // hold at maximum scale
      return 1.5;
    } else if (progress < exhaleEnd) {
      // exhale - shrinking from 1.5 to 1.0
      const exhaleProgress =
        (progress - inhaleTransitionEnd) / (exhaleEnd - inhaleTransitionEnd);
      return 1.5 - 0.5 * exhaleProgress;
    } else {
      // hold at minimum scale
      return 1.0;
    }
  };

  // generate gradient color based on the current progress and palette
  const generateGradientColor = () => {
    if (!colorPalette || colorPalette.length < 2)
      return "rgba(255, 255, 255, 0.3)";

    // use noise effect by selecting colors based on progress
    const noiseOffset = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    const colorIndex = Math.floor(noiseOffset * (colorPalette.length - 1));
    const nextColorIndex = (colorIndex + 1) % colorPalette.length;

    const blendFactor = (noiseOffset * (colorPalette.length - 1)) % 1;

    const color1 = colorPalette[colorIndex];
    const color2 = colorPalette[nextColorIndex];

    return chroma.mix(color1, color2, blendFactor, "lab").alpha(0.7).css();
  };

  const handleStartClick = () => {
    if (!isAnimating) {
      setProgress(0);
      setPhase("inhale");
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setPhase(null);
    }
  };

  return (
    <>
      {isAnimating && (
        <div className="animation">
          <div className="animation__container">
            <motion.div
              className="animation__circle"
              animate={{
                scale: calculateBreathingScale(),
                boxShadow: `0 0 30px 15px ${generateGradientColor()}, 
                           0 0 60px 30px ${generateGradientColor()}`,
              }}
              transition={{
                duration: 0.1,
                ease: "linear",
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            {phase && (
              <motion.h1
                className="animation__text"
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {phase === "inhale" ? "Inhale" : "Exhale"}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      )}

      <div>
        <motion.button
          className="start-button"
          onClick={handleStartClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? "Stop Animation" : "Begin Animation"}
        </motion.button>
      </div>
    </>
  );
}
