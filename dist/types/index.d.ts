export declare abstract class AbstractMutex<T> {
    abstract lock(): {
        get(): T;
        set(t: T): void;
    } | undefined;
    abstract unlock(): void;
}
export declare class Mutex<T> implements AbstractMutex<T> {
    private t;
    private _isLock;
    get isLock(): boolean;
    constructor(t: T);
    lock(): {
        get: () => T;
        set: (t: T) => void;
    } | undefined;
    unlock(): void;
}
export declare class EventMutex<R> extends Mutex<(...args: any[]) => R> {
    readonly isAutoRelease: boolean;
    constructor(cb: (...args: []) => R, isAutoRelease?: boolean);
    listener(...args: any[]): R;
}
//# sourceMappingURL=index.d.ts.map