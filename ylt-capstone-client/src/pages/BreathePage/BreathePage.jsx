import BreatheAnimation from "../../components/BreatheAnimation/BreatheAnimation";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";
import "./BreathePage.scss";

export default function BreathePage() {
  return (
    <>
      <ToggleTheme />
      <main className="main">
        <BreatheAnimation />
      </main>
    </>
  );
}
