// Script pour ajouter des fonctionnalités au header
document.addEventListener('DOMContentLoaded', () => {
    // Marquer le lien de navigation actif
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
    
    // Ajouter la fonctionnalité responsive pour le menu mobile
    // (Dans une vraie application, on ajouterait ici le code pour un menu burger, etc.)
});