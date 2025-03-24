import { useState } from "react";
import Insight from "../../components/Insight/Insight";
import Slide from "../../components/Slide/Slide";
import Words from "../../components/Words/Words";

export default function ComparisonPage() {
  const [showWords, setShowWords] = useState(false);
  const [showWordButtons, setShowWordButtons] = useState(true);
  const [showInsight, setShowInsight] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);
  return (
    <>
      <Slide
        setShowWords={setShowWords}
        setShowWordButtons={setShowWordButtons}
        showWordButtons={showWordButtons}
        setShowInsight={setShowInsight}
        showInsight={showInsight}
        setShowRegenerate={setShowRegenerate}
      />
      {showInsight && <Insight />}
      {showWords && (
        <Words
          showWordButtons={showWordButtons}
          setShowInsight={setShowInsight}
          showRegenerate={showRegenerate}
        />
      )}
    </>
  );
}
