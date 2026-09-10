# Portfolio copy references

Project order is intentional: OBSBOT Camera, Game Backlogger, then Dailies Reminder Mobile App. The last display name refers to the repository named `Dailies_Reminder_Mobile_App`.

The descriptions summarize public source, not fresh runtime verification of those projects. Portfolio browser tests verify this website, not camera hardware or Android notification delivery. Do not turn implementation notes into production, reliability, privacy-certification, usage, or sole-authorship claims.

## OBSBOT Camera

- [Public repository](https://github.com/JVng36/obsbot-shared-camera-bridge)
- [Architecture and activation contract](https://github.com/JVng36/obsbot-shared-camera-bridge/blob/35ca36933a9f8296f6d6ba5b2d38e5855f780d39/README.md#L3-L38): Windows bridge, manually started finite sessions, one-frame look, local vision inference, and a text-only Hermes interface.
- [Plugin tools](https://github.com/JVng36/obsbot-shared-camera-bridge/blob/35ca36933a9f8296f6d6ba5b2d38e5855f780d39/clients/hermes-plugin/plugin.yaml): a bounded camera interface with no start/arm tool.
- [Threat model](https://github.com/JVng36/obsbot-shared-camera-bridge/blob/35ca36933a9f8296f6d6ba5b2d38e5855f780d39/docs/THREAT-MODEL.md): local frame processing does not mean observation text always stays local, and the design is not a privacy certification.

Describe the bridge and plugin as the project, not the upstream camera adapter or vision model as original inventions. Keep private deployment details out of this repository.

## Game Backlogger

- [Public repository](https://github.com/JVng36/game_backlogger)
- [README](https://github.com/JVng36/game_backlogger/blob/05903198c01d1d69a3e3c09f8f42a0191f4b9ab7/README.md): static HTML/CSS/JavaScript, five buckets, per-browser storage, and JSON import/export.
- [State and persistence](https://github.com/JVng36/game_backlogger/blob/05903198c01d1d69a3e3c09f8f42a0191f4b9ab7/state.js)
- [JSON transfer](https://github.com/JVng36/game_backlogger/blob/05903198c01d1d69a3e3c09f8f42a0191f4b9ab7/export-import.js)

Do not describe localStorage as cross-device synchronization. Moving a list between devices requires an explicit export and import. No live demo or hosting claim is included.

## Dailies Reminder Mobile App

- [Public repository](https://github.com/JVng36/Dailies_Reminder_Mobile_App)
- [Original capstone report](https://github.com/JVng36/Dailies_Reminder_Mobile_App/blob/cc25b3c359e2fdb15403a3f645c7b808b1aa0b66/Dailies%20App%20by%20Jay%20Vang%20CPSC%20491%20(1)-1.pdf): coursework context and third-party tutorial references, including DataFlair's task-reminder example.
- [Reminder form and AlarmManager integration](https://github.com/JVng36/Dailies_Reminder_Mobile_App/blob/cc25b3c359e2fdb15403a3f645c7b808b1aa0b66/app/src/main/java/com/example/dailiesandroidapp/ReminderActivity.kt)
- [SQLite storage](https://github.com/JVng36/Dailies_Reminder_Mobile_App/blob/cc25b3c359e2fdb15403a3f645c7b808b1aa0b66/app/src/main/java/com/example/dailiesandroidapp/dbManager.kt)

Keep the coursework context in the portfolio copy. Tutorial citations remain in the original project report and the reference above; they do not need to be repeated in the visitor-facing notes. The report includes planned features and illustrative metrics, which are not shipped features or measured outcomes. Do not claim a Play Store release, reboot-safe notifications, independent scheduling of many reminders, or production readiness. Link the source rather than inventing a download link.

## About and contact

The About text starts with Jay's own introduction and stated interests in gamedev and hardware. The rest is proposed wording based on the selected projects and his preference for a simple site he can understand and later redesign. Jay should review its wording before publication. It deliberately omits employment claims, a résumé, location, and private personal context.

Jay explicitly selected these public contact details for this portfolio:

- [LinkedIn](https://www.linkedin.com/in/jvang75/)
- [vangjay36@gmail.com](mailto:vangjay36@gmail.com)

The email link opens the visitor's email app; the site has no contact form or email backend. This approval is limited to these contact details and does not authorize publishing the site or adding other personal information. Project source links remain on the projects page.
