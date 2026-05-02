const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "abcd-4f3cd"
  });
}

const db = admin.firestore();

module.exports = { admin, db };
