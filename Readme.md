# 🌐 dev-tunnel

**Expose your local development server to the internet using Ngrok — instantly.**  
Perfect for web dev students, demo sharing, or quick mobile testing.

---

## Features

- Automatically sets up your **Ngrok authtoken**
- Exposes your **local server to a public URL**
- **Detects popular frameworks** like Vite, React, Next.js, Express, Spring Boot, Django, Go Gin, and .NET
- **Patches Vite config** to allow external access
- **Copies URL to clipboard**
- **Opens the link in your browser**
- Super easy to use — beginner-friendly

---

## Installation

```bash
npm install -g dev-tunnel
```

## Or run instantly without installing:

```bash
npx @npmx86/dev-tunnel
```

## Usage

```bash
dev-tunnel --port 3000
```

Optional flags:

- -p, --port <port> — Port to forward (default: 5173)

- -f, --framework <name> — Manually specify framework

- --no-open — Don't open URL in browser

## Framework Behavior

| Framework         | Auto Detected | Auto Patch Supported | Notes                                     |
| ----------------- | ------------- | -------------------- | ----------------------------------------- |
| **Vite**          | ✅             | ✅                    | Adds `allowedHosts` to config             |
| **Express + EJS** | ✅             | ✅                    | Adds CORS-like headers for templates      |
| **Django**        | ✅             | ✅                    | Adds Ngrok host to `ALLOWED_HOSTS`        |
| **Next.js**       | ✅             | ⚠️ No                | Show manual patch tip (see below)         |
| **React (CRA)**   | ✅             | ❌                    | No patching needed                        |
| **Express (API)** | ✅             | ❌                    | Usually works without patch               |
| **Spring Boot**   | ✅             | ❌                    | Ensure proper CORS config                 |
| **Go Gin**        | ✅             | ❌                    | Should allow public access manually       |
| **.NET**          | ✅             | ❌                    | Make sure `Startup.cs` allows all origins |


## Manual Patch Instructions

# Next.js
Add this to next.config.js:

```bash
devServer: {
  host: '0.0.0.0',
} 
```

# Django (if auto-patch fails)
In settings.py:

```bash
ALLOWED_HOSTS = ['your-ngrok-url']
```