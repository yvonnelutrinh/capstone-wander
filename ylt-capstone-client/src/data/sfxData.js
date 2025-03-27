const soundEffects = {
    "windChimesMedium": { src: "/src/assets/audio/koshi-wind-chimes-medium.mp3", volume: 0.2 },
    "windChimesSlow": { src: "/src/assets/audio/koshi-wind-chimes-slow-1.mp3", volume: 0.8 },
    "windChimesSlow2": { src: "/src/assets/audio/koshi-wind-chimes-slow-2.mp3", volume: 0.9 },
    "tingshaCymbal": { src: "/src/assets/audio/tingsha-cymbal.mp3", volume: 0.8 },
    "walking": { src: "/src/assets/audio/walking.mp3", volume: 0.8 },
    "paisteGong": { src: "/src/assets/audio/brilliant-paiste-32-gong.mp3", volume: 0.8 }

};

const music = {
    "intro": { src: "/src/assets/audio/intro.mp3", volume: 0.8 },
    "lo-fi": { src: "/src/assets/audio/lo-fi.mp3", volume: 0.8 },
    "playful": { src: "/src/assets/audio/playful.mp3", volume: 0.8 },
    "whimsical": { src: "/src/assets/audio/whimsical.mp3", volume: 0.05, loop: true },
    "end": { src: "/src/assets/audio/end.mp3", volume: 0.3, loop: 2 }
}

export { soundEffects, music };