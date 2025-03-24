import { useState } from "react";
import Slide from "../../components/Slide/Slide";
import "./HomePage.scss";

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const toggleSlide = () => {
    setStarted(true);
  };
  return (
    <>
      <main className="welcome">
        {!started && <h1>welcome. are you ready to begin?</h1>}
        {!started && (
          <button className="welcome__button" onClick={toggleSlide}>
            begin
          </button>
        )}
        {started && <Slide />}
      </main>
      {/* <SoundEffects /> */}
    </>
  );
}
