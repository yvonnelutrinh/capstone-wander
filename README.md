# wander: a digital reset

## overview

wander is a wellness app designed to combat digital fatigue and unlock imagination through a series of exercises. 

By combining guided narration, generative sound baths, and calming animations, wander offers a reset and rejuvenation for the mind.

## installation

### Setup
Generate a [gemini API key](https://ai.google.dev/gemini-api/docs/api-key)
```bash
# Clone the repository
git clone https://github.com/yvonnelutrinh/yvonne-lu-capstone.git

# Navigate to project directory
cd yvonne-lu-capstone

# for each folder, create a .env file given the .env.example (provide your own gemini API key)
# Install dependencies for client AND server
npm install

# Start the development servers
npm run dev
```

## the problem

In our hyper-connected digital world, it's common to experience:
- Chronic digital fatigue
- Creative blockages
- Mental exhaustion

wander addresses these challenges by providing a mindful, technology-enabled solution for mental restoration.

## features

- Guided narrative experience
- Generative sound bath emulating the binaural effect of crystal singing bowls
- Calm animations and user-selected color palettes for light or dark mode

## tech stack

### Frontend
- React
- JavaScript
- SCSS

### Backend
- Node.js
- Express
- SQL

### Libraries
- Tone.js
- howler.js
- Motion for React
- chroma.js
- Gemini API
- random-words.js
