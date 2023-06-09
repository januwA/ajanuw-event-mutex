type lockCallback_t = (isLock: boolean) => void;
export declare abstract class AbstractMutex {
    abstract lock(): void;
    abstract unlock(): void;
}
export declare class Mutex implements AbstractMutex {
    readonly lockCallback?: lockCallback_t | undefined;
    private _isLock;
    get isLock(): boolean;
    lock: () => void;
    unlock: () => void;
    constructor(lockCallback?: lockCallback_t | undefined);
}
export declare class EventMutex extends Mutex {
    readonly cb: Function;
    readonly isAutoRelease: boolean;
    private _isAsyncCb;
    constructor(cb: Function, isAutoRelease?: boolean, lockCallback?: lockCallback_t);
    listener: (...args: any[]) => any;
}
export {};
//# sourceMappingURL=index.d.ts.map