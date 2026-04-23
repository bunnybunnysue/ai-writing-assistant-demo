# AI Writing Assistant — Chat Demo

A standalone interactive prototype showing how the **AI Writing Assistant** bot sends messages in Zoom Team Chat after a meeting ends.

## What This Demonstrates

After a Zoom meeting, the bot automatically detects writing tasks from the transcript and notifies the user via chat. This demo shows all three message categories:

| Category | Title Format | Description |
|---|---|---|
| **Task Detection** | ✨ N new writing tasks are ready to go | Sent once per meeting — lists all detected tasks |
| **Task Done** | ✅ Task done: {title} | Sent per completed task (chat, email, doc update, multi-output) |
| **Action Needed** | ⚠️ Action needed: {title} | Sent when a task needs more user input |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS

## Project Structure

```
src/
├── App.tsx      # Main chat UI with all message types
├── data.ts      # Mock data (tasks, outputs, clarification)
├── main.tsx     # Entry point
└── index.css    # Tailwind imports
```

## PRD Reference

See [`docs/PRD-Chat-Writing-Assistant.md`](docs/PRD-Chat-Writing-Assistant.md) for the full product requirements document covering message structure, interaction logic, visual indicators, and data models.
