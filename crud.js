const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase_credentials.json'))
});

const db = admin.firestore();

module.exports.createDoc = async (collection, json) => {
  const ref = await db.collection(collection).add(json);
  console.log('Created', ref.id);
  return ref;
};

module.exports.updateDoc = async (collection, id, json) => {
  const ref = db.collection(collection).doc(id);
  const result = await ref.set(json, { merge: true });
  console.log(`Updated ${collection}/${id} at:`, result.writeTime);
  return ref;
};

module.exports.deleteDoc = async (collection, id) => {
  const result = await db
    .collection(collection)
    .doc(id)
    .delete();
  console.log('Deleted ${collection}/${id} at:', result.writeTime);
};

/* Example Usage */
// createDoc('books', { title: 'Foo' });
// updateDoc('books', 'FB9jMSEUQQabFqr4mgFm', { title: 'Bar' });
// deleteDoc('books', 'SPonBw66rLRrWZ4p14sS');
