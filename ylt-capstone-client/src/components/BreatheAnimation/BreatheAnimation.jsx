import { motion } from "motion/react";
import chroma from "chroma-js";
import "./BreatheAnimation.scss";
import { useEffect, useState, useRef } from "react";

export default function BreatheAnimation({
  colorPalette = ["#6A11CB", "#FC3A79"],
  inhaleTime = 4000,
  exhaleTime = 4000,
  intensity = 1.0,
  lineCount = 80,
}) {
  const totalCycleTime = inhaleTime + exhaleTime;
  const [phase, setPhase] = useState("inhale");
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  // set phase and progress
  useEffect(() => {
    const animate = (time) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const timeElapsed = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // update cycle progress from 0 to 1
      setProgress((prev) => {
        const newProgress = (prev + timeElapsed / totalCycleTime) % 1;

        // breathing phase
        if (newProgress < inhaleTime / totalCycleTime) {
          setPhase("inhale");
        } else {
          setPhase("exhale");
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
  }, [inhaleTime, exhaleTime, totalCycleTime]);

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
    const phaseOffset = normalizedIndex * 2 * Math.PI;
    const timePhase = progress * 2 * Math.PI;
    const combinedPhase = timePhase - phaseOffset;

    const cyclePosition = progress * totalCycleTime;
    const breathFactor = calculateWaveAmplitude(cyclePosition);

    // Final displacement from center
    return Math.sin(combinedPhase) * 40 * Math.abs(breathFactor);
  };

  // helper functions for motion component props
  const getCustomY = (index) => {
    return calculateWavePosition(index);
  };

  const getHeight = (index) => {
    const position = calculateWavePosition(index);
    return `${Math.abs(position) + 20}px`;
  };

  const getTopPosition = (index) => {
    const position = calculateWavePosition(index);
    return position < 0 ? "50%" : "calc(50% - 20px)";
  };

  // generate lines
  const lines = Array.from({ length: lineCount }).map((_, index) => {
    const normalizedIndex = index / (lineCount - 1);
    const color = chroma
      .mix(colorPalette[0], colorPalette[1], normalizedIndex, "lab")
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

  return (
    <div className="animation">
      <div className="animation__container">
        <div className="animation__center-line"></div>
        <div className="animation__lines-wrapper">{lines}</div>
      </div>
      <p className="animation__text">
        {phase === "inhale" ? "Inhale" : "Exhale"}
      </p>
    </div>
  );
}
