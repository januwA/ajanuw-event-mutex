import { Mutex, EventMutex } from "../src/index";

describe("main", () => {
  it("test Mutex", () => {
    let m = new Mutex(0);

    expect(m.isLock).toBe(false);
    let v = m.lock();
    expect(m.isLock).toBe(true);

    // 无法再次获取
    expect(m.lock()).toBeFalsy();

    expect(v?.get()).toBe(0);
    v?.set(1);
    expect(v?.get()).toBe(1);

    m.unlock();
    expect(m.isLock).toBe(false);

    v = m.lock();
    expect(v?.get()).toBe(1);
  });
});

describe("EventMutex", () => {
  it("test EventMutex auto", () => {
    const m = new EventMutex(() => {
      expect(m.isLock).toBe(true);
      return 1;
    });

    expect(m.isLock).toBe(false);
    expect(m.listener()).toBe(1);
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex", () => {
    const m = new EventMutex(() => {
      expect(m.isLock).toBe(true);
    }, false);

    expect(m.isLock).toBe(false);
    m.listener();
    expect(m.isLock).toBe(true);
  });

  it("test EventMutex 2", () => {
    const m = new EventMutex(() => {
      expect(m.isLock).toBe(true);
      m.unlock();
    }, false);

    expect(m.isLock).toBe(false);
    m.listener();
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex async", async () => {
    const m = new EventMutex(async () => {
      expect(m.isLock).toBe(true);
    });

    expect(m.isLock).toBe(false);
    await m.listener();
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex promise", () => {
    const m = new EventMutex<Promise<number>>(() => {
      return new Promise((r) => {
        setTimeout(() => {
          r(1);
        }, 5000);
      });
    });

    expect(m.isLock).toBe(false);
    m.listener();
    // 这里会等到promise完成才会自动解锁
    expect(m.isLock).toBe(true);
  });

  it("test EventMutex result", async () => {
    let m = new EventMutex<number>(() => {
      return 1;
    });
    expect(m.listener()).toBe(1);

    let m2 = new EventMutex<number>(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve(2);
          reject("err");
        }, 1000);
      });
    });
    expect(m2.isLock).toBe(false);
    try {
      await m2.listener();
      // expect(await m2.listener()).toBe(2);
    } catch (error) {
    } finally {
      expect(m2.isLock).toBe(false);
    }

    let m3 = new EventMutex<number>(async () => {
      return 3;
    });
    expect(await m3.listener()).toBe(3);

    let m4 = new EventMutex<number>(async () => {
      throw "err";
    });
    expect(m4.isLock).toBe(false);
    try {
      await m4.listener();
    } catch (error) {
    } finally {
      expect(m4.isLock).toBe(false);
    }
  });
});
