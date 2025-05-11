import { Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';

@Injectable()
export class MutexStoreService {
  private readonly userMutexes = new Map<string, Mutex>();

  getMutexForUser(userId: string): Mutex {
    if (!this.userMutexes.has(userId)) {
      this.userMutexes.set(userId, new Mutex());
    }
    return this.userMutexes.get(userId)!;
  }

  cleanupMutex(userId: string) {
    this.userMutexes.delete(userId);
  }
}
