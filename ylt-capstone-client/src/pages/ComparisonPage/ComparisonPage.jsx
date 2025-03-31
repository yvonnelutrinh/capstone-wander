import { useContext, useState } from "react";
import Insight from "../../components/Insight/Insight";
import Slide from "../../components/Slide/Slide";
import Words from "../../components/Words/Words";
import SoundEffects from "../../components/SoundEffects/SoundEffects";
import { IndexContext } from "../../data/IndexProvider";

export default function ComparisonPage() {
  const indexStore = useContext(IndexContext);
  if (
    indexStore.currentIndex === 9 &&
    indexStore.currentText === "Continue when you're ready to move on."
  ) {
    indexStore.setIndex(0);
  }

  const [showWords, setShowWords] = useState(false);
  const [showWordButtons, setShowWordButtons] = useState(true);
  const [showInsight, setShowInsight] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [wordsFinalized, setWordsFinalized] = useState(false);

  return (
    <>
      <Slide
        setShowWords={setShowWords}
        setShowInsight={setShowInsight}
        setWordsFinalized={setWordsFinalized}
        wordsFinalized={wordsFinalized}
      />
      {showInsight && <Insight />}
      {showWords && (
        <Words
          showWordButtons={showWordButtons}
          showRegenerate={showRegenerate}
          wordsFinalized={wordsFinalized}
        />
      )}
      <SoundEffects />
    </>
  );
}
