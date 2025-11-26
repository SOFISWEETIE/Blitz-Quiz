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
      apiKey: "A............8",
      authDomain: "s.......com",
      projectId: "s.....g",
      storageBucket: "s......p",
      messagingSenderId: "7.....1",
      appId: "1....cec"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};