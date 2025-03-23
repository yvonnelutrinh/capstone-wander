import NextButton from "../../components/NextButton/NextButton";
import Slide from "../../components/Slide/Slide";
import SoundEffects from "../../components/SoundEffects/SoundEffects";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";
import "./HomePage.scss";

export default function HomePage() {
  return (
    <>
      <ToggleTheme />
      <main className="welcome">
        <h1>welcome to wander</h1>
        {/*TODO: texture moving behind welcome msg*/}
        <Slide />
        <NextButton />
      </main>
      <SoundEffects />
    </>
  );
}
