// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      
  apiKey: "AIzaSyCisEzjaNmpuOxdHna0qxJZSrdxI8jmCX8",
  authDomain: "sas-tfg.firebaseapp.com",
  projectId: "sas-tfg",
  storageBucket: "sas-tfg.firebasestorage.app",
  messagingSenderId: "737848605061",
  appId: "1:737848605061:web:fd22d3ba550dadbc772cec",
  measurementId: "G-63C7RV1D8G"
}))

    ,  // ← lee del env
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};