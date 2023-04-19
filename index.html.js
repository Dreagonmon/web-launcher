import { convertToCachedImageURL, launcher, PERMISSION_LAUNCHER } from "./index.js";

if (!launcher.isRunningInLauncher()) {
    launcher.startDebugSession();
}

window.addEventListener("load", async () => {
    await launcher.requestPermission(PERMISSION_LAUNCHER);
    const apps = await launcher.getApplicationList();
    const app = apps[ 0 ];
    // const imageURL = await loadImage(launcher.getApplicationIconSrc(app.package, app.activity, 128));
    // console.log(imageURL);
    const src = `http://127.0.0.1:8000/icon.png?t=${new Date().getTime()}`;
    let url = await convertToCachedImageURL(src);
    // console.log(await url)
    url = await convertToCachedImageURL(src);
    // console.log(await url)
    console.log(url);
});
