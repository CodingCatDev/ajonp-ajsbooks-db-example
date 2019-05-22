# AJ's Books Sample Firestore data

This repo allows you to populate your database with books data for
[AJ's Books Next.js](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs)

## Instructions

Requires Node.js >= 8.

1. Clone this repo, cd into it, and run `npm install`.
2. Download your service account (generate private key) from the [Firebase Console](https://console.firebase.google.com) under settings, then save it in the root of this project as `credentials.json`.
   ![Firebase Creds](https://res.cloudinary.com/ajonp/image/upload/v1558553714/ajonp-ajonp-com/ajonp-ajsbooks-deb-example/firebase_creds.png)
3. Run `node` with the file associated for a collections

Examples:
`node books.js`
