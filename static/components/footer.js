// Script pour ajouter des fonctionnalités au footer
document.addEventListener('DOMContentLoaded', () => {
    // Mise à jour de l'année du copyright
    const footerYear = document.querySelector('footer .container p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
    }
    
    // Dans une vraie application, on pourrait ajouter ici d'autres fonctionnalités
    // comme un formulaire de newsletter, des liens vers les réseaux sociaux, etc.
});