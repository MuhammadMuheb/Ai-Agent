# MUHIB AI - Project Notes & Summary

**Project:** Muhib AI - Personal AI Assistant & Plant Vision Intelligence (Desktop + Web)
**Author/User:** Muhammad Muheb Riaz
**Stack:** React 19, Vite 8, Tailwind CSS, Express, TypeScript, @google/genai SDK (server-side)
**Theme & Colors:** Dark Sci-Fi Dashboard
- Background: `#05080c`
- Cyan (Accent): `#27d7e6`
- Green (Active/Success): `#2ee59d`
- Amber (Warning/Thinking): `#f5b83d`
- Red (Stop/Danger): `#ff4d5e`
**Typography:** Headings & badges in monospace (`font-mono`), body sans-serif
**Language:** Roman Urdu (primary persona default) + English & Urdu
**Core Architecture:**
1. 3-Column Sci-Fi Dashboard (Left: Aaj ka Plan, Naye Messages, Fresh Ideas; Center: 4 Modules + Animated Particle Orb + Kaam ki Halat; Right: Voice, Agent, Notes, Plant Vision tabs)
2. Safe Approval Workflow: No messages or risky actions executed without user verification (`BHEJ DO`, `BADLO`, `CANCEL`)
3. Plant & Vision Superpower: Model `gemini-3.1-pro-preview` / `gemini-3.8-flash` for botanical identification and comprehensive care guides
4. Multi-Turn Conversational Memory: Remembers boss preferences, mama's call routines, active projects, and work-rest intervals.
