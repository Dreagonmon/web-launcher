import { ApplicationInfo, LauncherResponseError } from "./utils.js";

const KEY_STORE_PERMISSION = "__store_permissions__";

class Random {
    constructor (seed = Math.PI * Math.PI) {
        this.seed = seed;
    };

    nextInt (min, max) {
        const rand = Number.parseFloat("0." + Math.sin(this.seed++).toString().substr(6));
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(rand * (max - min)) + min;
    };
}

const ICON_SIZE = 128;
const WORD_LIST = [
    "otren", "nlttvwrarc", "fhoiaii", "eehednt", "xeomlea", "ennsheey", "msapeg", "etauwilash",
    "ytfi", "hosodad", "cemehn", "inra", "oeeow", "dubeto", "mauetehs", "deetrtre",
    "lelsiid", "nkghs", "admiat", "iadh", "hoyu", "mhyiiltaafm", "hrwjaw",
];
const COLOR_LIST = [
    "#f44336", "#e91e63", "#e91e63", "#7e57c2", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
    "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722",
    // "#795548", "#9e9e9e", "#9e9e9e",
];
const getRandomWord = function (random) {
    const pos = random.nextInt(0, WORD_LIST.length);
    return WORD_LIST[ pos ];
};
const getRandomColor = function (random) {
    const pos = random.nextInt(0, COLOR_LIST.length);
    return COLOR_LIST[ pos ];
};
const toFirstUpperCase = function (text) {
    return text.replace(/^./u, text.charAt(0).toUpperCase());
};
const generateRandomAppList = function (seed = Math.PI * Math.PI, size = 50) {
    const apps = [];
    const colors = {};
    const r = new Random(seed);
    for (let i = 0; i < size; i++) {
        const length = r.nextInt(1, 4); // name word count [1, 4)
        const app = new ApplicationInfo();
        for (let k = 0; k < length; k++) {
            const word = getRandomWord(r);
            app.name += toFirstUpperCase(word) + " ";
            app.package += word + ".";
        }
        app.activity = app.package + "MainActivity";
        app.name = app.name.substring(0, app.name.length - 1);
        app.package = app.package.substring(0, app.package.length - 1);
        const theme = [ getRandomColor(r), getRandomColor(r), getRandomColor(r) ];
        colors[ app.package ] = theme;
        apps.push(app);
    }
    return [ apps, colors ];
};

const [ APP_LIST, APP_THEME ] = generateRandomAppList();

export class MockServer {
    /** @type {Record<string,boolean>} */
    #permission = {};
    constructor () {
        this.#permission = {}; // permission records
        this.#loadHistoryPermission();
    }

    #hasLaunchPermission () {
        return !!this.#permission[ "launcher" ];
    };

    #loadHistoryPermission () {
        const store = sessionStorage.getItem(KEY_STORE_PERMISSION);
        if (store) {
            try {
                this.#permission = JSON.parse(store);
            } catch (err) {
                console.error(err);
            }
        }
    }

    #saveHistoryPermission () {
        sessionStorage.setItem(KEY_STORE_PERMISSION, JSON.stringify(this.#permission));
    }

    /**
     * getApplicationList
     * @returns {Promise<Array<ApplicationInfo>>}
     */
    async getApplicationList () {
        if (!this.#hasLaunchPermission()) {
            console.error("getApplicationList: You need request permission first!");
            throw new LauncherResponseError("No Permission");
        }
        return APP_LIST;
    };

    /**
     * getApplicationIconSrc
     * @param {string} packageName 
     * @param {string} activity 
     * @param {number} size 
     * @returns {string}
     */
    getApplicationIconSrc (packageName, activity, size = ICON_SIZE) {
        let theme;
        if (packageName != null) {
            theme = APP_THEME[ packageName ];
        } else {
            const r = new Random(Math.random() * Number.MAX_SAFE_INTEGER);
            theme = [ getRandomColor(r), getRandomColor(r), getRandomColor(r) ];
        }
        const SVG_IMAGE = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <g>
        <rect x="-1" y="-1" width="${size + 2}" height="${size + 2}" id="canvas_background" fill="none"/>
        </g>
        <g>
        <ellipse ry="${size / 2.2}" rx="${size / 2.2}" id="svg_3" cy="${size / 2}" cx="${size / 2}" stroke-width="0" stroke="#000" fill="${theme[ 0 ]}"/>
        <ellipse ry="${size / 3}" rx="${size / 3}" id="svg_3" cy="${size / 2}" cx="${size / 2}" stroke-width="0.5" stroke="#000" fill="${theme[ 1 ]}"/>
        <ellipse ry="${size / 5}" rx="${size / 5}" id="svg_3" cy="${size / 2}" cx="${size / 2}" stroke-width="0" stroke="#000" fill="${theme[ 2 ]}"/>
        </g>
        </svg>`;
        return "data:image/svg+xml;base64," + btoa(SVG_IMAGE);
    };

    /**
     * launchApplication
     * @param {string} packageName 
     * @param {string} activity 
     * @returns {Promise<boolean>}
     */
    async launchApplication (packageName, activity) {
        if (!this.#hasLaunchPermission()) {
            console.error("launchApplication: You need request permission first!");
            throw new LauncherResponseError("No Permission");
        }
        const frame = document.createElement("div");
        frame.style.width = "100%";
        frame.style.height = "100%";
        frame.style.background = "black";
        frame.style.position = "fixed";
        frame.style.top = 0;
        frame.style.right = 0;
        frame.style.bottom = 0;
        frame.style.left = 0;
        frame.style.textAlign = "center";
        frame.style.padding = "1em";
        frame.style.boxSizing = "border-box";
        frame.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            document.body.removeChild(frame);
        };
        const title = document.createElement("h1");
        title.innerText = "Application";
        title.style.color = "white";
        title.style.wordBreak = "break-all";
        frame.appendChild(title);
        const pkg = document.createElement("h3");
        pkg.innerText = packageName;
        pkg.style.color = "white";
        pkg.style.wordBreak = "break-all";
        frame.appendChild(pkg);
        const pkg2 = document.createElement("h3");
        pkg2.innerText = activity;
        pkg2.style.color = "white";
        pkg2.style.wordBreak = "break-all";
        frame.appendChild(pkg2);
        document.body.appendChild(frame);
        return true;
    };

    /**
     * openWebpageInBrowser
     * @param {string} targetURL 
     * @returns {Promise<boolean>}
     */
    async openWebpage (targetURL) {
        if (!this.#hasLaunchPermission()) {
            console.error("openWebpage: You need request permission first!");
            throw new LauncherResponseError("No Permission");
        }
        window.open(targetURL, "_blank");
        return true;
    };

    /**
     * requestPermission
     * @param {string} name 
     * @returns {Promise<boolean>} success
     */
    async requestPermission (name) {
        const NAME_MAP = {
            launcher: "Launcher",
        };
        if (![ "launcher" ].includes(name)) {
            console.error("requestPermission: Permission name not support!");
            throw new LauncherResponseError("Permission name not support");
        }
        if (this.#permission[ name ]) {
            return true;
        }
        const result = confirm(`Do you want to grant ${NAME_MAP[ name ]} permission to ${window.location.origin} ?`);
        if (result) {
            this.#permission[ name ] = true;
            this.#saveHistoryPermission();
            return true;
        }
        throw new LauncherResponseError("Permission denided");
    }
}