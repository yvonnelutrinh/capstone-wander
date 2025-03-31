import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./BreatheAnimation.scss";
import axios from "axios";
import { SERVER_URL, SERVER_PORT } from "../../App";

export default function BreatheAnimation() {
  const { innerWidth } = window;

  const lineCount = 20;
  const width = 3000;
  const height = innerWidth > 1024 ? 1500 : 3500;
  const [colorPalette, setColorPalette] = useState([
    "#5E7B6C",
    "#8CA39B",
    "#3D5A4F",
    "#A2B9B0",
    "#768F81",
  ]);

  // fetch color palette from server
  useEffect(() => {
    const fetchPalette = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/colors`);
        setColorPalette(response.data);
      } catch (error) {
        console.error("Failed to fetch color palette:", error);
      }
    };

    fetchPalette();
  }, []);

  // generate wave pts w diagonal line motion
  const generateWavePoints = (index) => {
    const amplitude = 50; // max wave height
    const frequency = 0.01; // wave smoothness
    const baseY = (height / lineCount) * index;

    // create sine wave, vary with horizontal position
    return Array.from({ length: width }, (_, x) => {
      const y = baseY + Math.sin(x * frequency + index * 0.3) * amplitude;
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <motion.div
      className="wave"
      style={{ height: innerWidth > 1024 ? "100%" : "108%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 5,
        ease: "easeInOut",
      }}
    >
      <svg
        className="wave__svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {Array.from({ length: lineCount }, (_, index) => {
          // interpolate color based on line index
          const colorIndex = index % colorPalette.length;

          return (
            <motion.polyline
              key={index}
              className="wave__line"
              points={generateWavePoints(index)}
              animate={{
                scaleY: [1, 1.5, 1],
                translateY: [0, -50, 0],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                delay: index * 0.1,
                repeat: Infinity,
              }}
              stroke={colorPalette[colorIndex]}
              fill="none"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </motion.div>
  );
}
