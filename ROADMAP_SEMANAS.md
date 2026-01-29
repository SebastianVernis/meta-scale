# Roadmap META SCALE: Semana a Semana

## SEMANA 1-2: TypeScript Fundamentals

### Objetivo
Entender tipos, interfaces, clases en TypeScript.

### Recursos
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html (4 hrs)
- YouTube: "TypeScript for Beginners" - Traversy Media (2.5 hrs)

### Ejercicio Práctico

Crea `src/types.ts`:

```typescript
// Tipos básicos
type Platform = "instagram" | "twitter" | "facebook";

type Account = {
  id: number;
  username: string;
  platform: Platform;
  riskScore: number;
  createdAt: Date;
};

// Interface
interface IAccount {
  id: number;
  username: string;
  updateRisk(score: number): void;
}

// Clase
class Account implements IAccount {
  id: number;
  username: string;
  riskScore: number = 0;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }

  updateRisk(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error("Invalid score");
    }
    this.riskScore = score;
  }
}

// Genéricos
function createArray<T>(item: T): T[] {
  return [item];
}
```

### Commits Esperados
- `learn: typescript basic types`
- `learn: typescript interfaces`
- `learn: typescript generics`

### Tiempo Total: 10-15 hrs

---

## SEMANA 3-4: Node.js + Express

### Objetivo
Crear servidor REST con Express + TypeScript.

### Setup

```bash
npm install express
npm install -D @types/express
```

### Código Ejemplo

Crea `src/server.ts`:

```typescript
import express, { Express } from 'express';

const app: Express = express();
const PORT = 3001;

app.use(express.json());

// GET
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST
app.post('/api/accounts', (req, res) => {
  const { username, platform } = req.body;
  res.status(201).json({ 
    id: 1, 
    username, 
    platform, 
    riskScore: 0 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});
```

### Test

```bash
npm run dev
# En otra terminal:
curl http://localhost:3001/health
```

### Commits
- `feat: express server setup`
- `feat: add account routes`

### Tiempo Total: 20 hrs

---

## SEMANA 5-6: TypeORM + SQLite

### Objetivo
Modelar datos con ORM, sin complicaciones.

### Setup

```bash
npm install typeorm sqlite3 reflect-metadata
```

### Código

Crea `src/entities/Account.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  platform: string;

  @Column()
  riskScore: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
```

Crea `src/database.ts`:

```typescript
import { DataSource } from 'typeorm';
import { Account } from './entities/Account';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './meta-scale.db',
  synchronize: true,
  entities: [Account],
});
```

### Commits
- `feat: typeorm entities`
- `feat: database connection`

### Tiempo Total: 15 hrs

---

## SEMANA 7-8: BullMQ + Redis

### Objetivo
Implementar job queue con workers.

### Setup (Docker)

```bash
docker run -d -p 6379:6379 redis:latest
```

```bash
npm install bullmq ioredis
```

### Código

Crea `src/queue.ts`:

```typescript
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const redis = new Redis();

export const socialQueue = new Queue('social-actions', { connection: redis });

export const worker = new Worker('social-actions', async (job) => {
  const { accountId, action } = job.data;
  console.log(`Processing: ${action} for account ${accountId}`);
  
  // Delay humano 5-30 segundos
  const delay = Math.random() * (30 - 5) + 5;
  await new Promise(r => setTimeout(r, delay * 1000));
  
  return { success: true };
}, { connection: redis });

// Enqueue ejemplo
export async function enqueueAction(accountId: number, action: string) {
  await socialQueue.add('action', { accountId, action });
}
```

### Commits
- `feat: bullmq queue setup`
- `feat: worker implementation`

### Tiempo Total: 20 hrs

---

## SEMANA 9-10: React + WebSocket

### Objetivo
Dashboard real-time con Socket.io.

### Setup

```bash
npm install socket.io
```

```bash
# En terminal aparte para frontend:
cd frontend
npm create vite@latest . -- --template react
npm install socket.io-client recharts
```

