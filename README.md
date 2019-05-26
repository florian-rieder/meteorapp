# Medintake
Medintake permet d'accéder aux informations de ses médicaments, telles que leur notice d'emballage ou leur composition, en scannant le code barre de l'emballage ou en le recherchant dans la base de données de médicaments proposée par [compendium.ch](https://www.compendium.ch). L'application propose d'aider à la gestion de sa pharmacie en mettant à disposition les informations importantes sur chaque médicament, en permettant de les classer dans différentes catégories, et en proposant de fournir des notifications de rappel pour la prise de traitements.

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
# installer les dépendances
meteor npm install

# lancer la construction de l'application
meteor run
```
## Mobile
Suivre les instructions d'installations sur [ce guide officiel](https://guide.meteor.com/mobile.html#installing-prerequisites-android).

Ligne de commande :
```
# installer les dépendances
meteor npm install

# lancer la construction de l'application

# sur un appareil android connecté par USB
meteor run android-device

# ou sur un émulateur
meteor run android
```
Ensuite, ajouter le fichier AndroidManifest.xml (à la racine de ce repo) dans .meteor > local > cordova-build > platforms > android > app > src > main.