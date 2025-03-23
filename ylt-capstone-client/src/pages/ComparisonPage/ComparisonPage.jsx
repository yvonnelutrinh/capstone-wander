import { Link } from "react-router-dom";
import Words from "../../components/Words/Words";
import NextButton from "../../components/NextButton/NextButton";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";

export default function ComparisonPage() {
  return (
    <>
      <ToggleTheme />
      <Words />
      <NextButton />
    </>
  );
}
