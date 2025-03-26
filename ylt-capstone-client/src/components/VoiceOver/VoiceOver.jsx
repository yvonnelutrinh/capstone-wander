import { Howl } from "howler";
import { useEffect, useState } from "react";
import {
  getAudioSource,
  sourceConfig,
} from "../SlidesManager/SlidesManager.jsx";
import "./VoiceOver.scss";

export default function VoiceOver({
  currentTextIndex,
  onVoiceOverEnd,
  manualContinue,
  currentRoute,
}) {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    // get the appropriate audio source for the current route and text index
    const audioSource = getAudioSource(currentRoute, currentTextIndex);
    // return config[section].source
    const sprite = sourceConfig[currentRoute].sprites[currentTextIndex].timing;

    // create Howl instance with appropriate configuration
    const newSound = new Howl({
      src: [audioSource],
      sprite: { sprite },
      onend: () => {
        onVoiceOverEnd();
      },
      volume: 0.5,
    });

    if (sprite && sprite.length) {
      newSound.play("sprite");
    }

    // set sound and cleanup
    setSound(newSound);
    return () => {
      if (newSound.state === "loaded") return;
      if (newSound) newSound.unload();
    };
  }, [currentTextIndex, manualContinue, currentRoute]);

  return null;
}
