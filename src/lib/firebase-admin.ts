import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'organic-vortex-mmzf6';

if (!getApps().length) {
  initializeApp({
    projectId,
  });
}

export const adminAuth = getAuth();
