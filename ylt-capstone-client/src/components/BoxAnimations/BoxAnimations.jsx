import * as motion from "motion/react-client";
import "./BoxAnimations.scss";

export default function Test() {
  return (
    <>
      <motion.div
        className="box box-red"
        animate={{ rotate: 360 }}
        transition={{ type: "spring", duration: 10 }}
      >
        <div className="box box-green">some text</div>
        <div className="box box-green">more text</div>
      </motion.div>
      <motion.div
        className="box box-red"
        animate={{ rotate: 360 }}
        // transition={{ type: "tween", duration: 4 }}
        transition={{ type: "spring", duration: 4, mass: 0.5 }}
      >
        SPIN w mass
      </motion.div>
      <motion.div
        className="box box-red"
        animate={{ rotate: 360 }}
        // transition={{ type: "tween", duration: 4 }}
        transition={{ type: "spring", duration: 4 }}
      >
        SPIN
      </motion.div>
      <motion.div
        className="box box-red"
        initial={{ scale: 0 }}
        animate={{
          scale: 2,
          transition: { duration: 1 },
        }}
      >
        GROW
      </motion.div>

      <motion.button
        className="box box-red"
        whileTap={{ scale: 2.95 }}
        whileHover={{
          scale: 1.2,
        }}
        onHoverStart={() => console.log("hover started!")}
      >
        HOVER & CLICK
      </motion.button>

      <motion.div
        className="box box-red"
        animate={{
          x: [0, "100%", "-100%", 20, 0, -20],
          transition: { ease: ["easeIn", "easeOut"], duration: 5, mass: 0.5 },
        }}
      >
        MOVE
      </motion.div>

      <motion.div
        className="box box-red"
        animate={{
          x: [0, -100, 0, 100, 0],
          y: [0, -50, 4, -500, 0],
          transition: { times: [0, 0.2, 0.7, 0.85, 1], duration: 4 },
        }}
      >
        X/Y ANIMATE
      </motion.div>

      <motion.div
        className="box box-red"
        animate={{ rotateX: 90 }}
        transition={{
          type: "spring",
          visualDuration: 4,
          bounce: 0.25,
        }}
      >
        SPRING
      </motion.div>

      <motion.a
        className="box box-red"
        animate={{ rotate: 180 }}
        transition={{ type: "spring", damping: 300 }}
      >
        DAMPING
      </motion.a>

      <motion.feTurbulence
        className="box box-red"
        animate={{ baseFrequency: 0.5, scale: 2, transition: { duration: 1 } }}
        transition={{ type: "spring", mass: 0.5 }}
      >
        TURBULENCE
      </motion.feTurbulence>
    </>
  );
}
