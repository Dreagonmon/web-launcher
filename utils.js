import { executeIDBRequest, getObjectStore, getOrCreateObjectStore, openIndexDatabase } from "./indexdb.js";

const KEY_DATABASE = "__launcher_cache__";
const VERSION_CACHE_STORE = 1;
const KEY_OBJECT_STORE = "__image_data_url_cache__";

export class ApplicationInfo {
    constructor () {
        this.name = "";
        this.package = "";
        this.activity = "";
    }
}

export class LauncherResponseError extends Error {
    constructor (msg) {
        super("LauncherResponseError: " + msg);
    }
}

/* Cache Control */
/**
 * 
 * @param {string} src 
 * @returns {Promise<string>}
 */
const getCache = async (src) => {
    let db = undefined;
    try {
        db = await openIndexDatabase(KEY_DATABASE, VERSION_CACHE_STORE);
        const store = getObjectStore(db, KEY_OBJECT_STORE, "readonly");
        if (store === undefined) {
            return undefined;
        }
        const cache = await executeIDBRequest(store.get(src));
        return cache;
    } catch (err) {
        console.error(err);
        return undefined;
    } finally {
        if (db !== undefined) {
            db.close();
        }
    }
};

/**
 * updateCache
 * @param {string} src 
 * @param {string} value 
 * @returns {Promise<void>}
 */
const updateCache = async (src, value) => {
    let db = undefined;
    try {
        db = await openIndexDatabase(KEY_DATABASE, VERSION_CACHE_STORE);
        console.log(db);
        const store = getOrCreateObjectStore(db, KEY_OBJECT_STORE, "readwrite");
        console.log(store);
        const key = await executeIDBRequest(store.put(value, src));
        console.log(key);
        console.log("update cache:", key);
    } catch (err) {
        console.error(err);
    } finally {
        if (db !== undefined) {
            db.close();
        }
    }
};

/**
 * loadImageToDataURL
 * @param {string} src 
 * @returns {Promise<string>} dataURL
 */
const loadImageToDataURL = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            resolve(canvas.toDataURL());
        };
        const onerror = (event) => {
            reject(event);
        };
        img.addEventListener("load", onload);
        img.addEventListener("error", onerror);
        img.src = src;
    });
};

/**
 * convertImageURL
 * @param {string} src 
 * @param {boolean} [reload=false] 
 * @returns {Promise<string>}
 */
export const convertToCachedImageURL = async (src, reload = false) => {
    const cache = await getCache(src);
    if (typeof cache !== "string") {
        reload = true;
    } else {
        return cache;
    }
    if (reload) {
        console.log("Cache Mismatch");
        const url = await loadImageToDataURL(src);
        await updateCache(src, url);
        return url;
    }
};
