import { motion } from "motion/react";
import "./CompareCard.scss";

export default function CompareCard({ word }) {

  return (
      <motion.div className="card">
        {word}
      </motion.div>
  );
}