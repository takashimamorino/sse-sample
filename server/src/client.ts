import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

var serviceAccount = require("../.key/serviceAccountKey.json");

initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

const docRef = db.collection("messages").doc();

export const createMessage = async (text: string) => {
	await docRef.set({
		text,
	});
};

export const getMessages = async () => {
	const snapshot = await db.collection("messages").get();
	const data = snapshot.docs.map((doc) => {
		const res = doc.data();
		return res.text as string;
	});
	return data;
};
