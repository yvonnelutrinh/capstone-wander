export const sourceConfig = {
  "": {
    source: "/src/assets/audio/wander-narration.mp3",
    sprites: {
      0: {
        timing: [0, 5400],
        text: "Your mind wasn’t made to sit in one place all day. Let’s take it somewhere new.",
      },
      1: {
        timing: [5400, 5920],
        text: "Step off the familiar path. Breathe in. Get a little lost.",
      },
      2: {
        timing: [11320, 1960],
        text: "Who knows what you might find?",
      },
    },
  },
  ground: {
    source: "/src/assets/audio/wander-narration.mp3",
    sprites: {
      0: {
        timing: [13280, 2360],
        text: "Feeling a little untethered?",
      },
      1: {
        timing: [15640, 4120],
        text: "Before we begin, take a moment to land where you are.",
      },
      2: {
        timing: [19760, 2000],
        text: "Feel the surface beneath you.",
      },
      3: {
        timing: [21760, 2240],
        text: "The weight of your hands resting.",
      },
      4: {
        timing: [24000, 2300],
        text: "The rhythm of your breath.",
      },
      5: {
        timing: [26040, 2850],
        text: "Now, notice one thing you can hear.",
      },
      6: {
        timing: [28740, 2250],
        text: "One thing you can feel.",
      },
      7: {
        timing: [30240, 2200],
        text: "One thing you can see.",
      },
      8: {
        timing: [33000, 1560],
        text: "You’re here.",
      },
      9: {
        timing: [34560, 2000],
        text: "And now, you’re ready to roam.",
      },
      10: {
        timing: [],
        text: "Ready to begin?",
      },
    },
  },
  breathe: {
    source: "/src/assets/audio/wander-narration.mp3",
    sprites: {
      0: {
        timing: [36820, 2760],
        text: "Close your eyes or soften your gaze.",
      },
      1: {
        timing: [39060, 4800],
        text: "Let your shoulders drop, like a traveler setting down their pack.",
      },
      2: {
        timing: [0, 6000],
        text: "Breathe in...",
        source: "/src/assets/audio/breathe-in-1.mp3",
      },
      3: {
        timing: [0, 6000],
        text: "Breathe out...",
        source: "/src/assets/audio/breathe-out-1.mp3",
      },
      4: {
        timing: [0, 6000],
        text: "Breathe in...",
        source: "/src/assets/audio/breathe-in-2.mp3",
      },
      5: {
        timing: [0, 6000],
        text: "Breathe out...",
        source: "/src/assets/audio/breathe-out-2.mp3",
      },
      6: {
        timing: [0, 6000],
        text: "Breathe in...",
        source: "/src/assets/audio/breathe-in-3.mp3",
      },
      7: {
        timing: [0, 6000],
        text: "Breathe out...",
        source: "/src/assets/audio/breathe-out-3.mp3",
      },
      8: {
        timing: [0, 6000],
        text: "Keep breathing at your own pace.",
        source: "/src/assets/audio/keep-breathing.mp3",
      },
      9: {
        timing: [0, 6000],
        text: "Continue when you're ready to move on.",
        source: "/src/assets/audio/continue.mp3",
      },
    },
  },
  compare: {
    source: "/src/assets/audio/wander-narration.mp3",
    sprites: {
      0: {
        timing: [52120, 3040],
        text: "Your mind is a map, full of untraveled roads.",
      },
      1: {
        timing: [55160, 2920],
        text: "Now, let’s take an unexpected turn.",
      },
      2: {
        timing: [58080, 2520],
        text: "Two words will appear before you.",
      },
      3: {
        timing: [],
        text: "Generate words to begin.",
      },
      4: {
        timing: [60000, 6500],
        text: "They may seem unrelated, but the most interesting paths are the ones you weren't looking for.",
      },
      5: {
        timing: [],
        text: "Are you happy with these words?",
      },
      6: {
        timing: [66000, 2300],
        text: "Where do these words lead you?",
      },
      7: {
        timing: [68600, 4300],
        text: "A memory? A feeling? A pattern?",
      },
      8: {
        timing: [72000, 2200],
        text: "Follow the trail.",
      },
      9: {
        timing: [74060, 4000],
        text: "Hold these words lightly, like a pair of curious signposts.",
      },
      10: {
        timing: [78000, 3480],
        text: "Wander between them. See what bridges form.",
      },
      11: {
        timing: [81000, 2880],
        text: "When you're ready, share what you’ve discovered.",
      },
      12: {
        timing: [],
        text: "Ready to share?",
      },
      13: {
        timing: [84000, 2000],
        text: "Type what came to you.",
      },
    },
  },
  end: {
    source: "/src/assets/audio/wander-narration.mp3",
    sprites: {
      0: {
        timing: [91000, 2000],
        text: "A proverb appears.",
      },
      1: {
        timing: [93000, 4500],
        text: "Perhaps a reflection of what you’ve found, or a new path to follow.",
      },
      2: {
        timing: [88080, 3000],
        text: "The world is full of hidden connections.",
      },
      3: {
        timing: [97000, 4000],
        text: "Funny how a little detour can change the way you see things.",
      },
      4: {
        timing: [106790, 3640],
        text: "Maybe this is just the start of the journey.",
      },
    },
  },
  // delays for each section
  delays: {
    breathe: 2500, // pause after breathing sections
    compare: 2000, // slight pause for reflection
    grounding: 5000, // extended pause for grounding steps
  },
};

// helper function to get text for a specific section
export function getTextSource(section, index) {
  const config = sourceConfig;
  if (!config) {
    console.warn(`Source type "${type}" not found.`);
    return null;
  }
  const sectionConfig = config[section];
  if (!sectionConfig) {
    console.warn(`Section "${section}" not found in sourceConfig.`);
    return null;
  }

  const spriteConfig = sectionConfig.sprites[index];
  if (!spriteConfig) {
    return null;
  }

  const textConfig = spriteConfig.text;
  if (!textConfig) {
    console.warn(`Text "${text}" not found in section "${section}".`);
  }

  return textConfig;
}

// helper function to get audio for a specific section
export function getAudioSource(section, index) {
  const config = sourceConfig;
  if (!config) {
    console.warn(`Source type "${type}" not found.`);
    return null;
  }
  const sectionConfig = config[section];
  if (!sectionConfig) {
    console.warn(`Section "${section}" not found in sourceConfig.`);
    return null;
  }

  const spriteConfig = sectionConfig.sprites[index];
  if (!spriteConfig) {
    console.warn(`Index "${index}" not found in section "${section}".`);
    return null;
  }

  // check if a custom source is provided and prioritize
  const customSource = spriteConfig.source;

  if (customSource) {
    return customSource;
  }

  // fallback to default source
  return sectionConfig.source;
}

// helper function to find the number of sprites in current section
export function getNumberOfSprites(section) {
  const config = sourceConfig;
  if (!config) {
    console.warn(`Source type "${type}" not found.`);
    return null;
  }
  const sectionConfig = config[section];
  if (!sectionConfig) {
    console.warn(`Section "${section}" not found in sourceConfig.`);
    return null;
  }

  const numberOfSprites = Object.keys(sectionConfig.sprites).length;
  return numberOfSprites;
}
