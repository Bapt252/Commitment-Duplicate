# Commitment - Plateforme de Recrutement

Une plateforme moderne de recrutement qui met en relation candidats et recruteurs grâce à l'intelligence artificielle.

## Structure du Projet

- `templates/` : Contient les fichiers HTML
- `static/` : Contient les ressources statiques
  - `styles/` : Feuilles de style CSS
  - `services/` : Scripts JavaScript pour la logique métier
  - `components/` : Scripts JavaScript pour les composants réutilisables
  - `images/` : Images et ressources graphiques

## Pages Principales

### Côté Candidat
- Page d'accueil (`index.html`)
- Connexion candidat (`candidate-login.html`)
- Tableau de bord candidat (`candidate-dashboard.html`)
- Téléchargement CV (`candidate-upload.html`)
- Questionnaire candidat (`candidate-questionnaire.html`)
- Sélection d'emploi (`candidate-job-selection.html`)
- Correspondances candidat (`candidate-matches.html`)
- Candidatures (`candidate-applications.html`)

### Côté Recruteur
- Connexion recruteur (`recruiter-login.html`)
- Tableau de bord recruteur (`recruiter-dashboard.html`)
- Publication d'offre (`post-job.html`)
- Questionnaire recruteur (`recruiter-questionnaire.html`)
- Matching de questionnaire (`recruiter-questionnaire-matching.html`)
- Sélection de candidat (`recruiter-candidate-selection.html`)
- Correspondances recruteur (`recruiter-matches.html`)

### Fonctionnalités Supplémentaires
- Planificateur (`scheduler.html`)
- Nouveau questionnaire candidat (`new-candidate-questionnaire.html`)

## Comment exécuter

Pour exécuter ce projet localement :

1. Clonez ce dépôt
2. Ouvrez le fichier `templates/index.html` dans votre navigateur

Pour un environnement de développement complet, vous pourriez utiliser un serveur local comme Live Server dans VS Code.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome pour les icônes
- Inter (Google Fonts) pour la typographie

## Remarque

Ce projet est actuellement une maquette statique. Pour une application complète, il faudrait implémenter :
- Un backend (Node.js, Python, etc.)
- Une base de données (MongoDB, PostgreSQL, etc.)
- Un système d'authentification
- API pour la gestion des données
- Algorithmes d'IA pour le matching