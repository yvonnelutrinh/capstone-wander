import { useState } from "react";
import { Howler } from "howler";
import "./PlaybackController.scss";

export default function PlaybackController() {
  const [volumes, setVolumes] = useState({
    soundEffects: 50,
    music: 30,
  });

  const [mutedGroups, setMutedGroups] = useState({
    soundEffects: false,
    music: false,
  });

  const handleVolumeChange = (group, value) => {
    // Convert slider value (0-100) to Howler volume (0-1)
    const normalizedVolume = value / 100;

    // Update Howler volume for the group
    Howler.volume(normalizedVolume, group);

    // Update local state
    setVolumes((prev) => ({
      ...prev,
      [group]: value,
    }));
  };

  const toggleMute = (group) => {
    const isCurrentlyMuted = mutedGroups[group];

    // Toggle mute in Howler
    Howler.mute(!isCurrentlyMuted, group);

    // Update local state
    setMutedGroups((prev) => ({
      ...prev,
      [group]: !isCurrentlyMuted,
    }));
  };

  return (
    <div className="controller">

      {["soundEffects", "music"].map((group) => (
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
      ))}
    </div>
  );
}
