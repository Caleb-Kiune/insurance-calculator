# Insurance Calculator

> **Precision vehicle insurance premium estimation for the modern age.**
> *Real-time calculations for Private, Commercial, PSV, and TSV vehicles.*

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## 🖼️ Preview

![Project Hero](https://placehold.co/800x400/2563eb/ffffff?text=Insurance+Calculator&font=roboto)

## 📖 About This Project

The **Insurance Calculator** is a sophisticated web application designed to provide instant, accurate insurance premium quotations for the Kenyan market. Built with performance and user experience in mind, it handles complex logic for various vehicle classes including Private, Commercial, Public Service Vehicles (PSV), and Trade Service Vehicles (TSV).

It automatically calculates basic premiums, statutory levies, and optional benefits like Excess Protectors and Political Violence & Terrorism (PVT) cover, providing a detailed breakdown for transparency.

**[🚀 Live Demo](https://insurance-calculator-lovat.vercel.app/)**

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--local-setup)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-the-calculator-works)
- [Running the App](#-running-the-app)
- [Main Components](#-main-pages--components)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Key Features

- **Multi-Category Support**: Specialized logic for Private, Commercial (Fleet/Single), PSV, and TSV.
- **Real-Time Calculation**: Instant premium updates as you modify values using debounced inputs.
- **Smart Validation**: Enforces maximum car values (KSh 100M) and category-specific rules.
- **Detailed Breakdown**: Separates Basic Premium, Levies (Stamp Duty, Training Levy, PHCF), and Add-ons.
- **Responsive Design**: Fully mobile-optimized UI using Tailwind CSS.
- **Smooth Animations**: Polished transitions with Framer Motion.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Linting**: ESLint

## 📂 Project Structure

```bash
insurance-calculator/
├── public/              # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── calculator/  # MAIN APPLICATION LOGIC
│   │   │   └── page.tsx # The core calculator component
│   │   ├── globals.css  # Global styles & Tailwind directives
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Landing page (currently default template)
├── .eslintrc.json       # Linting config
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.mjs   # PostCSS config
├── tailwind.config.ts   # Tailwind config
└── tsconfig.json        # TypeScript config
```

## ✅ Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**

## 💻 Installation & Local Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Caleb-Kiune/insurance-calculator.git
    cd insurance-calculator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:3000/calculator` to see the app in action.

## 🔐 Environment Variables

Currently, this project **does not require any environment variables** to run locally. All logic is client-side.

## 🧠 How the Calculator Works

The core logic resides in `src/app/calculator/page.tsx`. Here's a brief overview of the premium calculation rules:

### 1. Private Vehicles
- **Comprehensive**: Rate based on value tiers (ranging from 5% to 7.5% effective).
- **Third Party**: Fixed rate (KSh 7,500).
- **Add-ons**: Excess Protector (0.25%), PVT (0.25%), Courtesy Car (Fixed tiers).
- **Inclusive Benefits**: PVT is free for values ≤ KSh 4M.

### 2. Commercial Vehicles
- **Comprehensive**:
    - **Single**: 5% rate.
    - **Fleet (3+)**: 4.75% rate.
    - **Inclusive**: Excess Protector is free. PVT free for values ≤ KSh 5M.
- **Third Party**: Fixed premiums based on **Tonnage** (0-3t, 3-8t, 8-15t, >15t).

### 3. PSV (Public Service) & TSV (Trade Service)
- **PSV**: 6% rate (min KSh 40,000). PLL calculated per passenger. No Excess Protector allowed.
- **TSV**: 5.5% rate. Excess Protector optional (0.5%). PLL per passenger.

### Statutory Levies (Applied to all)
- **Stamp Duty**: KSh 40
- **Training Levy**: 0.2% of Basic Premium
- **PHCF**: 0.25% of Basic Premium
- **Policy Charge**: KSh 1,000

## 🏃 Running the App

### Development
```bash
npm run dev
```
Runs the app in development mode with hot reloading.

### Production Build
```bash
npm run build
npm start
```
Builds the app for production and starts the production server.

### Linting
```bash
npm run lint
```
Checks for code quality issues using ESLint.

## 🧩 Main Pages & Components

| Path | Description |
| :--- | :--- |
| `/` | Landing page (Default Next.js template). |
| `/calculator` | **The Main App**. Contains all form inputs, state management, and calculation logic. |

## 🧪 Testing

*Tests are currently in development.*
Future updates will include unit tests for the calculation logic using Jest/Vitest.

## 🚀 Deployment

The easiest way to deploy is using **Vercel**:

1.  Push your code to GitHub/GitLab.
2.  Import the project into Vercel.
3.  Vercel will automatically detect Next.js and configure the build settings.
4.  Click **Deploy**.

## 🔮 Future Roadmap

- [ ] Add PDF export for quotations.
- [ ] Implement user authentication to save quotes.
- [ ] Add backend integration for policy issuance.
- [ ] Unit tests for complex premium logic.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Contact

**Caleb Kiune**
- 📧 Email: [calebkiune@gmail.com](mailto:calebkiune@gmail.com)
- 💼 LinkedIn: [Caleb Kiune](https://www.linkedin.com/in/caleb-kiune-b356a6327)
- 🐙 GitHub: [Caleb-Kiune](https://github.com/Caleb-Kiune)

## 🙏 Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
