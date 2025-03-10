// Afficher les offres d'emploi sur la page d'accueil
function displayJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    if (!jobsContainer) return;

    // Récupérer les emplois depuis le service
    const jobs = dataService.getJobs();
    
    // Vider le conteneur
    jobsContainer.innerHTML = '';

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-card-header">
                <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
                <div>
                    <h3>${job.title}</h3>
                    <p class="company-name">${job.company}</p>
                </div>
            </div>
            <div class="job-card-body">
                <p>${job.description}</p>
                <div class="job-details">
                    <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span class="job-type">${job.type}</span>
                    ${job.salary ? `<span class="job-salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>` : ''}
                </div>
                ${job.requirements ? `
                <div class="job-requirements">
                    <h4>Compétences requises:</h4>
                    <ul>
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
            <div class="job-card-footer">
                <a href="candidate-login.html?jobId=${job.id}" class="btn btn-secondary">Postuler</a>
                <a href="javascript:void(0);" class="btn-details" data-job-id="${job.id}">Voir détails</a>
            </div>
        `;
        jobsContainer.appendChild(jobCard);
    });

    // Ajouter les écouteurs d'événements pour les boutons de détails
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const jobId = parseInt(btn.getAttribute('data-job-id'));
            showJobDetails(jobId);
        });
    });
}

// Affiche les détails d'une offre dans une modale
function showJobDetails(jobId) {
    const job = dataService.getJobById(jobId);
    if (!job) return;
    
    // Créer une modale
    const modal = document.createElement('div');
    modal.className = 'modal';
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
                    ${job.salary ? `<p><strong>Salaire:</strong> ${job.salary}</p>` : ''}
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
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
            <div class="job-details-footer">
                <a href="candidate-login.html?jobId=${job.id}" class="btn btn-primary">Postuler maintenant</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Afficher la modale
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // Fermer la modale
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Fermer la modale en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
}

// Fonctionnalité de recherche
function setupSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!searchButton || !searchInput || !categoryFilter) return;

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        // Utiliser le service pour rechercher des emplois
        const jobsContainer = document.getElementById('jobs-container');
        if (!jobsContainer) return;
        
        // Vider le conteneur
        jobsContainer.innerHTML = '';
        
        // Récupérer les emplois filtrés
        const jobs = dataService.getJobs({
            search: searchTerm,
            category: category
        });
        
        if (jobs.length === 0) {
            jobsContainer.innerHTML = `
                <div class="no-results">
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche.</p>
                </div>
            `;
            return;
        }
        
        // Afficher les emplois filtrés
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <div class="job-card-header">
                    <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
                    <div>
                        <h3>${job.title}</h3>
                        <p class="company-name">${job.company}</p>
                    </div>
                </div>
                <div class="job-card-body">
                    <p>${job.description}</p>
                    <div class="job-details">
                        <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span class="job-type">${job.type}</span>
                        ${job.salary ? `<span class="job-salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>` : ''}
                    </div>
                </div>
                <div class="job-card-footer">
                    <a href="candidate-login.html?jobId=${job.id}" class="btn btn-secondary">Postuler</a>
                    <a href="javascript:void(0);" class="btn-details" data-job-id="${job.id}">Voir détails</a>
                </div>
            `;
            jobsContainer.appendChild(jobCard);
        });
        
        // Ajouter les écouteurs d'événements pour les boutons de détails
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = parseInt(btn.getAttribute('data-job-id'));
                showJobDetails(jobId);
            });
        });
    });
}

// Fonctionnalité de chargement de plus d'offres
function setupLoadMore() {
    const loadMoreButton = document.getElementById('load-more');
    if (!loadMoreButton) return;
    
    loadMoreButton.addEventListener('click', () => {
        // Simuler le chargement de plus d'offres
        loadMoreButton.textContent = 'Chargement...';
        loadMoreButton.disabled = true;
        
        setTimeout(() => {
            const newJobs = [
                {
                    id: 5,
                    title: "Data Scientist",
                    company: "DataCorp",
                    location: "Paris",
                    type: "CDI",
                    category: "tech",
                    logo: "../static/images/logo-placeholder.png",
                    description: "Exploitez les données pour générer des insights précieux.",
                    requirements: ["Python", "Machine Learning", "SQL", "2+ ans d'expérience"],
                    createdAt: new Date().toISOString(),
                    salary: "55K€ - 70K€"
                },
                {
                    id: 6,
                    title: "Responsable Communication",
                    company: "AgencyCom",
                    location: "Nantes",
                    type: "CDI",
                    category: "marketing",
                    logo: "../static/images/logo-placeholder.png",
                    description: "Définissez et mettez en œuvre la stratégie de communication.",
                    requirements: ["Communication", "Réseaux sociaux", "Relations presse", "5+ ans d'expérience"],
                    createdAt: new Date().toISOString(),
                    salary: "45K€ - 55K€"
                }
            ];
            
            // Ajouter les nouvelles offres au localStorage
            const jobs = JSON.parse(localStorage.getItem('jobs'));
            const jobIds = jobs.map(job => job.id);
            
            newJobs.forEach(job => {
                if (!jobIds.includes(job.id)) {
                    jobs.push(job);
                }
            });
            
            localStorage.setItem('jobs', JSON.stringify(jobs));
            
            // Rafraîchir l'affichage
            displayJobs();
            
            // Réactiver le bouton
            loadMoreButton.textContent = 'Voir plus d\'offres';
            loadMoreButton.disabled = false;
        }, 1000);
    });
}

// Initialisation pour la page d'accueil
function initHomePage() {
    displayJobs();
    setupSearch();
    setupLoadMore();
}

// Initialisation du site
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier la page actuelle et initialiser en conséquence
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        initHomePage();
    }
});