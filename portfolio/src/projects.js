// Edit project copy here. The array order is the order shown on the page.
// Use public links only. Source references and copy boundaries are in CONTENT.md.
export const projects = [
  {
    id: 'obsbot-camera',
    title: 'OBSBOT Camera',
    type: 'Hardware / AI tooling',
    summary: 'An OBSBOT camera bridge that lets an AI assistant request a single snapshot and receive a text description, during a session started by a person.',
    technologies: 'Node.js · Python · Ollama',
    notes: [
      'A Windows bridge handles the camera, and a Hermes plugin exposes a small set of controls. Sessions are started manually and have a time limit. The plugin deliberately has no start-camera tool.',
      'Images are processed by a local vision model, and the tool returns text rather than images. The focus is on deliberate, one-frame access rather than continuous recording. Text descriptions can still reach a cloud-backed assistant.',
    ],
    url: 'https://github.com/JVng36/obsbot-shared-camera-bridge',
  },
  {
    id: 'game-backlogger',
    title: 'Game Backlogger',
    type: 'Browser app',
    summary: 'A browser-based game list for what to play now, what can wait, and what is already finished.',
    technologies: 'HTML · CSS · JavaScript · localStorage',
    notes: [
      'Games live in five buckets: Now, Soon, Someday, Done, and Drop. Each entry can hold a platform, genre, time estimate, and notes.',
      "There is no server or build step. The list stays in that browser's localStorage; JSON import and export provide a way to back it up or move it to another device.",
    ],
    url: 'https://github.com/JVng36/game_backlogger',
  },
  {
    id: 'dailies-reminder',
    title: 'Dailies Reminder Mobile App',
    type: 'Android / Capstone project',
    summary: 'An Android capstone project for creating reminders with a title, date, and time.',
    technologies: 'Kotlin · Android · SQLite',
    notes: [
      'Written in Kotlin with XML layouts. Reminder details are stored in SQLite and displayed in a list, with AlarmManager used to schedule notifications.',
      'This is an older coursework project. The repository includes the original project report.',
    ],
    url: 'https://github.com/JVng36/Dailies_Reminder_Mobile_App',
  },
]
