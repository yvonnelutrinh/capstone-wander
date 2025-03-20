import { motion } from "motion/react";
import chroma from "chroma-js";
import "./WaveAnimation.scss";

export default function WaveAnimation({
  colorPalette = ["#6A11CB", "#FC3A79"],
  inhaleTime = 4000,
  exhaleTime = 4000,
  intensity = 1.0,
  lineCount = 80,
}) {
  const totalCycleTime = inhaleTime + exhaleTime;
  const centerY = 50;

  const lines = Array.from({ length: lineCount }).map((_, index) => {
    const normalizedIndex = index / (lineCount - 1);
    const color = chroma
      .mix(colorPalette[0], colorPalette[1], normalizedIndex, "lab")
      .hex();

    return (
      <motion.div
        key={index}
        className="animation__line"
        style={{ backgroundColor: color, left: `${normalizedIndex * 100}%` }}
        animate={{
          y: [
            centerY + intensity * Math.sin(normalizedIndex * Math.PI * 2) * 20,
            centerY - intensity * Math.sin(normalizedIndex * Math.PI * 2) * 20,
          ],
        }}
        transition={{
          duration: totalCycleTime / 1000,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    );
  });

  return (
    <div className="animation">
      <div className="animation__container">
        <div className="animation__lines-wrapper">{lines}</div>
      </div>
    </div>
  );
}
