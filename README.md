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



### Build the app for production
```bash
quasar build
```

bundletool build-apks --bundle=dist/cordova/android/bundle/release/app-release.aab --output=dist/cordova/android/bundle/release/app-release.apks --mode=universal

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).




db pwd Oi6Ul2b54qzsM7C8



# IOS

- Build quasar project without building cordova wrapper: yarn quasar build -m ios --skip-pkg
- Enter cordova project: cd src-cordova
- Falls ios platform noch nicht hinzugefügt ist: cordova platform add ios
- Alternativ platform updaten: cordova prepare ios
- unter src-cordova/platforms/ios Digital Jürgisch ID.xcworkspace mit xCode öffnen 
- unter Signing & Capabilities - Team "Personal Team" auswählen 
- Bundle identifier: digital-juergens-id
- Unter Build Setting oben auf all und combined umstellen
- Unter Signing - Code Signing Identity auf Apple Development stellen
- App auf Gerät bauen



Since cordova-ios@6.x.x the following preferences have to be added to config.xml
<preference name="scheme" value="app" />
<preference name="hostname" value="localhost" />


