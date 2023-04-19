export { Launcher, PERMISSION_LAUNCHER } from "./launcher.js";
export { ApplicationInfo, LauncherResponseError, convertToCachedImageURL } from "./utils.js";

import { Launcher } from "./launcher.js";

export const launcher = new Launcher();
