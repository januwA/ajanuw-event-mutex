export abstract class AbstractMutex<T> {
  abstract lock():
    | {
        get(): T;
        set(t: T): void;
      }
    | undefined;
  abstract unlock(): void;
}

export class Mutex<T> implements AbstractMutex<T> {
  /**锁状态 */
  private _isLock = false;

  get isLock() {
    return this._isLock;
  }

  constructor(private t: T) {}

  /**获取锁 */
  lock() {
    if (this._isLock) return;

    this._isLock = true;

    return {
      get: () => {
        return this.t;
      },
      set: (t: T) => {
        this.t = t;
      },
    };
  }

  /**释放锁 */
  unlock() {
    this._isLock = false;
  }
}

export class EventMutex<R> extends Mutex<(...args: any[]) => R> {
  constructor(cb: (...args: []) => R, public readonly isAutoRelease = true) {
    super(cb);
  }

  listener(...args: any[]): R {
    const val = this.lock();
    if (!val) {
      throw new Error(`EventMutex listener get lock fail`);
    }

    if (!this.isAutoRelease) {
      return val.get().apply(this, args);
    } else {
      try {
        const res = val.get().apply(this, args);
        if (res instanceof Promise) {
          return res.finally(() => {
            this.unlock();
          }) as R;
        } else {
          this.unlock();
          return res;
        }
      } catch (error) {
        this.unlock();
        throw error;
      }
    }
  }
}
