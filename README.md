# META SCALE
Motor de automatización de redes sociales con anti-ban y puntuación de riesgo en tiempo real.

- English: `README.en.md`

## Stack tecnológico
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + WebSocket
- **Cola**: BullMQ + Redis
- **Base de datos**: PostgreSQL / SQLite

## Primeros pasos

```bash
npm install
npm run dev
```

## Flujo de desarrollo
1. Clonar el repositorio.
2. Trabajar sobre la rama `main`.
3. Subir cambios al remoto y abrir un Pull Request (PR) hacia la rama `master`.
4. Revisar el PR detalladamente.
5. Si la revisión es exitosa, fusionar (merge) el PR.

## Auto-traducción del README (ES → EN)
El README oficial es este archivo (`README.md`). La versión en inglés (`README.en.md`) se genera automáticamente.

### Requisitos
- Tener `OPENAI_API_KEY` configurada en el entorno.

### Comando
```bash
OPENAI_API_KEY=... npm run translate:readme
```

### Opcionales
- `OPENAI_MODEL` (por defecto: `gpt-4.1`)
- `README_ES` (por defecto: `README.md`)
- `README_EN` (por defecto: `README.en.md`)

### Recomendación
Revisar el diff del `README.en.md` antes de fusionar.

## Estado
🚀 Fase 1 de desarrollo
