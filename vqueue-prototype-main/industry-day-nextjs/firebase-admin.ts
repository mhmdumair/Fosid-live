var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
  databaseURL: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (!admin.apps.length) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectid: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
    databaseURL: params.databaseURL,
  });
}

export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL as string,
  };

  return createFirebaseAdminApp(params);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
