# 🌌 Orion
**Turn Application Risk Into Visual Intelligence.**



> "Vulnerabilities shouldn't be rows in a spreadsheet. Orion maps them as a living network, where risk pulses through glowing connections."

---

## 🔭 The Concept
Security tools today are noisy. Developers are forced to stare at endless, static lists of CVEs in dashboards that disconnect the vulnerability from the architecture. It is hard to prioritize, hard to visualize, and hard to fix without breaking the build.

**Orion** is a live, visual security system that turns application risk into something developers can immediately understand. Instead of static lists, it maps real files as nodes and real file dependencies as glowing connections. Vulnerabilities appear live as the system is scanned locally and pushed to the cloud, with risk expressed through color, motion, and intensity rather than noisy dashboards.

---

## 🌟 Key Features

### 1. Visual Risk Mapping
Orion replaces dashboards with a spatial map.
* **Live Nodes:** Real files appear as interactive nodes; dependencies appear as connections.
* **Visual Risk:** Risk is expressed through color, motion, and intensity, not text.
* **Propagation:** See exactly how a vulnerability in one library cascades through your codebase.

### 2. The "Hacktron" Integration

* **Vulnerability Simulation:** The **Hacktron** AI (running on a secondary device) detects vulnerability live. 
* **Instant Visualization:** Orion detects the vulnerable vector and immediately lights up the compromised nodes in red.
* **Automated Defense:** The system identifies the exact entry point of the vulnerability.

### 3. Bi-Directional Remediation
Resolving an issue stabilizes the system without deleting history.
* **Precision Fixes:** Clicking a glowing node reveals the file, line number, and a minimal, practical fix.
* **Auto-Sync:** Once a solution is applied in the Orion interface, the fixed code is automatically pushed back to the local developer environment (laptop).

### 4. Calm, Premium UI
A focused design system built for clarity.
* **System-Level View:** A clean, "glassmorphic" interface that helps developers prioritize what actually matters.
* **Interactive Graph:** Zoom, pan, and explore the architecture of your security.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Language** | **TypeScript** | Static typing for safer and cleaner React code. |
| **Frontend Framework** | **React 18** | Component-based UI structure for the visualizer. |
| **Backend & DB** | **Supabase** | Real-time database and auth for syncing node states. |
| **Attack Engine** | **Hacktron** | Custom external module for running live vulnerability exploits. |
| **Build Tool** | **Vite + SWC** | Fast development server & optimized builds. |
| **Routing** | **react-router-dom** | Client-side navigation between views. |
| **State Management** | **@tanstack/react-query** | Efficient API handling & caching. |
| **Styling** | **Tailwind CSS** | Utility-first styling with custom variables for the dark aesthetic. |
| **Linting** | **ESLint + TS ESLint** | Code quality & consistency. |

---

## 📸 Interface

 Home Screen 
 
<img width="2535" height="1511" alt="image" src="https://github.com/user-attachments/assets/f14dbf87-3549-423c-ac92-f7221fd0d7cc" />
 Hover
 
<img width="1266" height="1169" alt="image" src="https://github.com/user-attachments/assets/44d0c0b8-353e-4ccf-a44e-b5f41a5ad10b" />
 Node Details
 
<img width="2508" height="1277" alt="image" src="https://github.com/user-attachments/assets/61a94e7d-eb3a-4d49-9784-51b8c5a443db" />
 Command Center
 
<img width="2349" height="1244" alt="image" src="https://github.com/user-attachments/assets/e1c9e0fd-48de-4eff-89a3-82090fbeee62" />


---

## 👥 The Team
* **Riddhiman** - Front End
* **Ribhav** - Back-End + Front End

---
