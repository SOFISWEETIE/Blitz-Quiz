import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App as AppComponent } from './app/app';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  ...appConfig,                                   // ← coge toooodo lo del config
  providers: [                                    // ← y añade esto extra
    ...appConfig.providers,                       // ← importante: expande los del config
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));