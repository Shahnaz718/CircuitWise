# CircuitWise: Offline Electrical Troubleshooting Companion

A React Native (Expo) mobile app that guides users through diagnosing common household electrical problems, with safety instructions and step-by-step troubleshooting. It works fully offline.

- **Course:** IT3133, ICA 03 (Individual React Native Project)
- **Reg. No.:** 2022ICT141

> **Safety disclaimer:** CircuitWise gives general guidance only and is not a substitute for a licensed electrician. Never work on live wiring, breaker boards or the inside of appliances.

## Features

- **30 troubleshooting guides** in five categories: Lighting, Outlets, Breakers, Appliances, Wiring
- **Search** by title, symptom or cause
- **Filters** by category, risk level (Low / Medium / High) and difficulty (Easy / Medium / Hard)
- **Detail view** with symptoms, likely causes, tools needed and a risk badge
- **Step-by-step mode** with a safety checklist, a progress bar, warnings, and "Stop here, call a professional" steps on risky guides
- **Favourites and history** saved on the device
- **Safety guide** with shock first aid, do's and don'ts, protective gear and tap-to-call emergency numbers
- **Tools and glossary** explaining 10 tools and 19 electrical terms
- **Dark mode** that stays on after restarting the app
- **No internet needed:** no public APIs and no online databases

## Screens

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Home | Emergency banner, category cards, stats, recently viewed |
| 2 | Problems | Search and filter the guide list |
| 3 | Problem Detail | Full information about one problem |
| 4 | Steps | Guided troubleshooting walkthrough |
| 5 | Safety | First aid, do's and don'ts, emergency contacts |
| 6 | Saved | Favourites and history |
| 7 | Tools and Glossary | Tool descriptions and term definitions |
| 8 | More | Settings, clear data, about, disclaimer |

Navigation uses bottom tabs (Home, Problems, Safety, Saved, More) plus a stack for Problem Detail, Steps and Tools.

## Tech stack

- React Native with Expo
- React Navigation (bottom tabs and native stack)
- expo-sqlite for local storage
- @expo/vector-icons

## Local data

The dataset is written as JavaScript files in `src/data/`. On first launch it is loaded into a SQLite database (`circuitwise.db`), and every screen reads from that database.

| Table | Contents |
|-------|----------|
| problems | 30 troubleshooting guides |
| tools | 10 tools and their uses |
| glossary | 19 electrical terms |
| safety | emergency steps, do's, don'ts, protective gear |
| favorites | the user's saved problems |
| history | viewed, fixed, not fixed and stopped events |
| settings | dark mode and the dataset version |

To change the dataset, edit the files in `src/data/` and increase `DATA_VERSION` in `src/db/database.js`. The app then reloads the reference data and keeps favourites and history.

## Project structure

```
App.js                      app entry point
index.js                    registers the app
metro.config.js             allows SQLite to run in the web preview
src/
  theme.js                  colours, categories, helpers
  context/AppContext.js     database ready state and dark mode
  data/problems.js          the 30 guides
  data/reference.js         tools, glossary, safety tips, contacts
  db/database.js            all SQLite code
  components/ui.js          reusable UI components
  navigation/AppNavigator.js
  screens/                  the 8 screens
```

## How to run

Requires Node.js 18 or newer.

```bash
git clone https://github.com/Shahnaz718/circuitwise.git
cd circuitwise
npm install
npx expo start
```

Then choose one option:

- Press `a` to open an Android emulator (it must already be running)
- Scan the QR code with Expo Go on a phone (`npx expo start --go`)
- Press `w` for the browser preview at http://localhost:8081. SQLite on the web is experimental, so test on a device too.

If something looks stale after changing a config or data file, run `npx expo start -c`.

## Branches and workflow

Each feature was developed on its own branch and merged into `main` with a pull request.

## Author

Reg. No. 2022ICT141
