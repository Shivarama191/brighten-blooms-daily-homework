# Firebase Free Setup

This project is designed to stay on the no-cost Firebase Spark plan.

## What to enable

Enable only these Firebase services:

- Authentication: Email/Password
- Firestore Database
- Firebase Hosting

Do not enable Cloud Storage. The PDF downloads directly in the browser, so the app does not need a storage bucket.

## Steps

1. Create a Firebase project.
2. Keep the project on the Spark plan.
3. Go to Authentication > Sign-in method.
4. Enable Email/Password.
5. Go to Authentication > Users.
6. Add the principal user manually.
7. Go to Firestore Database.
8. Create a database.
9. Open `firestore.rules`.
10. Replace `principal@example.com` with the principal's actual email.
11. Publish the rules.
12. Go to Project settings > Your apps.
13. Add a Web App.
14. Copy the Firebase config into `firebase-config.js`.
15. Add the same principal email inside `appSettings.allowedEmails`.

## Local Test

Run:

```bash
node serve-local.js
```

Open:

```text
http://localhost:4173
```

## Deploy

Install and login to Firebase CLI if needed, then run:

```bash
firebase deploy
```

Firebase Hosting will give a free web URL.
