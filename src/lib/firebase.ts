import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'organic-vortex-mmzf6',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || '1:557356638537:web:33d592140b7fb3f4893a98',
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAj9Uky0ktuMZNccvGmv1WUMakvAVKw_uw',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'organic-vortex-mmzf6.firebaseapp.com',
  firestoreDatabaseId:
    import.meta.env.VITE_FIREBASE_DATABASE_ID ||
    'ai-studio-kalyansetuservin-33824c4b-76f5-4fe1-95da-ae446c22ab1e',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'organic-vortex-mmzf6.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '557356638537',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
