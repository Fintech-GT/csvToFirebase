import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import fs from 'fs';
import 'dotenv/config'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

fs.readFile('./amexChaseDiscover.tsv', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split("\r\n");
  const headers = lines[0].split("	");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].split("	");
    const cardName = line[0];
    let attrs = {};
    for (let i = 0; i < line.length; i++) {
        let val = line[i];
        if (val[0] == "{") {
            val = JSON.parse(val);
        }
        attrs[headers[i]] = val;
    }
    console.log(cardName, attrs)
    await setDoc(doc(db, "cards", cardName), attrs);
  }
});
