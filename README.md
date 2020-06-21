# web-launcher

launcher.js for WebLauncher (A special made android launcher application)

## Install

```bash
npm install android-web-launcher
```

## Usage

```javascript
import { launcher } from "android-web-launcher";
// or if you want a isolated instance, import class
// import { Launcher } from "android-web-launcher";
// const launcher = new Launcher();
// auto select port, or set your own
// const launcher = new Launcher(10801);

// You can enable debug mode, this will allow you debug on your computer.
launcher.startDebugSession();

// request permission first
await launcher.requestPermission("launcher"); // if user denied, it will throw an error
// get application list, apps: Array<{name:string, package:string, activity:string}>
let apps = await launcher.getApplicationList();
// get application icon, (packageName, activity, size_in_px)
let src = launcher.getApplicationIconSrc(packageName, activity, 64);
// launch application
await launcher.launchApplication(packageName, activity);
```
