import "./Footer.scss";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import PlaybackController from "../PlaybackController/PlaybackController";

export default function Footer() {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // hide after 5 seconds
    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.div
      className="footer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "absolute", height: "150px" }} // maintains a hoverable area when header moves
    >
      <motion.footer
        className="footer__content"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          opacity: visible || hovered ? 1 : 0,
          y: visible || hovered ? 0 : 50,
        }}
        transition={{ duration: 0.5 }}
      >
        <PlaybackController />
      </motion.footer>
    </motion.div>
  );
}
