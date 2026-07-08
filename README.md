# Brighten Blooms Homework Manager

Static web app for creating daily homework sheets, saving them to Firebase Firestore, and downloading a WhatsApp-ready PDF.

## Zero-cost setup

Use Firebase Spark plan only:

1. Create a Firebase project on the no-cost Spark plan.
2. Enable Authentication > Email/Password.
3. Add one user manually for the principal.
4. Create a Firestore database.
5. Publish the rules from `firestore.rules`.
6. Replace `principal@example.com` inside `firestore.rules` with the principal email.
7. Create a Firebase Web App and copy its config into `firebase-config.js`.
8. Add the principal email in `appSettings.allowedEmails`.

Do not enable Firebase Cloud Storage for this project. The PDF is generated in the browser and downloaded directly, so no paid storage bucket is needed.

See `FIREBASE_SETUP.md` for the full setup checklist.

## Run locally

From this folder:

```bash
node serve-local.js
```

Open:

```text
http://localhost:4173
```

If Firebase config is not filled, the app runs in local demo mode and saves only inside the current browser.

## Deploy free

Recommended free path:

```bash
firebase deploy
```

You can also push this folder to GitHub and deploy it as a static site. If using Vercel Hobby, keep in mind Vercel describes Hobby as personal/non-commercial use.
