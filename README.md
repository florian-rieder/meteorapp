# Medintake
Medintake permet d'accéder aux informations de ses médicaments, telles que leur notice d'emballage ou leur composition, en scannant le code barre de l'emballage ou en le recherchant. L'application offre également des fonctionnalités de gestion de sa pharmacie, en permettant de classer ses médicaments, de surveiller leurs dates d'expiration.

# Technologie
Medintake utilise le framework Meteor.js 1.8.1 avec Cordova pour le portage sur mobile (Android).

## Librairies
- Bootstrap (CSS)
- Sweet Alert 2 (boîtes de dialogues)
- Puppeteer (web scraping)
- QuaggaJS (scan de codes barre)
- Iron:Router (routes)

## Plugins Cordova
- cordova-plugin-camera (caméra mobile)
- cordova-plugin-android-permissions (permissions caméra mobile)
- cordova-plugin-local-notification

# Installation
## Web (version de développement)
Ligne de commande :
```
// installer les dépendances
meteor npm install

// lancer la construction de l'application
meteor run
```
## Mobile
Suivre les instructions d'installations sur [ce guide officiel](https://guide.meteor.com/mobile.html#installing-prerequisites-android).

Ligne de commande :
```
// installer les dépendances
meteor npm install

// lancer la construction de l'application

// sur un appareil android connecté par USB
meteor run android-device

// sur un émulateur
meteor run android
```
