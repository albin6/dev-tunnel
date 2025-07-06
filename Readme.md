# 🌐 dev-tunnel

**Expose your local development server to the internet instantly with Ngrok.**  
Perfect for web development students, sharing demos, or testing on mobile devices.

---

## Features

- **Automatic Ngrok Setup**: Configures your Ngrok authtoken effortlessly.
- **Public URL Generation**: Exposes your local server to a publicly accessible URL.
- **Framework Detection**: Automatically detects popular frameworks like Vite, React, Next.js, Express, Spring Boot, Django, Go Gin, and .NET.
- **Vite Config Patching**: Automatically updates Vite configuration to allow external access.
- **Clipboard Support**: Copies the generated public URL to your clipboard.
- **Browser Auto-Open**: Opens the public URL in your default browser.
- **Beginner-Friendly**: Simple to use, even for those new to development.

---

## Installation

Install globally via npm:

```bash
npm install -g dev-tunnel
```

Or run instantly without installation:

```bash
npx @npmx86/dev-tunnel
```

---

## Usage

Expose your local server on a specified port:

```bash
dev-tunnel --port 3000
```

### Optional Flags

- `-p, --port <port>`: Specify the port to forward (default: 5173).
- `-f, --framework <name>`: Manually specify the framework.
- `--no-open`: Prevent the URL from opening in the browser.

---

## Supported Frameworks

The following table outlines framework-specific behavior:

| Framework         | Auto-Detected | Auto-Patch Supported | Notes                                  |
| ----------------- | ------------- | -------------------- | -------------------------------------- |
| **Vite**          | ✅            | ✅                   | Adds `allowedHosts` to Vite config     |
| **Express + EJS** | ✅            | ✅                   | Adds CORS-like headers for templates   |
| **Django**        | ✅            | ✅                   | Adds Ngrok host to `ALLOWED_HOSTS`     |
| **Next.js**       | ✅            | ⚠️ No                | Manual patch required (see below)      |
| **React (CRA)**   | ✅            | ❌                   | No patching needed                     |
| **Express (API)** | ✅            | ❌                   | Usually works without patching         |
| **Spring Boot**   | ✅            | ❌                   | Ensure proper CORS configuration       |
| **Go Gin**        | ✅            | ❌                   | Manually allow public access           |
| **.NET**          | ✅            | ❌                   | Ensure `Startup.cs` allows all origins |

---

## Manual Configuration

If auto-patching is not supported or fails, follow these manual instructions:

### Next.js

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  devServer: {
    host: '0.0.0.0',
  },
};

module.exports = nextConfig;
```

### Django

Update `settings.py`:

```python
ALLOWED_HOSTS = ['your-ngrok-url']
```

---

## Notes

- Ensure your local server is running before using `dev-tunnel`.
- For frameworks requiring manual configuration, refer to their respective documentation for advanced CORS or host settings.
- Ngrok's free tier has limitations, such as temporary URLs. Consider a paid plan for persistent URLs.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on our [GitHub repository](https://github.com/npmx86/dev-tunnel).

---

## License

This project is licensed under the MIT License.
