import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import "./Proverb.scss";

export default function () {
  const { insight } = useParams();

  return (
    <motion.div
      className="proverb card"
      initial={{ scale: 0, width: "0%", opacity: 0 }}
      animate={{ scale: 1, width: "100%", opacity: 100 }}
      transition={{ duration: 1.5, ease: "anticipate" }}
    >
      <motion.div
        initial={{ display: "none", clipPath: "inset(0% 100% 0% 100%)" }}
        animate={{ display: "block", clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.75, ease: "anticipate" }}
      >
        <p className="proverb__copy">
          {insight
            ? insight
            : "A wandering mind finds unseen paths; the journey within reveals the way forward."}
        </p>
      </motion.div>
    </motion.div>
  );
}
