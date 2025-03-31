import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { IndexContext } from "../../data/IndexProvider";
import { getTextSource } from "../SlidesManager/SlidesManager";
import SoundBath from "../SoundBath/SoundBath";
import SoundEffects from "../SoundEffects/SoundEffects";
import VoiceOver from "../VoiceOver/VoiceOver";
import "./PlaybackController.scss";

function PlaybackController() {
  const location = useLocation().pathname;
  const cleanPath = () => `/${location.split("/")[1]}`;
  const currentRoute = cleanPath().slice(1);

  const indexStore = useContext(IndexContext);

  // volume state for each channel
  const [voiceoverVolume, setVoiceoverVolume] = useState(0.5); // volume for voiceover
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(0.5); // volume for sound effects
  const [soundBathVolume, setSoundBathVolume] = useState(0.5); // volume for sound bath

  // mute state for each channel
  const [isVoiceoverMuted, setVoiceoverMuted] = useState(false);
  const [isSoundEffectsMuted, setSoundEffectsMuted] = useState(false);
  const [isSoundBathMuted, setSoundBathMuted] = useState(false);

  // handle volume change for each channel
  const handleVoiceoverVolumeChange = (event) => {
    setVoiceoverVolume(parseFloat(event.target.value));
  };
  const handleSoundEffectsVolumeChange = (event) => {
    setSoundEffectsVolume(parseFloat(event.target.value));
  };
  const handleSoundBathVolumeChange = (event) => {
    setSoundBathVolume(parseFloat(event.target.value));
  };

  // handle mute toggle for each channel
  const handleVoiceoverMuteToggle = () => {
    setVoiceoverMuted(!isVoiceoverMuted);
  };
  const handleSoundEffectsMuteToggle = () => {
    setSoundEffectsMuted(!isSoundEffectsMuted);
  };
  const handleSoundBathMuteToggle = () => {
    setSoundBathMuted(!isSoundBathMuted);
  };

  function handleNext() {
    // increment the currentTextIndex and update the text
    const nextIndex = indexStore.currentIndex + 1;
    const nextText = getTextSource(currentRoute, nextIndex);
    if (nextText) {
      indexStore.setIndex(nextIndex);
    } else {
      indexStore.setIndex(indexStore.currentIndex);
    }
  }

  const updateCurrentText = () => {
    const text = getTextSource(currentRoute, indexStore.currentIndex);
    indexStore.setCurrentText(text);
  };

  const onVoiceOverEnd = () => {
    handleNext(); // move to the next index automatically
    updateCurrentText();
  };

  // render voiceover on pages where it's required
  const renderVoiceover = () => {
    const pagesWithVoiceover = ["ground", "breathe", "compare", "end"];
    const onHomePageAndStarted = currentRoute === "" && indexStore.started;
    return pagesWithVoiceover.includes(currentRoute) || onHomePageAndStarted ? (
      <VoiceOver
        volume={voiceoverVolume}
        mute={isVoiceoverMuted}
        onMuteToggle={handleVoiceoverMuteToggle}
        onVoiceOverEnd={onVoiceOverEnd}
        currentTextIndex={indexStore.currentIndex}
      />
    ) : null;
  };

  // render channels based on the current page
  const renderChannels = () => {
    switch (currentRoute) {
      case "breathe":
        return (
          <SoundBath
            volume={soundBathVolume}
            mute={isSoundBathMuted}
            onMuteToggle={handleSoundBathMuteToggle}
          />
        );
      case "ground":
      case "compare":
      case "end":
        return (
          <SoundEffects
            volume={soundEffectsVolume}
            mute={isSoundEffectsMuted}
            onMuteToggle={handleSoundEffectsMuteToggle}
            currentRoute={currentRoute}
          />
        );
      default:
        return null; // no other channels
    }
  };

  const voiceover = renderVoiceover();

  return voiceover ? (
    <div className="controller">
      <div className="controller__channels">
        {/* voiceover */}
        {voiceover}
        <div className="controller__channel-info">
          <label className="controller__channel-id">💬 Volume:</label>
          <input
            type="range"
            className="controller__volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={voiceoverVolume}
            onChange={handleVoiceoverVolumeChange}
          />
          <button
            className={`controller__button ${isVoiceoverMuted ? "muted" : ""}`}
            onClick={handleVoiceoverMuteToggle}
          >
            {isVoiceoverMuted ? "▶" : "❚ ❚"}
          </button>
        </div>
      </div>
      {(currentRoute === "compare" ||
        currentRoute === "ground" ||
        currentRoute === "end" ||
        currentRoute === "breathe") && (
        <div className="controller__channels">
          {renderChannels()}

          {/* sound effects */}
          {(currentRoute === "compare" ||
            currentRoute === "ground" ||
            currentRoute === "end") && (
            <div className="controller__channel-info">
              <label className="controller__channel-id">♫ Volume:</label>
              <input
                type="range"
                className="controller__volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={soundEffectsVolume}
                onChange={handleSoundEffectsVolumeChange}
              />
              <button
                className={`controller__button ${
                  isSoundEffectsMuted ? "muted" : ""
                }`}
                onClick={handleSoundEffectsMuteToggle}
              >
                {isSoundEffectsMuted ? "▶" : "❚ ❚"}
              </button>
            </div>
          )}

          {/* sound bath */}
          {currentRoute === "breathe" && (
            <div className="controller__channel-info">
              <label className="controller__channel-id">♫ Volume:</label>
              <input
                type="range"
                className="controller__volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={soundBathVolume}
                onChange={handleSoundBathVolumeChange}
              />
              <button
                className={`controller__button ${
                  isSoundBathMuted ? "muted" : ""
                }`}
                onClick={handleSoundBathMuteToggle}
              >
                {isSoundBathMuted ? "▶" : "❚ ❚"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;
}

export default observer(PlaybackController);
