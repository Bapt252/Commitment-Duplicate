// Fonction pour ouvrir la modal explicative des pourcentages
function openPercentageModal() {
    const modal = document.getElementById('percentage-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Fonction pour fermer la modal explicative des pourcentages
function closePercentageModal() {
    const modal = document.getElementById('percentage-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Fonction pour simuler le chargement des propositions de candidats
function loadCandidateProposals() {
    // En environnement de production, cette fonction ferait un appel API
    // Pour la démo, nous utilisons des données fictives
    return [
        {
            name: "Jean D.",
            profileTitle: "Développeur Full Stack",
            cvLink: "#",
            jobType: "CDI CDD Intérim",
            salary: "45K€ - 55K€",
            availability: "Immédiate",
            matchPercentage: 90,
            commuteTime: "25 min"
        },
        {
            name: "Sophie M.",
            profileTitle: "UX/UI Designer",
            cvLink: "#",
            jobType: "CDI CDD",
            salary: "40K€ - 50K€",
            availability: "Dans 1 mois",
            matchPercentage: 85,
            commuteTime: "30 min"
        },
        {
            name: "Thomas B.",
            profileTitle: "Product Manager",
            cvLink: "#",
            jobType: "CDI uniquement",
            salary: "50K€ - 60K€",
            availability: "Dans 2 mois",
            matchPercentage: 70,
            commuteTime: "35 min"
        },
        {
            name: "Julie L.",
            profileTitle: "Data Analyst",
            cvLink: "#",
            jobType: "CDI CDD",
            salary: "42K€ - 52K€",
            availability: "Immédiate",
            matchPercentage: 65,
            commuteTime: "20 min"
        }
    ];
}

// Fonction pour simuler le chargement des propositions de postes
function loadJobProposals() {
    // En environnement de production, cette fonction ferait un appel API
    // Pour la démo, nous utilisons des données fictives
    return [
        {
            title: "Développeur Full Stack",
            description: "Développement d'applications web et mobiles",
            company: "Tech Solutions",
            contractType: "CDI",
            salary: "45K€ - 55K€",
            startDate: "Immédiat",
            matchPercentage: 90,
            commuteTime: "25 min"
        },
        {
            title: "UX/UI Designer",
            description: "Conception d'interfaces utilisateur",
            company: "Creative Agency",
            contractType: "CDI",
            salary: "40K€ - 50K€",
            startDate: "01/04/2025",
            matchPercentage: 65,
            commuteTime: "30 min"
        },
        {
            title: "Product Manager",
            description: "Gestion de produits numériques",
            company: "Digital Products",
            contractType: "CDI",
            salary: "50K€ - 60K€",
            startDate: "01/05/2025",
            matchPercentage: 70,
            commuteTime: "35 min"
        },
        {
            title: "Data Analyst",
            description: "Analyse de données et reporting",
            company: "Data Insights",
            contractType: "CDD",
            salary: "42K€ - 52K€",
            startDate: "Immédiat",
            matchPercentage: 65,
            commuteTime: "20 min"
        }
    ];
}

// Fonction pour générer le HTML des propositions de candidats
function renderCandidateProposals() {
    const proposals = loadCandidateProposals();
    const container = document.querySelector('.proposals-grid');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    proposals.forEach(proposal => {
        const card = document.createElement('div');
        card.className = 'proposal-card';
        card.innerHTML = `
            <div class="proposal-header">
                <div class="proposal-title">${proposal.name}</div>
                <div class="proposal-match">
                    <div class="match-icons">
                        <div class="match-icon check">✓</div>
                        <div class="match-icon cross">✗</div>
                    </div>
                    <div class="match-percentage" onclick="openPercentageModal()">${proposal.matchPercentage}%</div>
                </div>
            </div>
            <div class="proposal-body">
                <div class="proposal-info">
                    <div class="proposal-info-label">Intitulé du profil</div>
                    <div class="proposal-info-value">${proposal.profileTitle}</div>
                </div>
                <div class="proposal-info">
                    <div class="proposal-info-label">CV</div>
                    <a href="${proposal.cvLink}" class="proposal-link">Voir le CV</a>
                </div>
                <div class="proposal-info">
                    <div class="proposal-info-label">Recherche</div>
                    <div class="proposal-info-value">${proposal.jobType}</div>
                </div>
                <div class="proposal-info">
                    <div class="proposal-info-label">Rémunération</div>
                    <div class="proposal-info-value">${proposal.salary}</div>
                </div>
            </div>
            <div class="proposal-footer">
                <div class="proposal-meta">
                    <div>Temps de trajet : ${proposal.commuteTime}</div>
                </div>
                <div class="proposal-meta">
                    <div>Disponibilité : ${proposal.availability}</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Fonction pour générer le HTML des propositions de postes
function renderJobProposals() {
    const proposals = loadJobProposals();
    const container = document.querySelector('.proposals-grid');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    proposals.forEach(proposal => {
        const card = document.createElement('div');
        card.className = 'proposal-card';
        card.innerHTML = `
            <div class="proposal-header">
                <div class="proposal-title">${proposal.title}</div>
                <div class="proposal-match">
                    <div class="match-icons">
                        <div class="match-icon check">✓</div>
                        <div class="match-icon cross">✗</div>
                    </div>
                    <div class="match-percentage" onclick="openPercentageModal()">${proposal.matchPercentage}%</div>
                </div>
            </div>
            <div class="proposal-body">
                <div class="proposal-info">
                    <div class="proposal-info-label">Descriptif de poste</div>
                    <div class="proposal-info-value">${proposal.description}</div>
                </div>
                <div class="proposal-info">
                    <div class="proposal-info-label">Entreprise</div>
                    <div class="proposal-info-value">${proposal.company}</div>
                </div>
                <div class="proposal-info">
                    <div class="proposal-info-label">Contrat</div>
                    <div class="proposal-info-value">${proposal.contractType}</div>
                </div>
                <div class="proposal-info">
                    <div class="proposal-info-label">Rémunération</div>
                    <div class="proposal-info-value">${proposal.salary}</div>
                </div>
            </div>
            <div class="proposal-footer">
                <div class="proposal-meta">
                    <div>Temps de trajet : ${proposal.commuteTime}</div>
                </div>
                <div class="proposal-meta">
                    <div>Date prévue de prise de poste : ${proposal.startDate}</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Fonction pour rediriger vers la page des propositions après le questionnaire
function redirectToProposals(userType) {
    if (userType === 'candidate') {
        // Correction du chemin de redirection pour GitHub Pages
        window.location.href = 'candidate-jobs-proposals.html';
    } else if (userType === 'recruiter') {
        // Correction du chemin de redirection pour GitHub Pages
        window.location.href = 'recruiter-candidates-proposals.html';
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Déterminer quelle page est actuellement chargée
    const currentPage = document.body.dataset.page;
    
    // Initialiser les écouteurs d'événements pour la modal
    const closeButton = document.querySelector('.percentage-modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closePercentageModal);
    }
    
    // Initialiser la modal pour fermer si on clique à l'extérieur
    const modal = document.getElementById('percentage-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePercentageModal();
            }
        });
    }
    
    // Charger les propositions appropriées selon la page
    if (currentPage === 'candidate-proposals') {
        renderJobProposals();
    } else if (currentPage === 'recruiter-proposals') {
        renderCandidateProposals();
    }
    
    // Écouteurs pour les formulaires de questionnaire
    const candidateForm = document.getElementById('candidate-form');
    if (candidateForm) {
        candidateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simuler un traitement des données
            setTimeout(() => {
                redirectToProposals('candidate');
            }, 1000);
        });
    }
    
    const recruiterForm = document.getElementById('recruiter-form');
    if (recruiterForm) {
        recruiterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simuler un traitement des données
            setTimeout(() => {
                redirectToProposals('recruiter');
            }, 1000);
        });
    }
});