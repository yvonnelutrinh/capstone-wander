import BreatheAnimation from "../../components/BreatheAnimation/BreatheAnimation";
import SoundBath from "../../components/SoundBath/SoundBath";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";
import "./BreathePage.scss";

export default function BreathePage() {
  return (
    <>
      <ToggleTheme />
      <SoundBath />
      <main className="main">
        <BreatheAnimation />
      </main>
    </>
  );
}
