# Majlis - Frontend

A social platform focused on Islamic content, enabling users to share posts, connect with others, and engage in meaningful discussions through a modern and interactive experience.

This is the frontend client repository. The backend API repository can be found at [belalHehsam/Majlis-socialize-api](https://github.com/belalHehsam/Majlis-socialize-api).

## Features

* **User Authentication**: Secure Login & Register.
* **Home Feed**: Rich content feed with Infinite Scrolling.
* **Post Management**: Create, Edit, and Delete Posts.
* **AI Integration**: AI-Powered Content Moderation & AI Caption Suggestions.
* **Interactions**: Post Likes & Comments System.
* **Real-Time Notifications**: Instant updates for user activities.
* **Social Connections**: Follow & Unfollow Users, Friends System.
* **Real-Time Chat**: Direct messaging with friends.
* **Real-Time Voice Channels**: Audio rooms with peer-to-peer streaming using **WebRTC** and **Socket.IO** signaling (includes speaking detection, mute/unmute, and room controls).
* **Islamic Categories**: Filtered content by categories (Quran, Hadith, Fiqh).
* **Discovery**: Search users & posts, and get user recommendations/suggestions.
* **User Profiles & Settings**: Customizable profiles and account preferences.
* **Responsive Design**: Optimized for mobile and desktop screens.
* **Custom Pages**: Styled 404 and error boundaries.

## Tech Stack

### Frontend

* **React.js**
* **TypeScript**
* **Tailwind CSS**
* **Vite**
* **React Query** (TanStack Query)
* **Socket.IO Client** (Real-time events)
* **WebRTC** (Native peer-to-peer audio connections)

## Getting Started

### Prerequisites

Create a `.env` file in the root directory based on `.env.example`:

```env
VITE_BACKEND_BASE_URL=http://localhost:5000
```

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd majlis-front-end
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Backend Repository

For the API setup and backend instructions, please refer to the backend repository:
[belalHehsam/Majlis-socialize-api](https://github.com/belalHehsam/Majlis-socialize-api)

## License

This project was developed as a team project for educational purposes.

