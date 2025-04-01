import "./Header.scss";
import ToggleTheme from "../ToggleTheme/ToggleTheme";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { IndexContext } from "../../data/IndexProvider";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const indexStore = useContext(IndexContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // hide after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="header"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "absolute", height: "80px" }} // maintains a hoverable area when header moves
    >
      <motion.header
        className="header__content"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          opacity: visible || hovered ? 1 : 0,
          y: visible || hovered ? 0 : -50,
        }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/">
          <h1>wander</h1>
        </Link>
        <ToggleTheme />
      </motion.header>{" "}
    </motion.div>
  );
}
