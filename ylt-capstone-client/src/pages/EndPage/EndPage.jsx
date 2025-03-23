import { useParams } from "react-router-dom";
import NextButton from "../../components/NextButton/NextButton";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";

export default function EndPage() {
  const { insight } = useParams();
  console.log(insight);
  return (
    <>
      <ToggleTheme />
      <div>
        {insight
          ? insight
          : "remember to wander and breathe through all the thuings \n Export option? Mind map connecting words"}
      </div>
      <NextButton />
    </>
  );
}
