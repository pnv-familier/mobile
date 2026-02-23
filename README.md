# 👨‍👩‍👧‍👦 Welcome to Family Emotions

Family Emotions is a mobile application designed to help family members share and track their daily emotions. The goal is to strengthen emotional connections in modern families through simple, friendly, and meaningful interactions.

## 📱 About the App

Family Emotions allows users to:

- Share how they feel each day
- View emotional updates from family members
- Build stronger understanding and empathy through consistent emotional check-ins

This mobile app is built using React Native (Expo).

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation & Run

Clone the repository and start the development server:

```bash
git clone https://github.com/pnv-familier/mobile
cd Frontend-Familier
npm install
npm start
```

Then:

- Press `a` to open Android emulator
- Press `i` to open iOS simulator (Mac only)
- Or scan the QR code using Expo Go on your phone

## 🛠️ Tech Stack

- React Native (Expo)
- TypeScript
- Zustand (state management)
- Axios (API communication)

## 📂 Project Structure

```
src/
├── features/     # Feature-based modules
├── navigation/   # App navigation
├── components/   # Shared UI components
├── api/          # API configuration
├── store/        # Global store setup
└── theme/        # Styling and themes
```

## 📌 Notes

- The app follows a feature-based architecture
- Business logic is handled in hooks and stores, not inside UI components
- All API calls go through the backend service
- For coding rules and structure, see the project [guideline documents](./docs/GUIDELINE.md) in the repository
- Reference the [contributing convention](https://github.com/pnv-familier/conventions/tree/main/github) to follow the coding & GitHub standards
