import Words from "../../components/Words/Words";
import NextButton from "../../components/NextButton/NextButton";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";
import Slide from "../../components/Slide/Slide";

export default function ComparisonPage() {
  return (
    <>
      <ToggleTheme />
      <Slide />
      <Words />
      <NextButton />
    </>
  );
}
