export class AbstractMutex {
}
export class Mutex {
    get isLock() {
        return this._isLock;
    }
    constructor(lockCallback) {
        this.lockCallback = lockCallback;
        this._isLock = false;
        this.lock = () => {
            var _a;
            this._isLock = true;
            (_a = this.lockCallback) === null || _a === void 0 ? void 0 : _a.call(this, this._isLock);
        };
        this.unlock = () => {
            var _a;
            this._isLock = false;
            (_a = this.lockCallback) === null || _a === void 0 ? void 0 : _a.call(this, this._isLock);
        };
    }
}
export class EventMutex extends Mutex {
    constructor(cb, isAutoRelease = true, lockCallback) {
        super(lockCallback);
        this.cb = cb;
        this.isAutoRelease = isAutoRelease;
        this._isAsyncCb = false;
        this.listener = (...args) => {
            if (this.isLock)
                return;
            this.lock();
            let res = this.cb(...args);
            if (this.isAutoRelease) {
                if (this._isAsyncCb) {
                    res = res.then((r) => {
                        this.unlock();
                        return r;
                    });
                }
                else {
                    this.unlock();
                }
            }
            return res;
        };
        if (typeof cb !== "function")
            throw `cb must be a function`;
        this._isAsyncCb =
            Object.prototype.toString.call(cb) === "[object AsyncFunction]";
    }
}
