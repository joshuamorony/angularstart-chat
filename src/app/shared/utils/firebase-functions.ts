import { InjectionToken } from '@angular/core';
import {
  collection,
  addDoc,
  collectionData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';

export const FirebaseFunctions = new InjectionToken('Firebase functions', {
  providedIn: 'root',
  factory: () => ({
    collection,
    addDoc,
    collectionData,
    limit,
    orderBy,
    query,
  }),
});
