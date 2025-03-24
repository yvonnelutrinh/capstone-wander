import BreatheAnimation from "../../components/BreatheAnimation/BreatheAnimation";
import Slide from "../../components/Slide/Slide";
import SoundBath from "../../components/SoundBath/SoundBath";
import "./BreathePage.scss";

export default function BreathePage() {
  return (
    <>
      <SoundBath />
      <main className="main">
        <BreatheAnimation />
        <Slide />
      </main>
    </>
  );
}
