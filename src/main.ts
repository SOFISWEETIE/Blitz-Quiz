// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent  as AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    // TODOS los providers de appConfig (Firebase, Firestore, Auth, Router)
    ...appConfig.providers,

    // Adicionales que quieras añadir
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error('Error bootstrapping app:', err));
