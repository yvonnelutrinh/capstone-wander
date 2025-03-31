import { useContext, useState } from "react";
// import { Howler } from "howler";
import "./PlaybackController.scss";
import VoiceOver from "../VoiceOver/VoiceOver";
import SoundBath from "../SoundBath/SoundBath";
import SoundEffects from "../SoundEffects/SoundEffects";
import { useLocation } from "react-router-dom";
import { IndexContext } from "../../data/IndexProvider";
import { getTextSource } from "../SlidesManager/SlidesManager";
import { observer } from "mobx-react-lite";

function PlaybackController() {
  const location = useLocation().pathname;
  const cleanPath = () => `/${location.split("/")[1]}`;
  const currentRoute = cleanPath().slice(1);

  const indexStore = useContext(IndexContext);

  const [voiceoverVolume, setVoiceoverVolume] = useState(0.5); // volume for voiceover
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(0.5); // volume for sound effects
  const [soundBathVolume, setSoundBathVolume] = useState(0.5); // volume for sound bath

  // mute state for each channel
  const [isVoiceoverMuted, setVoiceoverMuted] = useState(false);
  const [isSoundEffectsMuted, setSoundEffectsMuted] = useState(false);
  const [isSoundBathMuted, setSoundBathMuted] = useState(false);

  // handle volume change for voiceover
  const handleVoiceoverVolumeChange = (event) => {
    setVoiceoverVolume(parseFloat(event.target.value));
  };

  // handle volume change for sound effects
  const handleSoundEffectsVolumeChange = (event) => {
    setSoundEffectsVolume(parseFloat(event.target.value));
  };

  // handle volume change for sound bath
  const handleSoundBathVolumeChange = (event) => {
    setSoundBathVolume(parseFloat(event.target.value));
  };

  // handle mute toggle for voiceover
  const handleVoiceoverMuteToggle = () => {
    setVoiceoverMuted(!isVoiceoverMuted);
  };

  // handle mute toggle for sound effects
  const handleSoundEffectsMuteToggle = () => {
    setSoundEffectsMuted(!isSoundEffectsMuted);
  };

  // handle mute toggle for sound bath
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

  // render voiceover on pages where it is required
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

  // const [volumes, setVolumes] = useState({
  //   soundEffects: 50,
  //   music: 30,
  // });

  // const [mutedGroups, setMutedGroups] = useState({
  //   soundEffects: false,
  //   music: false,
  // });

  // const handleVolumeChange = (group, value) => {
  //   // Convert slider value (0-100) to Howler volume (0-1)
  //   const normalizedVolume = value / 100;

  //   // Update Howler volume for the group
  //   Howler.volume(normalizedVolume, group);

  //   // Update local state
  //   setVolumes((prev) => ({
  //     ...prev,
  //     [group]: value,
  //   }));
  // };

  // const toggleMute = (group) => {
  //   const isCurrentlyMuted = mutedGroups[group];

  //   // Toggle mute in Howler
  //   Howler.mute(!isCurrentlyMuted, group);

  //   // Update local state
  //   setMutedGroups((prev) => ({
  //     ...prev,
  //     [group]: !isCurrentlyMuted,
  //   }));
  // };

  const voiceover = renderVoiceover();
  return voiceover ? (
    <div className="controller">
      <div className="controller__channels">
        {/* Voiceover Volume and Mute */}
        {voiceover}
        <div className="controller__channel-info">
          <label>Voiceover Volume:</label>
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
            {isVoiceoverMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>

      {(currentRoute === "comparison" ||
        currentRoute === "ground" ||
        currentRoute === "end" ||
        currentRoute === "breathe") && (
        <div className="controller__channels">
          {/* {voiceover} */}
          {renderChannels()}

          {/* Sound Effects Volume and Mute */}
          {(currentRoute === "comparison" ||
            currentRoute === "ground" ||
            currentRoute === "end") && (
            <div className="controller__channel-info">
              <label>Sound Effects Volume:</label>
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
                {isSoundEffectsMuted
                  ? "Unmute"
                  : "Mute"}
              </button>
            </div>
          )}

          {/* Sound Bath Volume and Mute */}
          {currentRoute === "breathe" && (
            <div className="controller__channel-info">
              <label>Sound Bath Volume:</label>
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
                {isSoundBathMuted ? "Unmute" : "Mute"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;
}
export default observer(PlaybackController);

/* {["soundEffects", "music"].map((group) => (
        <div key={group} className="controller__channel">
          <div className="controller__channel-info">
            <span className="controller__channel-id">
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </span>
            <button
              className={`controller__mute-toggle ${
                mutedGroups[group] ? "is-muted" : ""
              }`}
              onClick={() => toggleMute(group)}
            >
              {mutedGroups[group] ? "Unmute" : "Mute"}
            </button>
          </div>
          <div className="controller__volume-control">
            <input
              type="range"
              min="0"
              max="100"
              value={volumes[group]}
              onChange={(e) =>
                handleVolumeChange(group, Number(e.target.value))
              }
              className="controller__volume-slider"
              disabled={mutedGroups[group]}
            />
            <span className="controller__volume-value">
              {volumes[group]}%
            </span>
          </div>
        </div>
      ))} */
