# web-launcher

launcher.js for WebLauncher (A special made android launcher application)

## Install

```bash
npm install android-web-launcher
```

## Usage

```javascript
import { launcher, PERMISSION_LAUNCHER, convertToCachedImageURL } from "android-web-launcher";
// or if you want a isolated instance, import class
// import { Launcher } from "android-web-launcher";
// const launcher = new Launcher();

// You can enable debug mode, this will allow you debug on your computer.
if (!launcher.isRunningInLauncher()) {
    launcher.startDebugSession();
}

// request permission first
await launcher.requestPermission(PERMISSION_LAUNCHER); // if user denied, it will throw an error
// get application list, apps: Array<{name:string, package:string, activity:string}>
let apps = await launcher.getApplicationList();
let app = apps[0]
// get application icon, (packageName, activity, size_in_px)
let src = launcher.getApplicationIconSrc(app.package, app.activity, 128);
// get cached dataurl for an icon
let dataurl = await convertToCachedImageURL(src);
// launch application
await launcher.launchApplication(packageName, activity);
```
