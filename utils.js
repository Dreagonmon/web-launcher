const KEY_CACHE_STORE = "__launcher_image_data_url_cache__";

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

/**
 * makeRequest
 * @param {string} src 
 * @returns {Request}
 */
const makeRequest = (src) => {
    return new Request(src, {
        method: "GET",
    });
};

/**
 * makeRequest
 * @param {string} value 
 * @returns {Response}
 */
const makeResponse = (value) => {
    return new Response(value, {
        status: 200,
    });
};

/* Cache Control */
/**
 * 
 * @param {string} src 
 * @returns {Promise<string | undefined>}
 */
const getCache = async (src) => {
    if (!src.startsWith("http")) { return undefined; }
    try {
        const cache = await self.caches.open(KEY_CACHE_STORE);
        const req = makeRequest(src);
        const resp = await cache.match(req, {
            ignoreMethod: true,
            ignoreSearch: true,
            ignoreVary: true,
        });
        if (resp) {
            return await resp.text();
        }
    } catch (err) {
        console.error(err);
    }
    return undefined;
};

/**
 * updateCache
 * @param {string} src 
 * @param {string} value 
 * @returns {Promise<void>}
 */
const updateCache = async (src, value) => {
    if (!src.startsWith("http")) { return; }
    try {
        const cache = await self.caches.open(KEY_CACHE_STORE);
        const req = makeRequest(src);
        const resp = makeResponse(value);
        await cache.delete(req, {
            ignoreMethod: true,
            ignoreSearch: true,
            ignoreVary: true,
        });
        await cache.put(req, resp);
    } catch (err) {
        console.error(err);
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
        img.src = src + `&t=${new Date().getTime()}`; // force refresh
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
        const url = await loadImageToDataURL(src);
        await updateCache(src, url);
        return url;
    }
};
