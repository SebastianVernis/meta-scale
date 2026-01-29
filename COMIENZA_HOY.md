# 🚀 COMIENZA HOY: META SCALE en 30 Minutos

## Objetivo
Crear tu repositorio GitHub + setup inicial de TypeScript + primer commit.
**Tiempo: 30 minutos máximo**

---

## Paso 1: Crear Repositorio en GitHub (5 min)

### Opción A: Vía Web (Recomendado)

1. Ve a: https://github.com/new
2. Rellena:
   ```
   Repository name: meta-scale
   Description: Anti-ban social media automation engine with risk scoring
   Visibility: Public
   Initialize with README: ✓
   Add .gitignore: Node
   Choose a license: MIT
   ```
3. Click "Create repository"
4. **Copie la URL HTTPS** que aparece

---

## Paso 2: Setup Local en tu PC (10 min)

### En tu terminal (Debian)

```bash
# 1. Navega a tu carpeta de proyectos
cd ~/projects
# Si no existe:
mkdir -p ~/projects && cd ~/projects

# 2. Clone el repo
git clone https://github.com/TU_USERNAME/meta-scale.git
cd meta-scale

# 3. Instala Node.js (si no lo tienes)
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifica:
node --version
npm --version

# 4. Inicializa npm
npm init -y

# 5. Instala TypeScript
npm install -D typescript @types/node
npm install -D ts-node nodemon

# 6. Genera tsconfig.json
npx tsc --init

# 7. Crea carpeta src
mkdir src

# 8. Crea archivo de prueba
cat > src/index.ts << 'EOF'
const message: string = "✅ META SCALE initialized";
console.log(message);
EOF

# 9. Prueba que funciona
npm run dev
# Deberías ver: ✅ META SCALE initialized
```

---

## Paso 3: Configurar Git (2 min)

```bash
git config --global user.name "Sebastian Vernis"
git config --global user.email "tu@email.com"
```

---

## Paso 4: Primer Commit (5 min)

```bash
git status
git add .
git commit -m "init: initialize META SCALE project with TypeScript"
git branch -M main
git push -u origin main
```

---

## Paso 5: Configurar package.json Scripts (3 min)

Edita `package.json` y en la sección "scripts":

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

Luego:
```bash
git add package.json
git commit -m "chore: configure npm scripts"
git push
```

---

## Paso 6: Crear README.md (3 min)

```bash
cat > README.md << 'EOF'
# META SCALE

Anti-ban social media automation engine with real-time risk scoring.

## Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + WebSocket
- **Queue**: BullMQ + Redis
- **Database**: PostgreSQL / SQLite

## Getting Started

´´´bash
npm install
npm run dev
´´´

## Status 
🚀 Development Phase 1
'EOF'
```

```bash
git add README.md
git commit -m "docs: add initial README"
git push
```


---

## ✅ Verificación

```bash
ls -la
# Debería ver:
# .git/
# node_modules/
# src/ → index.ts
# package.json
# tsconfig.json
# README.md
```

---

## 🎉 ¡Listo!

Tienes 3+ commits en GitHub. Ahora:

1. **Próximos pasos**: Lee la guía roadmap
2. **Semana 1**: Aprende TypeScript basics
3. **Semana 2**: Express server

Vamos. 🚀