# Commitment - Plateforme de Recrutement

Une plateforme moderne de recrutement qui met en relation candidats et recruteurs grâce à l'intelligence artificielle.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## Sécurité

Ce projet implémente plusieurs mesures de sécurité :

- Fichier `.gitignore` pour éviter de publier des données sensibles
- Politique de sécurité définie dans `SECURITY.md`
- Licence MIT pour la protection du code
- Aucune information sensible (identifiants, clés API, etc.) ne doit être stockée dans le code

### Bonnes pratiques

- Ne jamais stocker de clés API, secrets ou identifiants dans le code source
- Utiliser des variables d'environnement pour les configurations sensibles (quand le backend sera implémenté)
- Mettre en place une validation des entrées côté client et serveur
- Mettre en œuvre une protection CSRF pour les formulaires

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

Veuillez consulter notre fichier `CONTRIBUTING.md` pour plus de détails sur notre code de conduite et le processus de soumission de pull requests.

## Remarque

Ce projet est actuellement une maquette statique. Pour une application complète, il faudrait implémenter :
- Un backend (Node.js, Python, etc.)
- Une base de données (MongoDB, PostgreSQL, etc.)
- Un système d'authentification
- API pour la gestion des données
- Algorithmes d'IA pour le matching
- Mesures de sécurité supplémentaires pour protéger les données utilisateur

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
