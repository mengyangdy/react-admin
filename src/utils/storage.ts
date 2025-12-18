import { createLocalforage, createStorage } from "@dy/utils";

const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || "";
export const localStg = createStorage<StorageType.Local>("local", storagePrefix);
export const sessionStg = createStorage<StorageType.Local>("session", storagePrefix);
export const localforage = createLocalforage<StorageType.Local>("local");
