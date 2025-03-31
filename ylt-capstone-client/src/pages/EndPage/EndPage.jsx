import { useContext } from "react";
import Slide from "../../components/Slide/Slide";
import SoundEffects from "../../components/SoundEffects/SoundEffects";
import { IndexContext } from "../../data/IndexProvider";

export default function EndPage() {
  const indexStore = useContext(IndexContext);
  indexStore.setIndex(0);

  return (
    <>
      <Slide />
      <SoundEffects />
    </>
  );
}
