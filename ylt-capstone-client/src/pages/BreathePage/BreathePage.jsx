import { useContext } from "react";
import BreatheAnimation from "../../components/BreatheAnimation/BreatheAnimation";
import Slide from "../../components/Slide/Slide";
import "./BreathePage.scss";
import { IndexContext } from "../../data/IndexProvider";

export default function BreathePage() {
  const indexStore = useContext(IndexContext);
  indexStore.setIndex(0);

  return (
    <>
      <main className="main">
        <BreatheAnimation />
        <Slide />
      </main>
    </>
  );
}
