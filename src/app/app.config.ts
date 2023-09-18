import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore,
  initializeFirestore,
  Firestore,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => {
        const auth = getAuth();
        if (environment.useEmulators) {
          connectAuthEmulator(auth, 'http://localhost:9099', {
            disableWarnings: true,
          });
        }
        return auth;
      }),
      provideFirestore(() => {
        let firestore: Firestore;
        if (environment.useEmulators) {
          firestore = initializeFirestore(getApp(), {});
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        } else {
          firestore = getFirestore();
        }
        return firestore;
      }),
    ]),
  ],
};
