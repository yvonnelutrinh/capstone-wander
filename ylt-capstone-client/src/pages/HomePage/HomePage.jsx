import NextButton from "../../components/NextButton/NextButton";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";
import "./HomePage.scss";

export default function HomePage() {
  return (
    <>
      <ToggleTheme />
      <main className="welcome">
        <h1>welcome to wander</h1>
        {/*TODO: texture moving behind welcome msg*/}
        <NextButton />
      </main>
    </>
  );
}
