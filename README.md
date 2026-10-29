# Half Marathon Training Tracker

A simple mobile-friendly training plan for the half marathon on 7 February 2027. Tick off each session, track completed weeks, and export/import a backup of your progress.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. Open **Settings → Pages**.
4. Under build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Open the published Pages URL on your phone.

## Install as an app

- **iPhone:** open the published site in Safari → Share → Add to Home Screen.
- **Android:** open the published site in Chrome → menu → Install app / Add to Home screen.

The manifest and service worker are included. PWA installation requires HTTPS, which GitHub Pages provides.

## Progress storage

Progress is stored in this browser's local storage on your device. It does not sync between devices or browsers. Use **Export progress** to save a JSON backup, and **Import progress** to restore it.
