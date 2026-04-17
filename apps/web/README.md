# Leap Laboratories: Technical Documentation

## 🚀 Overview
Leap Laboratories is a high-performance digital ecosystem architected on a modern React/Next.js stack. The platform serves as a unified gateway for two distinct operational domains: **Leap Academy** (educational services and curricula) and **Leap Labs** (research and software development consultancy). The system is engineered for scalability, utilizing a monorepo structure and a file-system-driven content pipeline.

---

## 🛠️ Technical Architecture Summary

### Monorepo & Component Strategy
The repository is managed via **Turborepo**, separating concerns into deployable `apps/` and shared `packages/`.
- **Framework**: Next.js 14 (App Router) with React Server Components (RSC) for optimized data fetching.
- **Interactivity**: Client-side states (hooks and event handlers) are isolated in `use client` boundary components to minimize the client-side JavaScript footprint.

### Styling & Design System
The UI utilizes a standardized, algorithmic design language defined in `globals.css`.
- **HSL Tokens**: All colors are derived from HSL (Hue, Saturation, Lightness) variables, allowing for precise programmatic control over transparency and state transitions.
- **Glassmorphism**: Hardware-accelerated backdrop filters are applied via a global `.glass` utility, ensuring consistent high-fidelity depth across the navigation and overlay components.
- **CSS Modules**: Strict style encapsulation is maintained using `*.module.css`, preventing global namespace collisions.

### Content & Data Hydration
The platform implements a specialized **Markdown-as-a-Database** pattern.
- **Filesystem Resolution**: Raw data is stored as curated `.md` and `.json` files in `lib/contents/`.
- **Unified DOM Architecture**: To prevent runtime hydration errors caused by browser-based translation tools, dynamic sections (like the Programs Explorer) utilize a **"No-Swap" strategy**. UI permutations remain anchored in the DOM, with state changes managed strictly through CSS visibility toggles (`.hideAlways`, `.showOnMobile`).

---

## 📁 Project Structure & Technical Map

Below is a granular audit of the repository's directory and file organization.

### 1. Root Workspace Configuration
Orchestrates the monorepo environment and CI/CD task pipelines.

| File / Folder | Technical Description |
| :--- | :--- |
| `apps/web/` | **Primary Application.** The deployable Next.js 14 web environment. |
| `packages/core/` | **Shared Library.** Local package (`@leap/core`) for cross-application logic. |
| `turbo.json` | **Pipeline Engine.** Manages build caching and task orchestration. |
| `package.json` | **Workspace Manifest.** Defines global dependencies and monorepo scripts. |

### 2. apps/web/src/ (Source Core)
The primary execution environment for the user interface.

#### 📂 app/ (Routing & Global Context)
- `globals.css`: Core design tokens (HSL), typography scales, and CSS resets.
- `layout.jsx`: Root composition; handles meta-tags, global translation shields, and hydration warning suppression.
- `page.jsx`: Main entry point orchestrating the composition of Hero, Navbar, and Programs modules.

#### 📂 components/ (Modular UI)
- **Hero/**: Manages the landing impact frame, dynamic headlines, and skeleton-backed media containers.
- **Navbar/**: Handles the glassmorphic global navigation with staggered, high-fidelity nav-link animations.
- **Programs/**: A complex suite (Explorer, Content, FileTree) managing the asynchronous Academy/Labs documentation viewer.

#### 📂 lib/ (Technical Logic & content)
- **contents/**: The physical repository for JSON models (`hero.json`, `navbar.json`) and Markdown curricula (`programs/`).
- `programActions.js`: Server Actions that bridge the UI components to the filesystem content.
- `content.server.js`: Server-side Node implementation for parsing Markdown into structured metadata.
- `content.shared.js`: Isomorphic utility for safely fetching configuration data on both Server and Client.

---

## 📈 Current Project Progress
1. **[Complete] Design System Overhaul**: Fully transitioned from hex-mapped styles to a semantic HSL property system with professional micro-interactions.
2. **[Complete] Hydration Hardening**: Implemented the invariant DOM architecture to ensure stability across all mobile browsers and translation tools.
3. **[Complete] Domain Migration**: Systematically refactored the entire stack from the legacy "Services" domain to the modern "Programs" branding.
