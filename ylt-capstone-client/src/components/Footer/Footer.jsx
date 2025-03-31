import "./Footer.scss";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import PlaybackController from "../PlaybackController/PlaybackController";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation().pathname;
  const cleanPath = () => `/${location.split("/")[1]}`;
  const currentRoute = cleanPath().slice(1);

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
      style={{ height: currentRoute === "" ? "19%" : null }} // maintains hoverable area when header moves
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
