# 🚀 Radia Enforced Deployment Workflow

This document outlines the mandated professional workflow for making and deploying changes to **heathernew.com**. Any AI agent (Gemini, Claude, etc.) or developer interacting with this repository MUST adhere to these safety protocols.

## 🛡️ The Philosophy
1.  **Safety First:** Never push code that hasn't been visually verified in a production-like environment.
2.  **Source of Truth First:** GitHub is the definitive record. Code must live in version control *before* it lives on the production server.
3.  **No Cowboy Coding:** Never edit files directly on the Siteground server via FTP or SSH. Always deploy via the `deploy.sh` script.

---

## 🔑 Prerequisites & Credentials

The deployment script relies on specific SSH keys established by Radia:
- **GitHub Auth:** `~/.ssh/agent_id_ed25519` (Passphrase-free, established for agent operations).
- **Siteground Auth:** `~/.ssh/id_ed25519_siteground` (Established for direct server access).

---

## 🛠️ Step-by-Step Workflow

### 1. Local Development
*   **Command:** `npm run dev`
*   **Verification:** Check `http://localhost:3001` (or your active dev port).
*   **Focus:** Ensure the "Loom" (Vite) is correctly weaving the partials and assets.

### 2. The Deployment Execution
Run the enforcement script from the project root:
```bash
./deploy.sh
```

The script will guide you through three mandatory phases:

#### PHASE 1: Build & Verify (The "Dress Rehearsal")
*   Runs `npm run build` to generate the `dist/` folder.
*   Runs `npm run preview` to host the *compiled* version locally.
*   **Mandatory Stop:** It will open the preview in your browser. You MUST visually confirm that the Bauhaus grid, 3D interaction, and CSS are perfect.
*   **The Check:** If it doesn't look right in preview, it won't look right on Siteground. Halt and fix.

#### PHASE 2: GitHub Synchronization (The "Archive")
*   Stages and commits all local changes.
*   Pushes the clean source code to the `main` branch on GitHub.
*   **Why?** This ensures that if the server deployment fails, your work is safely backed up and can be restored.

#### PHASE 3: Live Server Deployment (The "Showtime")
*   **Automated Backup:** Creates a lean tarball backup of the current live site on Siteground (excludes heavy media).
*   **Rsync Sync:** Uploads ONLY the `dist/` folder to `public_html/`. This ensures the live site is flattened and processed (no `<load>` tags left over).
*   **Cache Invalidation:** Touches the server files to force a refresh so users see changes instantly.

---

## ⚠️ Special Instructions for AI Agents

*   **Path Resolution:** When updating `parasite3d.js` or other scripts, ensure paths reference the `/public/assets` directory correctly.
*   **Git Integrity:** Do not attempt to push to GitHub using keys that require a passphrase unless specifically directed. Use the `agent_id_ed25519` key.
*   **No Manual Flattening:** Do not manually inject partials into HTML files unless the build process is fundamentally broken. Always prefer the Vite `npm run build` pipeline.

---

**"The textiles must be woven before the conductor takes the stage."** 
— *Radia, 2026*
