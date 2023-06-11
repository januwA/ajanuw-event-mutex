type lockCallback_t = (isLock: boolean) => void;

export abstract class AbstractMutex {
  abstract lock(): void;
  abstract unlock(): void;
}

export class Mutex implements AbstractMutex {
  /**锁状态 */
  private _isLock = false;

  get isLock() {
    return this._isLock;
  }

  /**加锁 */
  lock() {
    this._isLock = true;
    this.lockCallback?.(this._isLock);
  }

  /**释放锁 */
  unlock() {
    this._isLock = false;
    this.lockCallback?.(this._isLock);
  }

  constructor(public readonly lockCallback?: lockCallback_t) {}
}

export class EventMutex extends Mutex {
  private _isAsyncCb = false;

  constructor(
    public readonly cb: Function,
    public readonly isAutoRelease = true,
    lockCallback?: lockCallback_t
  ) {
    super(lockCallback);
    if (typeof cb !== "function") throw `cb must be a function`;

    this._isAsyncCb =
      Object.prototype.toString.call(cb) === "[object AsyncFunction]";
  }

  listener(...args: any[]) {
    if (this.isLock) return;

    this.lock();

    let res = this.cb(...args);

    // 自动释放锁?
    if (this.isAutoRelease) {
      if (this._isAsyncCb) {
        res = res.then((r: any) => {
          this.unlock();
          return r;
        });
      } else {
        this.unlock();
      }
    }

    return res;
  }
}
