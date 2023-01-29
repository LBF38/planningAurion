<p align="center">
  <a href="https://aurion-synchronizer.onrender.com">
    <img src="./src/static/img/orion.png" width=50%>
    <h3 align="center">Aurion Synchronizer</h3>
  </a>
</p>

<p align="center">
  <a href="./docs/README.md"><strong>Documentation</strong></a> .
  <a href="./docs/synchronisation.md"><strong>Guide synchronisation</strong></a> .
  <a href="https://github.com/lbf38/planningAurion/issues"><strong>Issues</strong></a>
</p>

***
![Release info](https://img.shields.io/github/v/release/lbf38/planningAurion?style=plastic) ![GitHub issues](https://img.shields.io/github/issues-raw/lbf38/planningAurion?style=plastic) ![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/lbf38/planningAurion?style=plastic)

# Introduction

Ce projet consiste à automatiser la récupération du calendrier AURION des cours de l'[ENSTA Bretagne](https://ensta-bretagne.fr).

Il permet ainsi de transformer les données récupérées en fichier ics, qui est plus facile à importer dans les applications de calendrier classiques.

De plus, ce projet a pour ambition de synchroniser les données à chaque mise à jour de celle-ci par la source (l'école).

Ainsi, le calendrier dans notre application de calendrier (sur téléphone ou autre) sera toujours synchronisée avec le planning en cours de l'école (sous 24h).

## Table des matières

- [Introduction](#introduction)
  - [Table des matières](#table-des-matières)
  - [Installation](#installation)
  - [Utilisation](#utilisation)
  - [Roadmap](#roadmap)
  - [Auteurs](#auteurs)

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

## Utilisation

Rendez-vous sur le site <https://aurion-synchronizer.onrender.com>.

Actions possibles :

- S'authentifier avec ses identifiants ENSTA Bretagne
- Récupérer et télécharger son calendrier sur une période choisie
- Mettre à jour manuellement son calendrier
- Utiliser le lien comme source de synchronisation pour son calendrier
- Supprimer son compte

## Roadmap

> **Warning**
> Ce projet sera maintenu jusqu'à la fin de l'année scolaire 2022-2023.

- [x] Backend
  - [x] Connexion de l'utilisateur pour récup user token
  - [x] Récupération des données à partir de l'api ENSTA Bretagne (AURION)
  - [x] Traitement et conversion au format ics
    - [x] Génération d'un fichier ics
    - [x] ~~Gérer les différences, les majs de calendrier, etc...~~ => pas besoin, on récupère tout le calendrier (mis à jour) à chaque fois
  - [x] Génération d'un lien automatique pour synchronisation avec calendrier
  - [x] Gérer les erreurs ou alerter si problème.
- [x] Frontend
  - [x] Site internet simple et facile d'utilisation
  - [x] Interface de login de base (pour connexion ENSTA B)
    - [x] username
    - [x] password
  - [x] Passage à interface pour récup calendrier
    - [x] V1
      - [x] paramétrage des dates de la période à prendre
      - [x] Interface pour visualisation des changements
      - [x] Lien de téléchargement du fichier ics
    - [x] V2
      - [x] Lien de synchronisation directement
        - [x] la synchro se fait automatiquement en backend avec le calendrier de l'utilisateur (que le calendrier soit : google calendar, outlook, apple calendar, ...)
- [x] Vérification avant déploiement
  - [x] Vérif sécurité
    - [x] ~~ne pas pouvoir accéder à la page après login si ne fonctionne pas.~~ => non implémenté car pas de risque dans ce projet.
- [x] Documentation du code et du projet

## Auteurs

- [@LBF38](https://github.com/LBF38) : développeur principal du projet (backend et frontend)
- [@thomas40510](https://github.com/thomas40510) : développeur sur la partie frontend

> **Note**
> Le code que vous trouverez ici fut la possibilité pour moi d'apprendre TypeScript, NodeJS et d'autres technologies auxquelles je n'étais pas particulièrement familier. Il est donc possible que le code soit peu optimisé ou mal écrit. N'hésitez pas à me faire des retours sur le code ou sur le projet en général.
> La structure du code et les fonctions mises en place pourraient être nettement améliorées. Cependant, ce projet consistait en un court side project afin d'automatiser la synchronisation de mon calendrier avec celui de l'école. Il n'a pas pour but d'être un projet à long terme.
>
> *- LBF38*
