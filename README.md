Cette application a été réalisée dans le cadre du cours "Programmation pour Internet II - Meteor.js" donné par Isaac Pante et Loris Rimaz à l'Université de Lausanne (UNIL) durant le semestre de printemps 2019.

# Medintake
Medintake permet d'accéder aux informations de ses médicaments, telles que leur notice d'emballage ou leur composition, en scannant le code barre de l'emballage ou en le recherchant dans la base de données de médicaments disponible sur [compendium.ch](https://www.compendium.ch). L'application propose d'aider à la gestion de sa pharmacie en mettant à disposition les informations importantes sur chaque médicament, en permettant de les classer dans différentes catégories, et en proposant de fournir des notifications de rappel pour la prise de traitements.

# Fonctionnalités
L'application repose sur la mise à disposition de l'utilisateur d'informations importantes concernant ses médicaments. Pour les obtenir, il peut soit scanner le code barre présent sur l'emballage de ses médicaments, soit le rechercher dans la base de données compendium.

![Scan](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/scan.png "Scan")
![Recherche](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/search.png "Recherche")

Il peut ensuite ajouter ses médicaments à sa pharmacie, et les classer dans différentes catégories qu'il peut créer.

![Catégories](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/categories.png "Catégories")
![Liste de médicaments](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/list.png "Liste de médicaments")

Pour chaque médicament, l'utilisateur a accès:
* à une image du médicament
* à son fabricant
* à sa composition
* aux emballages en vente ainsi qu'à leur prix
* à sa notice d'emballage

![Données de médicaments](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/details.png "Données de médicaments")
![Notice de médicaments](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/notice.png "Notice de médicaments")

Enfin, il peut également enregistrer des rappels pour prendre des médicaments, et est averti si la date d'expiration d'un médicament est dépassée.

![Traitement](https://raw.githubusercontent.com/Sergenti/meteorapp/master/screenshots/traitement.png "Traitement")

L'utilisateur a accès à une page de profil, où il peut enregistrer des informations personnelles, et a également la possibilité d'enregistrer les coordonnées de pharmacies, personnes ou institutions dans la page d'aide, de façon à rassembler toutes les informations qui pourraient lui être utile dans l'application.

# Base de données
Medintake utilise 5 collections MongoDB:
* Drugs: contient les données de tous les médicaments enregistrés par l'utilisateur.
* Categories: contient les catégories de l'utilisateur. Chaque catégorie contient des clés étrangères faisant référence à des documents contenus dans la collection Drugs.
* Profile: contient le profil de l'utilisateur.
* Pharmacies et Contacts: contiennent les coordonnées de pharmacies et de personnes/institutions entrées par l'utilisateur.

# Technologie
Medintake utilise le framework Meteor.js 1.8.1 avec Cordova pour le portage sur mobile (Android). L'application est pensée et structurée dans l'optique d'une application locale (web view et embedded server).

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
Suivre les instructions d'installation sur [ce guide officiel](https://guide.meteor.com/mobile.html#installing-prerequisites-android).

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

# Contributeurs
- Florian Rieder
- Pedro Tomé
- Amirhossein	Asadizanjani
- Célia Riva