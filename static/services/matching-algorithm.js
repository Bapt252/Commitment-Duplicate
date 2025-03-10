/**
 * Algorithme de matching simple pour démonstration
 * Dans une application réelle, ce serait un algorithme plus complexe
 */

document.addEventListener("DOMContentLoaded", function() {
    // Vérifier si lutilisateur est connecté
    if (\!dataService.getCurrentUser()) {
        window.location.href = "candidate-login.html";
        return;
    }

    // Récupérer les matchs pour le candidat connecté
    displayMatches();
});

/**
 * Affiche les offres correspondant au profil du candidat
 */
function displayMatches() {
    const currentUser = dataService.getCurrentUser();
    
    if (\!currentUser || currentUser.type \!== "candidate") {
        console.error("Utilisateur non connecté ou non candidat");
        return;
    }
    
    const matchesContainer = document.getElementById("matches-container");
    if (\!matchesContainer) return;
    
    // Récupérer les matchs depuis le service
    const matches = dataService.getMatchesForCandidate(currentUser.id);
    
    // Si aucun match, afficher un message
    if (matches.length === 0) {
        matchesContainer.innerHTML = `
            <div class="no-results">
                <h3>Aucun match trouvé</h3>
                <p>Complétez votre profil pour obtenir des recommandations personnalisées.</p>
            </div>
        `;
        return;
    }
    
    // Afficher les matchs
    matches.forEach(match => {
        const job = match.job;
        const matchElement = document.createElement("div");
        matchElement.className = "match-card";
        
        // Définir la classe CSS basée sur le score
        let matchClass = "";
        if (match.score >= 80) {
            matchClass = "match-high";
        } else if (match.score >= 60) {
            matchClass = "match-medium";
        } else {
            matchClass = "match-low";
        }
        
        matchElement.innerHTML = `
            <div class="match-score ${matchClass}">
                <span class="match-percent">${Math.round(match.score)}%</span>
                <span class="match-text">match</span>
            </div>
            <div class="match-content">
                <div class="match-header">
                    <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
                    <div class="match-title">
                        <h3>${job.title}</h3>
                        <p class="company-name">${job.company} - ${job.location}</p>
                    </div>
                </div>
                <div class="match-body">
                    <p>${job.description}</p>
                    <div class="job-details">
                        <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span class="job-type">${job.type}</span>
                        ${job.salary ? `<span class="job-salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>` : ""}
                    </div>
                    ${job.requirements ? `
                    <div class="match-skills">
                        <h4>Compétences requises:</h4>
                        <ul>
                            ${job.requirements.map(req => `<li>${req}</li>`).join("")}
                        </ul>
                    </div>` : ""}
                </div>
                <div class="match-footer">
                    <button class="btn btn-primary" onclick="applyToJob(${job.id})">Postuler</button>
                    <button class="btn btn-secondary" onclick="showJobDetails(${job.id})">Voir détails</button>
                </div>
            </div>
        `;
        
        matchesContainer.appendChild(matchElement);
    });
}

/**
 * Postuler à une offre demploi
 * @param {number} jobId 
 */
function applyToJob(jobId) {
    const currentUser = dataService.getCurrentUser();
    
    if (\!currentUser || currentUser.type \!== "candidate") {
        alert("Veuillez vous connecter pour postuler à cette offre.");
        window.location.href = "candidate-login.html?jobId=" + jobId;
        return;
    }
    
    // Vérifier si loffre existe
    const job = dataService.getJobById(jobId);
    if (\!job) {
        alert("Cette offre nexiste pas ou a été supprimée.");
        return;
    }
    
    // Vérifier si le candidat a déjà postulé
    const applications = dataService.getCandidateApplications(currentUser.id);
    const alreadyApplied = applications.some(app => app.jobId === jobId);
    
    if (alreadyApplied) {
        alert("Vous avez déjà postulé à cette offre.");
        return;
    }
    
    // Simuler lenvoi de candidature
    dataService.applyToJob(jobId, currentUser.id, {
        coverLetter: "Candidature générée automatiquement.",
        status: "pending",
        appliedAt: new Date().toISOString()
    });
    
    alert("Votre candidature a été envoyée avec succès \!");
    
    // Rediriger vers la page des candidatures
    window.location.href = "candidate-applications.html";
}

/**
 * Affiche les détails dune offre dans une modale
 * @param {number} jobId 
 */
function showJobDetails(jobId) {
    const job = dataService.getJobById(jobId);
    if (\!job) return;
    
    // Créer une modale
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="job-details-header">
                <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
                <div>
                    <h2>${job.title}</h2>
                    <p class="company-name">${job.company} - ${job.location}</p>
                </div>
            </div>
            <div class="job-details-body">
                <div class="job-info">
                    <p><strong>Type:</strong> ${job.type}</p>
                    <p><strong>Catégorie:</strong> ${job.category}</p>
                    ${job.salary ? `<p><strong>Salaire:</strong> ${job.salary}</p>` : ""}
                    <p><strong>Date de publication:</strong> ${new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="job-description">
                    <h3>Description</h3>
                    <p>${job.description}</p>
                </div>
                ${job.requirements ? `
                <div class="job-requirements">
                    <h3>Compétences requises</h3>
                    <ul>
                        ${job.requirements.map(req => `<li>${req}</li>`).join("")}
                    </ul>
                </div>` : ""}
            </div>
            <div class="job-details-footer">
                <button class="btn btn-primary" onclick="applyToJob(${job.id})">Postuler maintenant</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Afficher la modale
    setTimeout(() => {
        modal.style.display = "flex";
    }, 10);
    
    // Fermer la modale
    const closeBtn = modal.querySelector(".close");
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Fermer la modale en cliquant en dehors
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
}
