export class AbstractMutex {
}
export class Mutex {
    get isLock() {
        return this._isLock;
    }
    constructor(t) {
        this.t = t;
        this._isLock = false;
    }
    lock() {
        if (this._isLock)
            return;
        this._isLock = true;
        return {
            get: () => {
                return this.t;
            },
            set: (t) => {
                this.t = t;
            },
        };
    }
    unlock() {
        this._isLock = false;
    }
}
export class EventMutex extends Mutex {
    constructor(cb, isAutoRelease = true) {
        super(cb);
        this.isAutoRelease = isAutoRelease;
    }
    listener(...args) {
        const val = this.lock();
        if (!val) {
            throw new Error(`EventMutex listener get lock fail`);
        }
        if (!this.isAutoRelease) {
            return val.get().apply(this, args);
        }
        else {
            try {
                const res = val.get().apply(this, args);
                if (res instanceof Promise) {
                    return res.finally(() => {
                        this.unlock();
                    });
                }
                else {
                    this.unlock();
                    return res;
                }
            }
            catch (error) {
                this.unlock();
                throw error;
            }
        }
    }
}
