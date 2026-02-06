<div align="center">

# 🌍 GeoPulse

### **Real-time Geolocation & Network Performance Monitoring**
*Experience the future of tracking with Liquid Glass UI*

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
</p>

[Features](#-features) • [Modes](#-modes) • [Installation](#-installation) • [Configuration](#-configuration) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Why GeoPulse?

GeoPulse isn't just a tool; it's an **experience**. Built with the cutting-edge **Liquid Glass** design system inspired by iOS 26, it merges functionality with breathtaking aesthetics. It provides real-time insights into your location and network status, wrapped in a beautiful, responsive interface.

---

## ⚡ Features in Detail

### 🌍 **Advanced Geolocation Engine**
*   **Real-time Tracking:** Continuous monitoring of Latitude, Longitude, and Altitude.
*   **Smart Geofencing:** Automatically detects when you enter or leave defined zones (Home, Office, etc.).
*   **Live Metrics:**
    *   **Speed:** Current velocity in km/h.
    *   **Accuracy:** GPS precision radius.
    *   **Heading:** Compass direction of movement.
*   **Line Integration:** Automatic notifications sent to LINE when entering/exiting geofences.

### � **Next-Gen UX (Liquid Glass)**
*   **Dynamic Island:** An interactive notification hub that expands to show tracking details, alerts, and status updates naturally.
*   **Adaptive Theme:** Seamlessly switches between Light and Dark modes with glassmorphism effects that adapt to the background.
*   **Fluid Animations:** Smooth transitions and micro-interactions powered by `framer-motion` concepts (custom implemented).

### 🛠️ **System Tools**
*   **Network Intelligence:** Monitors connection type (4G/5G/WiFi), latency, and estimating download speeds.
*   **System Info:** detailed device capabilities, battery status (if supported), and browser environment.
*   **SOS System:** Emergency trigger to send immediate alerts with current location.

---

## � App Modes

GeoPulse adapts to your needs with specialized operational modes:

| Mode | Icon | Description |
|------|:----:|-------------|
| **Family Mode** | 👨‍👩‍👧‍👦 | Shares accurate, real-time location with family members. Ideal for safety and coordination. |
| **Private Mode** | 🔒 | Restricts location sharing details while keeping local tracking active. Focuses on privacy. |
| **Pocket Mode** | 👁️ | A battery-saving overlay designed for when the phone is in your pocket. Prevents accidental touches while maintaining tracking active in the background. |

---

## � Screenshots

<div align="center">
  <img src="docs/screenshot-main.png" alt="Main Interface" width="45%">
  <img src="docs/screenshot-dark.png" alt="Dark Mode" width="45%">
</div>

---

## �🚀 Quick Start

Get up and running in seconds.

### Prerequisites
*   Node.js 18+
*   npm or yarn

### Installation

```bash
# 1. Clone the magic
git clone https://github.com/Gaer12TH/GeoPulse.git

# 2. Enter the portal
cd GeoPulse

# 3. Install dependencies
npm install

# 4. Ignite the engine
npm run dev
```

> The app will launch at `http://localhost:5173` 🚀

---

## ⚙️ Configuration

Create a `.env` file in the root directory to configure your backend connections:

```env
# Backend API URL (for location updates and geofencing)
VITE_API_URL=https://your-api-endpoint.com

# Supabase Configuration (for database & auth)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Optional: Feature Flags
VITE_ENABLE_DEBUG=true
```

---

## 📂 Project Structure

```
GeoPulse/
├── public/              # Static assets (icons, manifests)
├── src/
│   ├── components/      # React components
│   │   ├── DynamicIsland/  # The core notification hub
│   │   ├── GeofenceList/   # Location management list
│   │   ├── Modals/         # All popup interfaces (SOS, Add/Edit, etc.)
│   │   ├── PocketMode/     # Pocket mode overlay
│   │   └── UI/             # Reusable Liquid Glass UI elements
│   ├── hooks/           # Custom Logic (useGeolocation, useGeofences, etc.)
│   ├── services/        # API integration (Supabase, Backend)
│   ├── utils/           # Helpers (Audio, Formatting)
│   ├── styles/          # Tailwind & CSS variables
│   ├── App.jsx          # Main application logic
│   └── main.jsx         # Entry point
├── index.html          # HTML template
└── package.json        # Dependencies
```

---

## 🛠️ Tech Stack & Magic

| Category | Tech | Description |
|----------|------|-------------|
| **Core** | ![React](https://img.shields.io/badge/-React_19-61DAFB?logo=react&logoColor=white) | The heart of the application. |
| **Build** | ![Vite](https://img.shields.io/badge/-Vite_7-646CFF?logo=vite&logoColor=white) | Blazing fast build tool. |
| **Styling** | ![Tailwind](https://img.shields.io/badge/-Tailwind_4-38B2AC?logo=tailwind-css&logoColor=white) | Utility-first styling engine. |
| **PWA** | `vite-plugin-pwa` | Installable as a native app. |
| **Effects** | `canvas-confetti` | For that extra pop of joy. |
| **APIs** | `Geolocation` | Native browser power unleashed. |

---

## 🤝 Contributing

Got an idea to make it even cooler?

1.  Fork it.
2.  Create your feature branch (`git checkout -b feature/SuperCoolFeature`).
3.  Commit your changes (`git commit -m 'Add SuperCoolFeature'`).
4.  Push to the branch (`git push origin feature/SuperCoolFeature`).
5.  Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

### Made with 💙 by [Gaer12TH](https://github.com/Gaer12TH)

*Star this repo if you think it's cool!* ⭐

</div>
