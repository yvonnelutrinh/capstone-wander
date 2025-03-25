import { useEffect, useState } from "react";
import { motion } from "motion/react";
import "./InfinityAnimation.scss";
import axios from "axios";
import { SERVER_URL, SERVER_PORT } from "../../App";

export default function InfinityAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [colorPalette, setColorPalette] = useState([]);

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

  // calculate x and y coordiantes to animate an infinity symbol
  const generateInfinityPath = () => {
    const points = 60; // # of points to define the path
    const xPoints = [];
    const yPoints = [];
    const a = 100; // width scale
    const b = 50; // height scale

    for (let i = 0; i <= points; i++) {
      // map i to the parameter t in range 0-2π
      const t = (i / points) * Math.PI * 2;

      // equations for infinity symbol
      const x = (a * Math.sin(t)) / (1 + Math.cos(t) * Math.cos(t));
      const y =
        (b * Math.sin(t) * Math.cos(t)) / (1 + Math.cos(t) * Math.cos(t));

      xPoints.push(x);
      yPoints.push(y);
    }

    return {
      x: xPoints,
      y: yPoints,
    };
  };

  const infinityPath = generateInfinityPath();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % colorPalette.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [colorPalette.length]);

  return (
    <div className="glow">
      <motion.div
        className="glow__animation"
        animate={infinityPath}
        transition={{
          duration: 10,
          ease: "linear",
          times: Array.from(
            { length: infinityPath.x.length },
            (_, i) => i / (infinityPath.x.length - 1)
          ),
          repeat: Infinity,
        }}
      >
        <motion.div
          className="glow__colors"
          animate={{
            opacity: [0.6, 0.8, 0.6], // pulse
            scale: [1, 1.1, 1], // subtle breathing effect
            filter: [
              `blur(60px) brightness(1)`,
              `blur(80px) brightness(1.2)`,
              `blur(60px) brightness(1)`,
            ],
          }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          style={{ background: colorPalette[currentIndex] }} // apply the color directly
        />
      </motion.div>
    </div>
  );
}