### Frontend Component

```typescript
// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('riskUpdate', (data) => {
      setAccounts(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>META SCALE Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(acc => (
            <tr key={acc.id}>
              <td>{acc.username}</td>
              <td>{acc.riskScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
```

### Backend Socket

```typescript
// src/server.ts - agregar:
import { Server } from 'socket.io';
import http from 'http';

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  setInterval(() => {
    // Emitir updates cada 5 segundos
    socket.emit('riskUpdate', [
      { id: 1, username: 'account1', riskScore: 45 }
    ]);
  }, 5000);
});

httpServer.listen(3001);
```

### Commits
- `feat: react dashboard`
- `feat: socket.io real-time updates`

### Tiempo Total: 25 hrs

---

## SEMANA 11-12: Risk Engine + Tests

### Objetivo
Implementar lógica de scoring + Jest tests.

### Código Risk Engine

```typescript
// src/services/RiskEngine.ts
export class RiskEngine {
  calculateScore(frequency: number, patterns: number): number {
    const freqScore = Math.min(100, (frequency / 5) * 100);
    const patternScore = patterns * 20;
    return (freqScore * 0.6) + (patternScore * 0.4);
  }
}
```

### Jest Tests

```typescript
// src/services/__tests__/RiskEngine.test.ts
import { RiskEngine } from '../RiskEngine';

describe('RiskEngine', () => {
  const engine = new RiskEngine();

  test('should return 0 for zero inputs', () => {
    expect(engine.calculateScore(0, 0)).toBe(0);
  });

  test('should return 100 for max inputs', () => {
    const score = engine.calculateScore(5, 5);
    expect(score).toBeGreaterThan(80);
  });
});
```

### Setup Jest

```bash
npm install -D jest @types/jest ts-jest
npx jest --init
npm test
```

### Commits
- `feat: risk engine implementation`
- `test: add jest tests`

### Tiempo Total: 20 hrs

---

## MES 5: APIs Reales

### Integración Instagram (Instagrapi)

```bash
pip install instagrapi
```

```typescript
// src/connectors/InstagramConnector.ts
import { spawn } from 'child_process';

export async function likePost(username: string, postId: string) {
  const process = spawn('python3', ['scripts/like.py', username, postId]);
  
  return new Promise((resolve) => {
    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
}
```

```python
# scripts/like.py
from instagrapi import Client
import sys

client = Client()
client.login(sys.argv[1], 'PASSWORD')
client.post_like(sys.argv[2])
print("ok")
```

### Commits
- `feat: instagrapi connector`
- `feat: twitter api integration`
- `feat: facebook graph api`

### Tiempo Total: 40 hrs

---

## MES 6: Documentación + Deploy

### Crear ARCHITECTURE.md

Explica:
- Flujo de operación
- Componentes principales
- Decisiones de diseño

### Deploy a Vultr

```bash
# En Vultr VPS:
git clone tu-repo
npm install
npm run build

# Setup PM2
npm install -g pm2
pm2 start dist/server.js
pm2 startup
pm2 save
```

### Commits
- `docs: add architecture.md`
- `docs: add api.md`
- `chore: setup deployment`

### Tiempo Total: 30 hrs

---

## Total: 185 Horas en 6 Meses

**7-8 horas por semana = completable** ✓

Cada semana:
- 15-25 hrs de coding/learning
- 3-10 commits
- Incremento visible en GitHub

---

## Recursos por Semana

| Semana | Tema | Recurso |
|--------|------|---------|
| 1-2 | TypeScript | https://typescriptlang.org/docs |
| 3-4 | Express | https://expressjs.com |
| 5-6 | TypeORM | https://typeorm.io |
| 7-8 | BullMQ | https://docs.bullmq.io |
| 9-10 | React+Socket | https://react.dev + https://socket.io |
| 11-12 | Jest | https://jestjs.io |

---

Sigue este roadmap semana a semana. 🚀
