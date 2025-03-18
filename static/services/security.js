/**
 * Service de sécurité pour protéger les informations sensibles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour nettoyer l'URL des informations sensibles
    function cleanSensitiveInfoFromURL() {
        const url = new URL(window.location.href);
        let paramsRemoved = false;
        
        // Supprimer les paramètres sensibles
        if (url.searchParams.has('email')) {
            url.searchParams.delete('email');
            paramsRemoved = true;
        }
        
        if (url.searchParams.has('password')) {
            url.searchParams.delete('password');
            paramsRemoved = true;
        }
        
        // Si des paramètres ont été supprimés, mettre à jour l'URL sans recharger la page
        if (paramsRemoved) {
            const newURL = url.origin + url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '');
            window.history.replaceState({}, document.title, newURL);
            console.log('URL sécurisée: Informations sensibles supprimées');
        }
    }

    // Nettoyer l'URL dès le chargement de la page
    cleanSensitiveInfoFromURL();
});
