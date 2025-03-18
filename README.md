# Commitment - Solution de Recrutement

Ce projet présente une interface web pour Nexten, une solution innovante de recrutement basée sur l'IA qui propose 10 correspondances personnalisées pour les candidats et les recruteurs.

## Nouvelle fonctionnalité : Analyse de fiche de poste

Une nouvelle fonctionnalité a été ajoutée : l'analyse automatique des fiches de poste. Elle permet aux recruteurs de télécharger ou coller leur fiche de poste pour extraire automatiquement les informations clés qui seront utilisées dans le processus de recrutement.

### Pour tester cette fonctionnalité :

1. Accédez à la page du questionnaire client : [client-questionnaire.html](https://bapt252.github.io/Commitment-/templates/client-questionnaire.html)
2. Remplissez les informations de l'entreprise à l'étape 1 et passez à l'étape 2
3. À la question "Avez-vous un poste sur lequel vous souhaitez recruter ?", sélectionnez "Oui"
4. Utilisez le bouton "Analyser une fiche de poste" qui apparaît (s'il n'apparaît pas, consultez la note ci-dessous)
5. Sur la page d'analyse, téléchargez un fichier ou collez du texte, puis cliquez sur "Analyser"
6. Après l'analyse, cliquez sur "Continuer" pour revenir au questionnaire avec les champs pré-remplis

> **Note importante** : Si le bouton "Analyser une fiche de poste" n'apparaît pas après avoir sélectionné "Oui", vous pouvez accéder directement à la page d'analyse via ce lien : [job-description-parser.html](https://bapt252.github.io/Commitment-/templates/job-description-parser.html)

## Problèmes connus

En raison du cache de GitHub Pages, la dernière version du site peut ne pas être immédiatement disponible. Si vous rencontrez des problèmes :

1. Essayez d'accéder directement à la version corrigée : [client-questionnaire-fixed.html](https://bapt252.github.io/Commitment-/templates/client-questionnaire-fixed.html)
2. Ou effectuez un hard refresh de la page (Ctrl+F5 ou Cmd+Shift+R)

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage et SessionStorage pour la gestion de l'état entre les pages

## Fonctionnalités

- Questionnaire client interactif en plusieurs étapes
- Analyse automatique de fiches de poste
- Extraction d'informations clés (compétences, expérience, salaire, etc.)
- Pré-remplissage intelligent des formulaires

## Structure des fichiers

- `/templates/` - Pages HTML du site
- `/static/styles/` - Feuilles de style CSS
- `/static/scripts/` - Scripts JavaScript
- `/assets/` - Images et autres ressources