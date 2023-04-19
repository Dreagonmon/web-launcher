import { MockServer } from "./mockServer.js";
import { ApplicationInfo, LauncherResponseError } from "./utils.js";

export const PERMISSION_LAUNCHER = "launcher";

// launcher api
export class Launcher {
    #envMayNotExist = false;
    #address = "";
    /** @type {MockServer | undefined} */
    #mockServer = undefined;
    constructor () {
        /** @deprecated Use 'PERMISSION_LAUNCHER' in the module. */
        this.PERMISSION_LAUNCHER = "launcher";
        let port = 10801;
        // try to get the port
        try {
            const re = /WebLauncher\/\d*? \(port (\d*?)\)/g;
            const portText = re.exec(navigator.userAgent)[ 1 ];
            port = Number.parseInt(portText);
            if (portText == null || port <= 0 || port > 65535) {
                port = 10801;
                this.#envMayNotExist = true;
            }
        } catch {
            console.log("error, default port!", port);
            this.#envMayNotExist = true;
        }
        console.log("using port:", port);
        let protocol = window.location.protocol;
        if (protocol !== "http:") {
            protocol = "https:";
        }
        this.#address = `${protocol}//127.0.0.1:${port}/api/`;
        // debug mock server
        this.#mockServer = undefined;
    };

    /**
     * isRunningInLauncher
     * @returns {boolean}
     */
    isRunningInLauncher () {
        return !this.#envMayNotExist;
    }

    /**
     * getApplicationList
     * @returns {Promise<Array<ApplicationInfo>>}
     */
    async getApplicationList () {
        if (this.#mockServer) {
            return await this.#mockServer.getApplicationList();
        }
        const url = `${this.#address}app-list-all?t=${new Date().getTime()}`;
        const resp = await fetch(url);
        if (resp.status !== 200) {
            throw new LauncherResponseError("status code not 200!");
        }
        const arrays = JSON.parse(await resp.text());
        const appList = arrays.map(item => {
            const app = new ApplicationInfo();
            app.name = item.name;
            app.package = item.package;
            app.activity = item.activity;
            return app;
        });
        return appList;
    };

    /**
     * getApplicationIconSrc
     * @param {string} packageName 
     * @param {string} activity 
     * @param {number} size 
     * @returns {string}
     */
    getApplicationIconSrc (packageName, activity, size = 128) {
        if (this.#mockServer) {
            return this.#mockServer.getApplicationIconSrc(packageName, activity, size);
        }
        return `${this.#address}icon?package=${packageName}&activity=${activity}&size=${size}`;
    };

    /**
     * launchApplication
     * @param {string} packageName 
     * @param {string} activity 
     * @returns {Promise<boolean>}
     */
    async launchApplication (packageName, activity) {
        if (this.#mockServer) {
            return await this.#mockServer.launchApplication(packageName, activity);
        }
        const url = `${this.#address}launch?package=${packageName}&activity=${activity}&t=${new Date().getTime()}`;
        const resp = await fetch(url);
        if (resp.status !== 200) {
            throw new LauncherResponseError("status code not 200!");
        }
        return true;
    };

    /**
     * requestPermission
     * @param {string} name 
     * @returns {Promise<boolean>} success
     */
    async requestPermission (name) {
        if (this.#mockServer) {
            return await this.#mockServer.requestPermission(name);
        }
        const url = `${this.#address}request-permission?name=${name}&t=${new Date().getTime()}`;
        const resp = await fetch(url);
        if (resp.status !== 200) {
            throw new LauncherResponseError("status code not 200!");
        }
        return true;
    };

    /**
     * startDebugSession
     */
    startDebugSession () {
        this.#mockServer = new MockServer();
    };
};
