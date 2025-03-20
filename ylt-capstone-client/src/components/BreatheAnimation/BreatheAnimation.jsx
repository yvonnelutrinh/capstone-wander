import { motion } from "motion/react";
import { useTime, useTransform } from "framer-motion";
import "./BreatheAnimation.scss";

export default function BreatheAnimation({
  primaryColor = "#2E3192", //blue
  inhaleTime = 4000,
  exhaleTime = 6000,
}) {
  const time = useTime(); //track time
  const scale = useTransform(
    //pulse breathing effect for orb
    time,
    (value) => {
      const progress =
        (value % (inhaleTime + exhaleTime)) / (inhaleTime + exhaleTime); // transforms time value into a cyclical progress value between 0 - 1, based on combined duration of inhale+exhale (10,000):
      return progress < 0.5 // progress is mapped to scale, oscillating between 0.8 - 1.2
        ? 0.8 + progress * 0.8
        : 1.2 - (progress - 0.5) * 0.8;
    }
  );
  return (
    <>
      <motion.div
        className="orb"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: primaryColor,
          scale: scale,
        }}
      />
    </>
  );
}
