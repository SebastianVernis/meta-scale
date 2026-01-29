# META SCALE
Anti-ban social media automation engine with real-time risk scoring.

- Español: `README.md`

## Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + WebSocket
- **Queue**: BullMQ + Redis
- **Database**: PostgreSQL / SQLite

## Getting Started

```bash
npm install
npm run dev
```

## Development workflow
1. Clone the repository.
2. Work on the `main` branch.
3. Push changes to the remote and open a Pull Request (PR) targeting `master`.
4. Review the PR thoroughly.
5. If it passes review, merge the PR.

## README auto-translation (ES → EN)
The official README is the Spanish one (`README.md`). The English version (`README.en.md`) is generated automatically.

### Requirements
- `OPENAI_API_KEY` set in your environment.

### Command
```bash
OPENAI_API_KEY=... npm run translate:readme
```

### Optional
- `OPENAI_MODEL` (default: `gpt-4.1`)
- `README_ES` (default: `README.md`)
- `README_EN` (default: `README.en.md`)

### Recommendation
Review the `README.en.md` diff before merging.

## Status
🚀 Development Phase 1
