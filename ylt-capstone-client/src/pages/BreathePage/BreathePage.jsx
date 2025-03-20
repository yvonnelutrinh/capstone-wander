import { Link } from "react-router-dom";
import BreatheAnimation from "../../components/BreatheAnimation/BreatheAnimation";
import NextButton from "../../components/NextButton/NextButton";
import "./BreathePage.scss";

export default function BreathePage() {
  return (
    <>
    <main className="main">
      <BreatheAnimation />
      <NextButton />
      </main>
    </>
  );
}
