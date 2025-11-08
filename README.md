<div align="center">
  <div align="center">
  <!-- Uncomment when banner is ready: -->
  <img src="M-Frontend/groovly-landing/public/assets/banner.png" alt="Groovly Banner" width="100%" style="border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

<p align="center">
   <b>Welcome to Groovly!</b> Transform any gathering into a collaborative concert with our real-time music collaboration platform. Whether it's a house party, road trip, or study session, Groovly lets everyone add songs, vote on the queue, and create the perfect shared soundtrack together! 🎶🎵✨
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •   
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-faqs">FAQs</a> •
  <a href="#-license">License</a>
</p>

---

</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js&logoColor=white)](https://nextjs.org/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-cyan?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.6+-black?logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.webp" width="25px" /> Overview

Groovly is a real-time collaborative music experience platform that brings people together through shared soundtracks. Powered by WebSocket technology and seamless YouTube integration, Groovly creates instant party rooms where every guest becomes a DJ.

Whether you're hosting a house party, embarking on a road trip, or just hanging out with friends, Groovly transforms music listening into a democratic, interactive experience. Guests can add songs to the queue, vote on what plays next, and watch the vibe evolve in real-time.

With multiple room modes (Democratic voting, DJ Mode, and Auto-play), YouTube player integration, and real-time synchronization, Groovly ensures everyone's voice is heard. No more arguing over the aux cord – let the crowd decide!

Built with modern web technologies and a focus on seamless user experience, Groovly makes every gathering more engaging, inclusive, and memorable.

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp" width="25px" /> Key Features

<table>
  <tr>
    <tr>
        <td>
            <h3>🎵 Real-Time Collaboration</h3>
            Instant music synchronization powered by Socket.io - everyone hears the same beat at the same time.
        </td>
        <td>
            <h3>🗳️ Democratic Voting</h3>
            Let the crowd decide! Upvote songs to push them to the top of the queue.
        </td>
    </tr>
    <tr>
        <td>
            <h3>🎧 Multiple Room Modes</h3>
            Choose between Democratic voting, DJ Mode (host controls), or Auto-play for different vibes.
        </td>
        <td>
            <h3>🎬 YouTube Integration</h3>
            Seamless YouTube player with search functionality and instant song additions.
        </td>
    </tr>
    <tr>
        <td>
            <h3>🔗 Easy Room Sharing</h3>
            6-character room codes make joining parties effortless - no complex invites needed.
        </td>
        <td>
            <h3>🎨 Stunning Animations</h3>
            Dynamic CD drawer animations, smooth transitions, and eye-catching visuals powered by Framer Motion.
        </td>
    </tr>
    <tr>
        <td>
            <h3>🔐 Secure Rooms</h3>
            JWT authentication and room-based authorization ensure your party stays private.
        </td>
        <td>
            <h3>⚡ Host Playback Control</h3>
            Synchronized playback across all devices - host controls play, pause, skip, and seek in real-time.
        </td>
    </tr>
  </tr>
</table>

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2699_fe0f/512.webp" width="25px" /> Tech Stack

### Frontend

- **Framework:** [Next.js 14](https://nextjs.org/) <img src="https://img.icons8.com/?size=1200&id=yUdJlcKanVbh&format=jpg" alt="Next.js" width="24" height="24"/>
- **Language:** [TypeScript](https://www.typescriptlang.org/) <img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" alt="TypeScript" width="24" height="24"/>
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) <img src="https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" alt="Tailwind CSS" width="24" height="24"/>
- **Animations:** [Framer Motion](https://www.framer.com/motion/) <img src="https://user-images.githubusercontent.com/7850794/164965509-2a8dc49e-2ed7-4243-a2c9-481b03bbc31a.png" alt="Framer Motion" width="24" height="24"/>
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpHj4UwTW4ANSlNjzQOiiOqfDa6kal9RpF0A&s" alt="Zustand" width="24" height="24"/>

### Backend

- **Runtime:** [Node.js](https://nodejs.org/) <img src="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" alt="Node.js" width="24" height="24"/>
- **Framework:** [Express](https://expressjs.com/) <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4T1YOdxe--UDu6VlEaqifJFs_dIXyiJUM0A&s" alt="Express" width="24" height="24"/>
- **Database:** [MongoDB](https://www.mongodb.com/) <img src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" alt="MongoDB" width="24" height="24"/>
- **Real-time:** [Socket.io](https://socket.io/) <img src="https://cdn.worldvectorlogo.com/logos/socket-io.svg" alt="Socket.io" width="24" height="24"/>
- **Authentication:** [JWT](https://jwt.io/) <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/4/jwt-icon-138bxvrhijus263d2f2wur.png/jwt-icon-aqjx58uyj3lrxtborzgyg.png?_a=DATAg1AAZAA0" alt="Socket.io" width="24" height="24"/>

### APIs & Services

- **Video Platform:** [YouTube API](https://developers.google.com/youtube)
- **HTTP Client:** [Axios](https://axios-http.com/)

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp" width="25px" /> Getting Started

Follow these steps to set up and run Groovly locally:

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1.  **Navigate to backend directory:**

    ```bash
    cd M-Backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `M-Backend` directory:

    ```plaintext
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/dj-party-mode
    JWT_SECRET=your-super-secret-jwt-key-change-in-production
    JWT_EXPIRE=7d
    CLIENT_URL=http://localhost:3000
    ```

4.  **Start MongoDB:**

    ```bash
    # If using local MongoDB
    mongod

    # Or use MongoDB Atlas connection string in MONGODB_URI
    ```

5.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    Backend will run on [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1.  **Navigate to frontend directory:**

    ```bash
    cd M-Frontend/groovly-landing
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the `groovly-landing` directory:

    ```plaintext
    NEXT_PUBLIC_API_URL=http://localhost:5000
    NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to experience Groovly! <img src="https://user-images.githubusercontent.com/74038190/213844263-a8897a51-32f4-4b3b-b5c2-e1528b89f6f3.png" width="23px" />

### Quick Test

1. Register a new account
2. Create a room and get your room code
3. Share the code with friends (or open another browser tab)
4. Start adding songs and voting!

For more detailed setup instructions, check out:

- [Backend Quick Start Guide](M-Backend/QUICKSTART.md)
- [Frontend Sitemap](M-Frontend/SITEMAP.md)

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2753/512.webp" width="23px" /> FAQs

<details>
  <summary><b>Is Groovly free to use?</b></summary>
  <p>Yes, Groovly is completely free! Create unlimited rooms, add unlimited songs, and party with as many friends as you want.</p>
</details>

<details>
  <summary><b>How many people can join a room?</b></summary>
  <p>There's no hard limit! Groovly is designed to handle multiple users in a single room, making it perfect for both intimate gatherings and larger parties.</p>
</details>

<details>
  <summary><b>Do I need a YouTube account?</b></summary>
  <p>No! Groovly uses the YouTube API to stream music, but you don't need a YouTube account to use the platform. Just create a Groovly account and start jamming.</p>
</details>

<details>
  <summary><b>What are the different room modes?</b></summary>
  <p><b>Democratic:</b> Everyone votes, highest votes play next. <b>DJ Mode:</b> Room host controls the queue. <b>Auto-play:</b> Songs play in order without voting.</p>
</details>

<details>
  <summary><b>Can I use Groovly offline?</b></summary>
  <p>Currently, Groovly requires an internet connection for real-time synchronization and YouTube streaming. Trip Mode with offline capabilities is in development!</p>
</details>

<details>
  <summary><b>How do room codes work?</b></summary>
  <p>When you create a room, Groovly generates a unique 6-character code. Share this code with friends, and they can join your room instantly from anywhere!</p>
</details>

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1faf1_1f3fb_200d_1faf2_1f3fc/512.webp" width="25px" /> Contributing

Contributions are welcome! If you'd like to contribute to Groovly, please follow these steps:

1.  Fork the repository
2.  Create a new branch (`git checkout -b feature/your-feature-name`)
3.  Make your changes
4.  Commit your changes (`git commit -m 'Add some amazing feature'`)
5.  Push to the branch (`git push origin feature/your-feature-name`)
6.  Open a Pull Request

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

### Areas for Contribution

- 🎮 New mini-games and interactive features
- 🎨 UI/UX improvements and animations
- 🔊 Audio visualization features
- 📱 Mobile app development
- 🌐 Internationalization and translations
- 🐛 Bug fixes and performance improvements

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/270d_1f3fc/512.webp" width="25px" /> License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f_1f3fc/512.webp" width="25px" /> Acknowledgements

- Built with [Socket.io](https://socket.io/) for seamless real-time communication
- Music powered by [YouTube API](https://developers.google.com/youtube)
- Beautiful animations courtesy of [Framer Motion](https://www.framer.com/motion/)
- Inspired by the universal love of music and the joy of sharing experiences
- Special thanks to all beta testers and party enthusiasts who helped shape Groovly

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

<div align="center">
  <p>Made with <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f9e1/512.webp" width="17px" /> and lots of <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f35d/512.webp" width="19px" /> <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2615/512.webp" width="19px" /> by <code>Sushmit Biswas</code> and <code> Abdul Farooqui </code> </p>
  
  
  <h3>Let's Groovly Together!</h3>
</div>
