export { Launcher, PERMISSION_LAUNCHER } from "./src/launcher.js";
export { ApplicationInfo, LauncherResponseError, convertToCachedImageURL } from "./src/utils.js";

import { Launcher } from "./src/launcher.js";

export const launcher = new Launcher();
