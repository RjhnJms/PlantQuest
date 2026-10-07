# PlantQuest — Project Plan

A game-like, fully offline Android app that teaches elementary students (Grades 3–6) about plants.

---

## 1. Decisions

| Area | Decision |
|---|---|
| Audience | Elementary, Grades 3–6 (Grades 1–2 can use the easiest level) |
| Stack | Expo SDK 57, Expo Router, NativeWind (Tailwind), TypeScript — same as StudyDots |
| Connectivity | Fully offline. No login, no backend, no internet needed |
| Database | `expo-sqlite`, for student data only |
| Content | Plants and quiz questions bundled as TypeScript files |
| Users | One student per phone |
| Images | Original illustrations drawn in code (SVG) |
| Platform | Android APK built with EAS |
| Style | "Sunny Garden Adventure": bright, game-like, chunky, character-led |
| Read-aloud | Text to speech with `expo-speech` (phone's built-in voice, works offline when an offline voice is installed) |

---

## 2. Design system

### Colors
| Name | Hex | Use |
|---|---|---|
| Leaf green | `#5CC44A` (shade `#3A9A2E`) | Main buttons, progress, correct answers |
| Sky blue | `#7FD4F7` / `#4FB8F0` | Sky scenes, selected answer |
| Sunshine yellow | `#FFD23F` (shade `#E0A800`) | Sun, finished stops, rewards |
| Coral | `#FF7A59` | Binhi's pot, gentle "try again" |
| Grape purple | `#9B6BFF` (shade `#7445E0`) | Quests |
| Bubblegum pink | `#FF8FB8` | Blush, avatar, flowers |
| Teal | `#2EC4B6` | Fern, water topics |
| Navy ink | `#2B2D42` | Text |
| Muted text | `#7A7A8C` | Secondary text |
| Cream | `#FFF8E7` | Background |
| Sand | `#EFE6D2` / `#E5DCC8` | Borders, empty tracks |

Bright colors go on characters, buttons and rewards. Text and backgrounds stay calm.

### Typography
- **Fredoka** (rounded, bubbly), bundled via `@expo-google-fonts/fredoka`
- Body text at least 16–18; one big title per screen

### Components
- `ChunkyButton`: 3D button with a darker bottom edge that presses down on tap
- `AnswerCard`: white card with a thick bottom border; states for selected, correct and try again
- `StatPill`: leaf counter and days-visited counter
- `ProgressBar`: thick, rounded bar with a shine
- `PathStop`: round adventure-path stop (done, current or locked)
- `Binhi`: the mascot, with growth stages and moods (happy, cheering, encouraging)
- `SkyHeader`: sky, sun, clouds and hills scene
- `BottomTabBar`: Home, Plants, Quiz, Profile
- `SpeakButton`: speaker icon that reads text aloud and animates while speaking
- `Confetti`, `LeafBurst`: celebration effects

### Motion and feedback
- Taps: small press-down (Reanimated) plus a light vibration (`expo-haptics`)
- Binhi bobs at rest and hops when the answer is right or when tapped
- Correct answer: confetti, leaves fly to the counter, cheerful sound
- Wrong answer: soft sound, gentle hint, never a red "WRONG"

### Read-aloud (text to speech)
- `SpeakButton` (speaker icon) on plant facts, plant parts, quiz questions and each answer choice
- Binhi's speech bubbles are read aloud
- Tapping a plant part says its name and what it does
- Auto-read questions setting: on by default for Grades 1–3
- The sentence being spoken is highlighted
- Speed setting: slow (default for Grades 1–3) or normal
- Speech stops when leaving the screen or tapping the button again
- If the phone has no offline voice, show a friendly tip to download one in Android settings
- Test on a low-end phone; the Filipino voice usually needs a one-time download

### Kid-friendly rules
- Tap targets at least 56px; short, simple sentences (Grade 3 reading level)
- No emojis in UI text
- No timers, no punishment, no ads, no purchases, no pop-ups
- Every session feels complete in about 5 minutes

---

## 3. Screens

| # | Screen | Contents |
|---|---|---|
| 1 | Landing | Sky scene, logo, "Explore the amazing world of plants!", sprout, **Get Started** |
| 2 | Get Started | Logo, "Learn. Discover. Grow.", **Get Started** |
| 3 | About you | "What should we call you?" (first name or nickname, max 20 characters), grade buttons (1–6), **Let's go**, **Skip** (becomes "Explorer") |
| 4 | Home | Greeting, leaves and days counters, Binhi card with growth bar, adventure path of plants, quest card (v2) |
| 5 | Plants | All plants as colorful cards. Locked plants show as silhouettes |
| 6 | Plant details | Big illustration, tap-the-part labels (root, stem, leaf, flower), one fun fact, **Start quiz** |
| 7 | Quiz | Progress bar, Binhi with a speech bubble, answers, **CHECK** then **CONTINUE**, results screen with score and leaves earned |
| 8 | Profile | Avatar, name, grade, date joined, Binhi stage, plants explored, best score, edit profile, read-aloud settings (auto-read, speed), sticker book (v2) |

Screens 1–3 show only on first launch. After that, the app opens on Home.

---

## 4. Game systems

### Leaves (reward points)
| Action | Leaves |
|---|---|
| Explore a plant for the first time | +5 |
| Tap every part of a plant | +3 |
| Correct quiz answer | +2 |
| Perfect quiz | +5 bonus |

### Binhi growth stages
| Stage | Leaves |
|---|---|
| Seed | 0–9 |
| Sprout | 10–24 |
| Sapling | 25–49 |
| Blooming | 50+ |

Growing to a new stage plays a celebration screen.

### Adventure path
- Plants appear in order along a winding trail
- Exploring a plant and finishing its quiz unlocks the next stop
- "You are here" marks the current stop

### Days visited
- Counts days the app was opened. It never resets and never shames.

---

## 5. Quiz

### Levels
| Level | Grades | Topics |
|---|---|---|
| Sprout | 1–4 | Plant parts and what they do, what plants need, kinds of plants (tree, shrub, herb, grass, vine) |
| Sapling | 5–6 | Flower parts, pollination, seeds and spores, how plants reproduce, plants in the environment |

The student's grade picks the starting level. They can choose to try the other level.

### Question types
- **v1:** multiple choice (text), picture choice, tap the part
- **v2:** true or false, drag the label

### Rules
- Sprout quiz: 5 questions. Sapling quiz: 10 questions
- About 15+ questions per level, picked at random
- Every answer shows a one-sentence reason
- All content is reviewed by a science teacher before release

---

## 6. Content

Plants: Sunflower, Fern, Cactus, Rose, Mango, Sampaguita.

Each plant has:
- `id`, `name`, `scientificName`, `color` (theme color), `shortDescription`
- `parts`: root, stem, leaf, flower or fruit, each with a one-sentence explanation
- `funFact`, `level`, illustration component

Files: `src/data/plants.ts`, `src/data/questions.ts`.

---

## 7. Database (expo-sqlite, student data only)

```
profile        id, name, grade, joined_at, onboarded, auto_read, speech_rate
leaves_log     id, amount, reason, ref_id, created_at
plant_progress plant_id, first_viewed_at, parts_tapped, completed
quiz_attempts  id, level, plant_id, started_at, finished_at, score, total
quiz_answers   id, attempt_id, question_id, chosen, is_correct
visits         day (YYYY-MM-DD, primary key)
```

- The database version is tracked with `PRAGMA user_version`, so future updates migrate data instead of wiping it.
- The leaf total is computed from `leaves_log`, so it can always be explained and never goes wrong.
- v2 adds `quests` and `stickers` tables.

---

## 8. Project structure

```
src/
  app/                  screens (Expo Router)
    _layout.tsx
    index.tsx           landing
    get-started.tsx
    about-you.tsx
    (tabs)/             home, plants, quiz, profile
    plant/[id].tsx
    quiz/[level].tsx
    quiz/results.tsx
  components/           ChunkyButton, AnswerCard, Binhi, PathStop, SkyHeader...
  components/art/       plant illustrations, avatar
  data/                 plants.ts, questions.ts
  db/                   schema, migrations, queries
  hooks/                useProfile, useLeaves, useProgress
  lib/                  palette, sounds, haptics, speech, utils
assets/sounds/          bundled sound effects (offline)
```

### Packages
- Add: `expo-sqlite`, `@expo-google-fonts/fredoka`, `expo-audio`, `expo-speech`
- Keep: `expo-haptics`, `react-native-reanimated`, `react-native-svg`, `nativewind`, `lucide-react-native`
- Remove: `@react-native-async-storage/async-storage`, `@expo-google-fonts/nunito`

---

## 9. Build order

1. **Setup:** packages, folders, fonts, Git; a blank screen running on a phone via Expo Go
2. **Design system:** colors, font, ChunkyButton, AnswerCard, ProgressBar, StatPill, BottomTabBar
3. **Art:** Binhi (4 stages and moods), 6 plants, avatar, sky scene
4. **Database:** schema, migrations, helper functions
5. **Content:** plants and Sprout and Sapling questions (draft, then teacher review)
6. **Sample screens:** Home and Quiz, for approval
7. **Remaining screens:** Landing, Get Started, About you, Plants, Plant details, Results, Profile
8. **Polish:** sounds, haptics, read-aloud, confetti, Binhi animations
9. **Testing:** airplane mode (including read-aloud), small phones, lint, typecheck, a test with real kids if possible
10. **Build:** `eas build -p android --profile preview` and install the APK

### Version 2 (after student feedback)
Daily Quests, sticker book, true/false and drag-the-label questions, Filipino language option, optional recorded voice for Binhi.

---

## 10. Open items
- [ ] Language: English only, or English plus Filipino?
- [ ] Check which offline voices are on the target phones
- [ ] Teacher to review plant facts and quiz questions
- [ ] Final plant list (currently 6)
