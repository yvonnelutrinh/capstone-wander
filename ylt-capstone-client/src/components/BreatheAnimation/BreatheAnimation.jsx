import { motion, AnimatePresence } from "framer-motion";
import chroma from "chroma-js";
import "./BreatheAnimation.scss";
import { useEffect, useState, useRef } from "react";
import NextButton from "../NextButton/NextButton";
import { useNavigate } from "react-router-dom";

export default function BreatheAnimation({
  inhaleTime = 4000,
  exhaleTime = 4000,
  transitionTime = 4000,
  intensity = 1.0,
  lineCount = 100,
  maxAmplitude = 120,
}) {
  const totalCycleTime = inhaleTime + exhaleTime + transitionTime * 2;
  const [phase, setPhase] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const palette = localStorage.getItem("palette").split(',');

  // set phase and progress
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
          // transition period - keep previous phase
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

  // calculate breath position using a continuous sine wave
  const calculateBreathPosition = (cyclePosition) => {
    // convert cycle position to radians 0 to 2π
    const radians = (cyclePosition / totalCycleTime) * 2 * Math.PI;

    // use sine wave for smooth transitions -1 to 1
    // offset by -π/2 to start at 0 (sin(-π/2) = -1)
    return -Math.sin(radians - Math.PI / 2);
  };

  // helper functions to calculate wave properties
  const calculateWaveAmplitude = (cyclePosition) => {
    if (cyclePosition < inhaleTime) {
      // Inhale - increasing amplitude, positive values (above centerline)
      return Math.sin((cyclePosition / inhaleTime) * (Math.PI / 2)) * intensity;
    } else {
      // Exhale - decreasing amplitude, negative values (below centerline)
      const exhaleProgress = (cyclePosition - inhaleTime) / exhaleTime;
      return Math.sin((1 - exhaleProgress) * (Math.PI / 2)) * -intensity;
    }
  };

  const calculateWavePosition = (index) => {
    const normalizedIndex = index / (lineCount - 1);
    const cyclePosition = progress * totalCycleTime;
    const breathValue = calculateBreathPosition(cyclePosition);

    const centerEmphasis = Math.exp(
      -Math.pow(normalizedIndex - 0.5, 2) / 0.125
    );

    const breathFactor = calculateWaveAmplitude(cyclePosition);

    // final displacement from center
    return breathValue * maxAmplitude * centerEmphasis * intensity;
  };

  // helper functions for motion component props
  const getCustomY = (index) => {
    return calculateWavePosition(index);
  };

  const getHeight = (index) => {
    const position = calculateWavePosition(index);
    const baseHeight = 0; // height when at rest
    return `${Math.abs(position) + baseHeight}px`;
  };

  const getTopPosition = (index) => {
    const position = calculateWavePosition(index);
    const baseHeight = 0;
    return position < 0 ? "50%" : `calc(50% - ${baseHeight}px)`;
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

  // generate lines
  const lines = Array.from({ length: lineCount }).map((_, index) => {
    const normalizedIndex = index / (lineCount - 1);
    const color = chroma
      .mix(palette[0], palette[4],normalizedIndex, "lab")
      .hex();

    return (
      <motion.div
        key={index}
        className="animation__line"
        style={{
          backgroundColor: color,
          left: `${normalizedIndex * 100}%`,
        }}
        animate={{
          y: getCustomY(index),
          height: getHeight(index),
          top: getTopPosition(index),
        }}
        transition={{
          duration: 0.05,
          ease: "linear",
        }}
      />
    );
  });
  const navigate = useNavigate();
  return (
    <>
      {isAnimating && (
        <div className="animation">
          <div className="animation__container">
            <div className="animation__center-line"></div>
            <div className="animation__lines-wrapper">{lines}</div>
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
              // NTS make inhale/exhale a circle INSIDE animation that feathers out????
            )}
          </AnimatePresence>
        </div>
      )}
      <NextButton preclick={() => setIsAnimating(false)} />

      <div>
        <motion.button
          className="start-button"
          onClick={handleStartClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? "Reset" : "Begin"}
        </motion.button>
      </div>
    </>
  );
}
