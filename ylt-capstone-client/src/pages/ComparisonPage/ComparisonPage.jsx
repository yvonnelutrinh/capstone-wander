import { useState } from "react";
import Insight from "../../components/Insight/Insight";
import Slide from "../../components/Slide/Slide";
import Words from "../../components/Words/Words";

export default function ComparisonPage() {
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
          setShowInsight={setShowInsight}
          showRegenerate={showRegenerate}
          wordsFinalized={wordsFinalized}
        />
      )}
    </>
  );
}
