import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class StorageService {

  items = [
    new StorageItem(StorageKey.COOKIE_PERMISSION_STATE, false),
    new StorageItem(StorageKey.INVITE, true)
  ];

  constructor() {}

  async onAppInit() {
    for (const item of this.items) {
      const browserStorage = this.getBrowserStoreForItem(item);
      const jsonString = await browserStorage.getItem(item.key);
      item.subject.next(JSON.parse(jsonString));
    }
  }

  getBrowserStoreForItem(item: StorageItem): Storage {
    return item.sessionOnly ? sessionStorage : localStorage;
  }

  findItem(key: StorageKey): StorageItem {
    return this.items.find((item) => item.key === key);
  }

  remove<T>(key: StorageKey): void {
    const item = this.findItem(key);
    const browserStorage = this.getBrowserStoreForItem(item);
    browserStorage.removeItem(key);
  }

  async set<T>(key: StorageKey, value: T) {
    const item = this.findItem(key);
    const browserStorage = this.getBrowserStoreForItem(item);
    browserStorage.setItem(key, JSON.stringify(value));
    item.subject.next(value);
  }
}

export class StorageItem {
  subject: ReplaySubject<any>;
  constructor(public key: StorageKey, public sessionOnly: boolean) {
    this.subject = new ReplaySubject<any>();
  }
}

export enum StorageKey {
  COOKIE_PERMISSION_STATE = 'COOKIE_PERMISSION_STATE',
  INVITE = 'INVITE'
}
