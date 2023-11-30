# Digital Jürgisch ID (digital-juergisch-id)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```

db pwd Oi6Ul2b54qzsM7C8


### Build the app for production




#### Android
```bash
yarn quasar build -m android
```

```bash
bundletool build-apks --bundle=dist/cordova/android/bundle/release/app-release.aab --output=dist/cordova/android/bundle/release/app-release.apks --mode=universal
```


#### IOS

- Build quasar project without building cordova wrapper:
```bash
yarn quasar build -m ios --skip-pkg
```
- Enter cordova project:
```bash
cd src-cordova
```
- Falls ios platform noch nicht hinzugefügt ist:
```bash
cordova platform add ios
```
- Alternativ platform updaten:
```bash
cordova prepare ios
```
- unter src-cordova/platforms/ios Digital Jürgisch ID.xcworkspace mit xCode öffnen 
- unter Signing & Capabilities - Team "Personal Team" auswählen 
- Bundle identifier: digital-juergens-id
- Unter Build Setting oben auf all und combined umstellen
- Unter Signing - Code Signing Identity auf Apple Development stellen
- App auf Gerät bauen



Since cordova-ios@6.x.x the following preferences have to be added to config.xml
<preference name="scheme" value="app" />
<preference name="hostname" value="localhost" />


