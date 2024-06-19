import admin from 'firebase-admin';
import serviceAccount from '../firebase_service_account_key.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export default admin;