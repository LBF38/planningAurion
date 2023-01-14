# Introduction

Ce projet consiste à automatiser la récupération du calendrier AURION des cours de l'ENSTA Bretagne. \
Il permet ainsi de transformer les données récupérées en fichier ics, qui est plus facile à importer dans les applications de calendrier classiques. \
De plus, ce projet a pour ambition de synchroniser les données à chaque mise à jour de celle-ci par la source (l'école). \
Ainsi, le calendrier dans notre application de calendrier (sur téléphone ou autre) sera toujours synchronisée avec le planning en cours de l'école.

## Installation

Ce projet est principalement codé en TypeScript et utilise NodeJS.
Pour lancer un script JS, utiliser la commande :

```bash
node [nom fichier].js
```

Pour lancer un script TypeScript, utiliser la commande :

```bash
ts-node [nom fichier].ts
```

Pour lancer le serveur de développement, utiliser la commande :

```bash
pnpm dev
```

ou

```bash
pnpm run dev
```

> **Note**
> Passage à `pnpm` plutôt que `npm` pour gérer les dépendances.

*Plus d'explications viendront plus tard dans le projet.*

## Roadmap

- [ ] Backend
  - [x] Connexion de l'utilisateur pour récup user token
  - [x] Récupération des données à partir de l'api ENSTA Bretagne (AURION)
  - [ ] Traitement et conversion au format ics
    - [x] Génération d'un fichier ics
    - [ ] Gérer les différences, les majs de calendrier, etc...
  - [ ] Génération d'un lien automatique pour synchronisation avec calendrier
  - [x] Gérer les erreurs ou alerter si problème.
- [ ] Frontend
  - [x] Site internet simple et facile d'utilisation
  - [x] Interface de login de base (pour connexion ENSTA B)
    - [x] username
    - [x] password
  - [ ] Passage à interface pour récup calendrier
    - [x] V1
      - [x] paramétrage des dates de la période à prendre
      - [x] Interface pour visualisation des changements
      - [x] Lien de téléchargement du fichier ics
    - [ ] V2
      - [ ] Lien de synchronisation directement
        - [ ] la synchro se fait automatiquement en backend avec le calendrier de l'utilisateur (que le calendrier soit : google calendar, outlook, apple calendar, ...)
- [ ] Vérification avant déploiement
  - [ ] Vérif sécurité
    - [ ] ne pas pouvoir accéder à la page après login si ne fonctionne pas.
- [ ] Documentation du code et du projet
