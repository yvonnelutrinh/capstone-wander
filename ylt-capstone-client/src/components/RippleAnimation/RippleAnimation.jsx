import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react"
import { useState, useEffect } from "react";
import "./RippleAnimation.scss";

const RippleAnimation = ({
  size = 50,
  color = "#FFFFFF",
  duration = 1,
  rippleCount = 5,
  interval = 1000,
  thickness = 2,
  shape = "square", // options: circle, square, triangle
  continuous = true,
}) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (!continuous && ripples.length >= rippleCount) return;

    const timer = setInterval(() => {
      setRipples((prev) => {
        // keep active ripples only
        const updatedRipples = prev.filter(
          (ripple) => Date.now() - ripple.startTime < duration * 1000
        );

        // add new ripple if under the limit/continuous
        if (continuous || updatedRipples.length < rippleCount) {
          updatedRipples.push({
            id: Date.now(),
            startTime: Date.now(),
          });
        }

        return updatedRipples;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [ripples, rippleCount, duration, interval, continuous]);

  const renderShape = (strokeWidth) => {
    switch (shape) {
      case "square":
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={size - strokeWidth}
            height={size - strokeWidth}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      case "triangle":
        const height = size * 0.866; // height of equilateral triangle
        const points = `${size / 2},${strokeWidth} ${strokeWidth},${height} ${
          size - strokeWidth
        },${height}`;
        return (
          <polygon
            points={points}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      case "circle":
      default:
        return (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth) / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
    }
  };

  return (
    <>
      <motion.div
        className="ripple-wrapper"
        animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            // borderRadius: ["0%", "0%", "50%", "50%", "0%"], //trying to change shape to circle
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        style={{ width: size, height: size }}
      >
        {/* base shape */}
        <svg width={size} height={size}>
          {renderShape(thickness)}
        </svg>

        {/* ripple animation */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="ripple"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: ["easeIn", "easeOut"],
                duration: 5,
              }}
            >
              <svg width={size} height={size}>
                {renderShape(thickness * 0.75)}
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default RippleAnimation;
