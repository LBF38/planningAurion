# Documentation de l'API et du projet

Ce projet consiste à récupérer automatiquement les informations du site de l'ENSTA Bretagne (<https://formation.ensta-bretagne.fr>) pour récupérer le planning de l'utilisateur qui se connecte via le formulaire de la page principale.

## Informations générales

Parcours de l'utilisateur :

- L'utilisateur se connecte via la page principale de mon serveur (`index`).
  - Si tout fonctionne bien, il est redirigé vers une page pour choisir la période de planning qu'il veut récupérer. (`planning/pull`)
  - Sinon, il est redirigé vers la page principale avec une explication de l'erreur (`index`).
- L'utilisateur choisit la période de planning qu'il veut récupérer.
  - Si tout fonctionne bien, il est redirigé vers une page pour récupérer un lien vers le fichier `ics` ou le télécharger. (`planning/download`)
  - Sinon, il est redirigé vers la page précédente avec une explication de l'erreur (`planning/pull`).
- L'utilisateur récupère le lien vers le fichier `ics` ou le télécharge.

## Routes de l'API

- `GET /` : Page principale du serveur.
- `POST /planning/pull` : Récupère le planning de l'utilisateur.
- `GET /planning/download` : Télécharge le fichier `ics` du planning de l'utilisateur.
- `POST /login` : Connexion de l'utilisateur.
