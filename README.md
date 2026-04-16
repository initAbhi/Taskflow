# TaskFlow - Full Stack Task Management System

TaskFlow is a modern, responsive, full-stack task management application with role-based assignment functionality.

## 🚀 Tech Stack

### Frontend
- **React 19** with **Vite** for blazing fast HMR and optimized builds
- **Tailwind CSS v4** (via @tailwindcss/vite plugin) for a stunning, custom glassmorphism design system
- **TypeScript** for end-to-end type safety
- **React Query** (TanStack) for powerful caching, background fetching, and optimistic UI updates
- **React Hook Form + Zod** for performant and strictly validated form handling
- **Axios** with global 401 interceptors and JWT authorization token injection
- **Lucide React** for beautiful consistency in icons

### Backend
- **Node.js + Express.js** API
- **TypeScript** built with industry-grade modular architecture (Controllers, Services, Middlewares)
- **TypeORM** for programmatic, strictly-typed SQL interactions
- **PostgreSQL** Database
- **Zod** for robust API payload validation
- **JWT** (JSON Web Tokens) with **Bcryptjs** for secure, stateless authentication
- **Helmet, Cors, Express Rate Limit** for API security

### DevOps
- **Docker & Docker Compose** for one-click environment spin-up
- **Multi-stage Dockerfile** building dist files then running as non-root on alpine for the smallest footprint

---

## 🔥 Features
- 🔒 **Secure Auth**: JWT based stateless auth with password hashing.
- 👨‍💻 **Personal Tasks**: Add your own tasks (Todo, In Progress, Done).
- 🤝 **Assigned Tasks**: Assign tasks to *other* users!
  - **As the Assigner (Creator)**: Edit title, due date, description or re-assign. You *cannot* touch the status.
  - **As the Assignee**: You can *only* update the status.
- 🎨 **Sleek UI/UX**: Custom responsive Tailwind design featuring glassmorphism, gradient blobs, animations, and micro-interactions.
- 🚦 **Robust Validation**: Zod catches errors both locally (frontend) and on the API (backend).

---

## 🛠️ Setup Instructions

### 1. Database (PostgreSQL) setup
Make sure you have postgres running locally with these default credentials:
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `12345`

*Alternatively, run the docker-compose command below to spin up both the database and the backend.*

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*(The backend runs on `http://localhost:5000`. In development mode, TypeORM is set to `synchronize: true` so the database schema will be auto-generated).*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

### 🐳 Running via Docker Compose
If you want to run the PostgreSQL database and NodeJS Production backend via Docker:
```bash
docker-compose up --build -d
```
You can then start the frontend via `npm run dev` in the frontend folder.

---

## 🌍 VM Production Deployment (NGINX + Neon DB)

This application is ready to be deployed on a standard Ubuntu VM using Nginx as a reverse proxy, PM2 for the backend daemon, and Neon for cloud PostgreSQL.

### 1. Configure the Backend with Neon DB
Connect to your VM, pull the code, and set up your `.env` file in the `/backend` folder with your Neon credentials:
```env
# backend/.env
NODE_ENV=production
PORT=5000

# Required for Neon DB remote connection
DB_HOST=ep-red-glitter-amtrdcb5.c-5.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USERNAME=neondb_owner
DB_PASSWORD=************
DB_NAME=neondb
DB_SSL=true

# Set this to true ONLY for the first run to instantiate tables, then set to false
DB_SYNC=true

# Security
JWT_SECRET=super_secure_random_string_here
CORS_ORIGIN=https://taskflow.fourth-coffee.shop
```

### 2. Build and Start Backend (PM2)
```bash
sudo npm install -g pm2
cd backend
npm install
npm run build
pm2 start dist/server.js --name "taskflow-api"
```

### 3. Build Frontend
```bash
cd frontend
# Set standard explicit production vars for Vite in frontend/.env
echo "VITE_API_URL=https://api-taskflow.fourth-coffee.shop/api" > .env
npm install
npm run build
```

### 4. Setup Nginx Reverse Proxy
An `nginx.conf` file is provided in the root directory. Copy it to your Nginx setup:
```bash
# Move your frontend dist folder to the web root
sudo mkdir -p /var/www/taskflow/frontend
sudo cp -r dist/* /var/www/taskflow/frontend/

# Copy the provided nginx configuration
sudo cp ../nginx.conf /etc/nginx/sites-available/taskflow
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Restart Nginx
sudo systemctl restart nginx
```

### 5. Secure with SSL (Certbot)
Since you are using real domains (`taskflow.fourth-coffee.shop` & `api-taskflow.fourth-coffee.shop`), you can use Certbot to automatically configure Let's Encrypt SSL.
```bash
# Install Certbot for Nginx
sudo apt update
sudo apt install python3-certbot-nginx -y

# Provision SSL Certificates
sudo certbot --nginx -d taskflow.fourth-coffee.shop -d api-taskflow.fourth-coffee.shop

# Certbot will automatically override your nginx.conf to redirect HTTP to HTTPS!
```

---

## 🔑 Sample User Credentials
Since this is a fresh database, please create at least two users using the web interface:

**User 1 (Assigner)**: 
Register via UI (e.g. `user1@example.com` / `password123`)

**User 2 (Assignee)**: 
Register via UI (e.g. `user2@example.com` / `password123`)

Once both users are registered, log in as User 1, create a task, and select "User 2" in the **"Assign to"** dropdown. Log in as User 2 to experiment with role-based limitations!

---

*Architected and developed with top-notch code quality practices in mind.*
