import { useContext, useState } from "react";
import Slide from "../../components/Slide/Slide";
import "./HomePage.scss";
import { motion } from "motion/react";
import { observer } from "mobx-react-lite";
import { IndexContext } from "../../data/IndexProvider";

function HomePage() {
  const indexStore = useContext(IndexContext);
  const toggleSlide = () => {
    indexStore.setIndex(0);
    indexStore.setStarted(true);
  };

  return (
    <>
      <main className="welcome">
        {!indexStore.started && (
          <>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              Your journey to clarity starts here
            </motion.h1>
            <motion.p
              className="welcome__sound"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                y: { duration: 1.5, delay: 0.5, ease: "easeOut" },
              }}
            >
              Turn sound on for optimal journey
            </motion.p>
          </>
        )}
        {!indexStore.started && (
          <motion.button
            className="welcome__button"
            onClick={toggleSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              ({ duration: 1, delay: 0.5, ease: "easeOut" },
              { scale: { duration: 0.2, ease: "easeOut" } })
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin
          </motion.button>
        )}
        {indexStore.started && <Slide />}
      </main>
    </>
  );
}

export default observer(HomePage);
