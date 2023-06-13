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
  it("test EventMutex sync AutoRelease", () => {
    const m = new EventMutex(() => {
      expect(m.isLock).toBe(true);
      return 1;
    });

    expect(m.isLock).toBe(false);
    expect(m.listener()).toBe(1);
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex async AutoRelease", () => {
    const m = new EventMutex(async () => {
      return 1;
    });

    expect(m.isLock).toBe(false);
    m.listener();
    expect(m.isLock).toBe(true);
  });

  it("test EventMutex unlock", () => {
    const m = new EventMutex(() => {
      return Promise.resolve(1);
    }, false);

    expect(m.isLock).toBe(false);
    m.listener();
    expect(m.isLock).toBe(true);
    m.unlock();
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex unlock 2", () => {
    const m = new EventMutex(() => {
      expect(m.isLock).toBe(true);
      m.unlock();
    }, false);

    expect(m.isLock).toBe(false);
    m.listener();
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex async/await", async () => {
    const m = new EventMutex(async () => {
      expect(m.isLock).toBe(true);
    });

    expect(m.isLock).toBe(false);
    await m.listener();
    expect(m.isLock).toBe(false);
  });

  it("test EventMutex result", async () => {
    let m = new EventMutex(() => {
      return 1;
    });
    expect(m.listener()).toBe(1);

    let m2 = new EventMutex(() => {
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

    let m3 = new EventMutex(async () => {
      return 3;
    });
    expect(await m3.listener()).toBe(3);

    let m4 = new EventMutex(async () => {
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
