
/**
 * openIndexDatabase
 * @param {string} databaseName 
 * @param {number} version 
 * @returns {Promise<IDBDatabase>}
 */
export const openIndexDatabase = (databaseName, version) => {
    return new Promise((resolve, reject) => {
        const openRequest = self.indexedDB.open(databaseName, version);
        openRequest.onerror = () => { reject(openRequest.error); };
        openRequest.onsuccess = () => {
            resolve(openRequest.result);
        };
    });
};

/**
 * getObjectStore
 * @param {IDBDatabase} database 
 * @param {string} name 
 * @param {"readonly" | "readwrite" | "readwriteflush"} mode
 * @returns {IDBObjectStore | undefined}
 */
export const getObjectStore = (database, name, mode = "readonly") => {
    if (database.objectStoreNames.contains(name)) {
        const trans = database.transaction(name, mode, { durability: "relaxed" });
        return trans.objectStore(name);
    }
    return undefined;
};

/**
 * getOrCreateObjectStore
 * @param {IDBDatabase} database 
 * @param {string} name 
 * @param {"readonly" | "readwrite" | "readwriteflush"} mode
 * @returns {IDBObjectStore}
 */
export const getOrCreateObjectStore = (database, name, mode = "readwrite") => {
    if (database.objectStoreNames.contains(name)) {
        const trans = database.transaction(name, mode, { durability: "relaxed" });
        return trans.objectStore(name);
    } else {
        return database.createObjectStore(name);
    }
};

/**
 * executeIDBRequest
 * @param {IDBRequest<T>} request 
 * @returns {Promise<T>}
 */
export const executeIDBRequest = (request) => {
    return new Promise((resolve, reject) => {
        request.onerror = () => { reject(request.error); };
        request.onsuccess = () => {
            resolve(request.result);
        };
    });
};
