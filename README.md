# WeChat - Firebase Anonymous Chat (PWA)

This is a minimal Firebase + React chat app with PWA support and in-app notifications.
Drop this project into a GitHub repo and deploy on Vercel.

## Quick start

1. Unzip and inspect files.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Edit `.env.local` with your Firebase values or set Vercel env vars.
4. Run locally:
   ```bash
   npm start
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Notes
- This project uses Firebase **Realtime Database** (client-side).
- The app requests notification permission and shows a notification when a new message arrives while the page is open.
- For background push notifications when the site is closed, you'd need Firebase Cloud Messaging and a server to send push messages. This project does not include server-side push.
