import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LinePulseAnimation.scss";
import axios from "axios";
import { SERVER_URL, SERVER_PORT } from "../../App";

export default function LinePulseAnimation() {
  const [lines, setLines] = useState([]);
  const numLines = 30;
  const [colorPalette, setColorPalette] = useState([
    "#5E7B6C",
    "#8CA39B",
    "#3D5A4F",
    "#A2B9B0",
    "#768F81",
  ]);

  // create the lines when component mounts
  useEffect(() => {
    const generatedLines = Array.from({ length: numLines }, (_, i) => ({
      id: i,
      offset: Math.random() * 100, // random offset for variation
    }));
    setLines(generatedLines);
  }, []);

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

  // interpolate palette colors
  const getInterpolatedColor = (index, offset) => {
    const progress = Math.sin((index + offset) * 0.1) * 0.5 + 0.5; // oscillate between 0 and 1
    const paletteIndex = Math.floor(progress * (colorPalette.length - 1));
    const nextPaletteIndex = Math.min(paletteIndex + 1, colorPalette.length - 1);
    const startColor = colorPalette[paletteIndex];
    const endColor = colorPalette[nextPaletteIndex];
    return `linear-gradient(90deg, ${startColor}, ${endColor})`; // smooth gradient between two colors
  };

  return (
    <div className="pulse-animation">
      <AnimatePresence>
        {lines.map((line, index) => (
          <motion.div
            key={line.id}
            className="pulse-animation__line"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(index / numLines) * 100}vh`, // space out the lines vertically
              background: getInterpolatedColor(index, line.offset), // color interpolation
            }}
            initial={{
              opacity: 0,
              y: 0,
            }} // animation when entering
            animate={{
              opacity: 1,
              y: [
                Math.sin((index + line.offset) * 0.05) * 10, // smooth up and down wave
                Math.sin((index + line.offset) * 0.05 + Math.PI) * 10, // wave motion
              ],
            }}
            exit={{
              opacity: 0,
              y: 0,
            }} // animation when exiting
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: index * 0.1, // each line starts with a delay to simulate wave motion
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
