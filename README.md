# Commitment - Solution de Recrutement

Ce projet présente une interface web pour Nexten, une solution innovante de recrutement basée sur l'IA qui propose 10 correspondances personnalisées pour les candidats et les recruteurs.

## Nouvelle fonctionnalité : Analyse de fiche de poste

Une nouvelle fonctionnalité a été ajoutée : l'analyse automatique des fiches de poste. Elle permet aux recruteurs de télécharger ou coller leur fiche de poste pour extraire automatiquement les informations clés qui seront utilisées dans le processus de recrutement.

### Pour tester cette fonctionnalité :

1. Accédez à la page du questionnaire client : [client-questionnaire-working.html](https://bapt252.github.io/Commitment-Duplicate/templates/client-questionnaire-working.html)
2. Remplissez les informations de l'entreprise à l'étape 1 et passez à l'étape 2
3. À la question "Avez-vous un poste sur lequel vous souhaitez recruter ?", sélectionnez "Oui"
4. Utilisez le bouton "Analyser une fiche de poste" qui apparaît pour accéder à l'outil d'analyse
5. Sur la page d'analyse, téléchargez un fichier ou collez du texte, puis cliquez sur "Analyser"
6. Après l'analyse, cliquez sur "Continuer" pour revenir au questionnaire avec les champs pré-remplis

## Solutions aux problèmes précédents

Les problèmes de cache et d'intégration ont été résolus :

1. **Nouvelle version fonctionnelle** : Une nouvelle version du questionnaire client a été créée : [client-questionnaire-working.html](https://bapt252.github.io/Commitment-Duplicate/templates/client-questionnaire-working.html). Cette version inclut :
   - Une intégration directe du bouton d'analyse de fiche de poste dans le HTML
   - Des correctifs pour le cache du navigateur avec des méta-tags appropriés
   - Des logs améliorés pour faciliter le débogage
   - Une meilleure gestion des données entre les pages

2. **Versions alternatives** :
   - Version ancienne qui peut rencontrer des problèmes : [client-questionnaire.html](https://bapt252.github.io/Commitment-Duplicate/templates/client-questionnaire.html)
   - Version minimale simplifiée : [client-questionnaire-fixed.html](https://bapt252.github.io/Commitment-Duplicate/templates/client-questionnaire-fixed.html)

3. **Accès direct** : Vous pouvez également accéder directement à la page d'analyse via ce lien : [job-description-parser.html](https://bapt252.github.io/Commitment-Duplicate/templates/job-description-parser.html)

## Conseils d'utilisation

1. **Utilisez la version -working** : Pour une expérience sans problème, utilisez la version [client-questionnaire-working.html](https://bapt252.github.io/Commitment-Duplicate/templates/client-questionnaire-working.html)
2. **Hard refresh** : Si nécessaire, effectuez un hard refresh (Ctrl+F5 ou Cmd+Shift+R) pour vider le cache du navigateur
3. **Vérifiez la console** : Si vous rencontrez des problèmes, ouvrez la console développeur (F12) pour voir les messages de débogage

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