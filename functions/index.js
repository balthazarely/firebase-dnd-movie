const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const cors = require("cors")({ origin: true });

exports.createUserDocument = functions.auth.user().onCreate((user) => {
  db.collection("users")
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)));
});

exports.helloWorld = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const data = {
      message: "Hello, world!",
      timestamp: Date.now(),
    };

    res.status(200).json(data);
  });
});

exports.deleteCollection = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const data = {
      collection: req.body.req.collection,
      userId: req.body.req.userId,
      timestamp: Date.now(),
      msg: "this was deleted successfully",
    };
    try {
      const batch = admin.firestore().batch();
      const snapshot = await admin
        .firestore()
        .collection("users")
        .doc(data.userId)
        .collection(data.collection)
        .get();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
});

exports.getNestedUserCollections = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      const data = {
        userId: req.body.req.userId,
      };
      try {
        // Retrieve the document
        const docRef = admin.firestore().collection("users").doc(data.userId);
        const doc = await docRef.get();
        const subcollections = await docRef.listCollections();
        const subcollectionNames = subcollections.map(
          (subcollection) => subcollection.id
        );

        res.status(200).json(subcollectionNames);
      } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError(
          "internal",
          "An error occurred while getting the nested collections."
        );
      }
    });
  }
);
