import { Mutex, EventMutex } from "../src/index";

describe("main", () => {
  it("test Mutex", () => {
    const m = new Mutex();
    m.lock();
    expect(m.isLock).toBe(true);

    m.unlock();
    expect(m.isLock).toBe(false);
  });
});

describe("EventMutex", () => {
  it("test EventMutex auto", () => {
    const m = new EventMutex(() => {
      expect(m.isLock).toBe(true);
    });

    expect(m.isLock).toBe(false);
    m.listener();
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

  it("test EventMutex async", async () => {
    const m = new EventMutex(async () => {
      throw `err`;
    });

    expect(m.isLock).toBe(false);
    try {
      await m.listener();
    } catch (error) {}
    expect(m.isLock).toBe(false);
  });
});
