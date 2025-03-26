import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./LineFlickerAnimation.scss";
import axios from "axios";
import { SERVER_URL, SERVER_PORT } from "../../App";

export default function LineFlickerAnimation() {
  const [lines, setLines] = useState([]);
  const numLines = 30;
  const [colorPalette, setColorPalette] = useState([
    "#5E7B6C",
    "#8CA39B",
    "#3D5A4F",
    "#A2B9B0",
    "#768F81",
  ]);

  // create lines when component mounts
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

  // create path
  const generatePath = () => {
    const path = [];
    let x = 0, y = 0;

    for (let i = 0; i < 10; i++) {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const offsetX = Math.sin(i * 0.5) * 30; // for future horizontal movement
      const offsetY = Math.cos(i * 0.5) * 30; // wobbly vertical movement

      if (direction === 'horizontal') {
        x += Math.random() * 100 + offsetX;
      } else {
        y += Math.random() * 100 + offsetY;
      }
      path.push([x, y]);
    }
    return path;
  };

  return (
    <motion.div
      className="flicker-animation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{
        duration: 10,
        ease: "easeInOut",
      }}
    >
      {lines.map((line, index) => {
        const path = generatePath();
        const pathData = `M${path[0][0]} ${path[0][1]} ` + path.slice(1).map(p => `L${p[0]} ${p[1]}`).join(" ");

        return (
          <motion.svg
            key={line.id}
            className="flicker-animation__line"
            style={{
              position: "absolute",
              top: `${(index / numLines) * 100}vh`, // space out lines vertically
              left: "0",
              right: "0",
              background: getInterpolatedColor(index, line.offset), // color interpolation
            }}
          >
            <motion.path
              d={pathData} // svg path data
              fill="transparent"
              stroke="white"
              strokeWidth={2 + Math.sin(index * 0.5) * 5}
              // strokeLinecap="round"
            />
          </motion.svg>
        );
      })}
    </motion.div>
  );
}
