import NextButton from "../../components/NextButton/NextButton";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";

export default function ErrorPage() {
  return (
    <>
      <ToggleTheme />
      <div>This page does not exist!</div>
      {/*TODO/FUTURE: google fonts uses kaomojis for searches with no results e.g. (·_·) (^-^*) (>_<) (='X'=) (·.·) (;-;)*/}
      <NextButton />
    </>
  );
}
