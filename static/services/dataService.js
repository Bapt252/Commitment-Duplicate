/**
 * Service de gestion des données - Simule un backend en utilisant localStorage
 */

class DataService {
    constructor() {
        this.initializeData();
    }

    /**
     * Initialise les données de base si elles n'existent pas
     */
    initializeData() {
        // Initialiser les offres d'emploi
        if (!localStorage.getItem('jobs')) {
            localStorage.setItem('jobs', JSON.stringify([
                {
                    id: 1,
                    title: "Développeur Full Stack",
                    company: "TechCorp",
                    location: "Paris",
                    type: "CDI",
                    category: "tech",
                    logo: "../static/images/logo-placeholder.png",
                    description: "Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe.",
                    requirements: ["JavaScript", "React", "Node.js", "MongoDB", "3+ ans d'expérience"],
                    createdAt: new Date().toISOString(),
                    salary: "45K€ - 60K€"
                },
                {
                    id: 2,
                    title: "UX/UI Designer",
                    company: "DesignStudio",
                    location: "Lyon",
                    type: "CDI",
                    category: "design",
                    logo: "../static/images/logo-placeholder.png",
                    description: "Rejoignez notre équipe de designers créatifs.",
                    requirements: ["Figma", "Adobe XD", "Sketch", "2+ ans d'expérience"],
                    createdAt: new Date().toISOString(),
                    salary: "40K€ - 50K€"
                },
                {
                    id: 3,
                    title: "Chef de projet Marketing",
                    company: "MarketingPro",
                    location: "Bordeaux",
                    type: "CDI",
                    category: "marketing",
                    logo: "../static/images/logo-placeholder.png",
                    description: "Gérez des campagnes marketing innovantes pour nos clients.",
                    requirements: ["Marketing digital", "SEO/SEA", "Réseaux sociaux", "5+ ans d'expérience"],
                    createdAt: new Date().toISOString(),
                    salary: "50K€ - 65K€"
                },
                {
                    id: 4,
                    title: "Développeur Mobile",
                    company: "AppFactory",
                    location: "Toulouse",
                    type: "CDI",
                    category: "tech",
                    logo: "../static/images/logo-placeholder.png",
                    description: "Développez des applications mobiles performantes et innovantes.",
                    requirements: ["iOS", "Android", "Flutter ou React Native", "3+ ans d'expérience"],
                    createdAt: new Date().toISOString(),
                    salary: "45K€ - 60K€"
                }
            ]));
        }

        // Initialiser les utilisateurs (candidats et recruteurs)
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                {
                    id: 1,
                    type: 'candidate',
                    email: 'candidat@example.com',
                    password: 'password123', // Dans une vraie application, utiliser bcrypt
                    name: 'Jean Dupont',
                    title: 'Développeur Full Stack',
                    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                    experience: 4,
                    location: 'Paris',
                    applicationIds: [],
                    profileCompleted: false
                },
                {
                    id: 2,
                    type: 'recruiter',
                    email: 'recruteur@example.com',
                    password: 'password123', // Dans une vraie application, utiliser bcrypt
                    name: 'Marie Martin',
                    company: 'TechCorp',
                    industry: 'Tech',
                    location: 'Paris',
                    jobIds: [1]
                }
            ]));
        }

        // Initialiser les applications (candidatures)
        if (!localStorage.getItem('applications')) {
            localStorage.setItem('applications', JSON.stringify([]));
        }

        // Initialiser les matchings
        if (!localStorage.getItem('matches')) {
            localStorage.setItem('matches', JSON.stringify([]));
        }
    }

    /**
     * Authentifie un utilisateur
     * @param {string} email 
     * @param {string} password 
     * @param {string} userType - 'candidate' ou 'recruiter'
     * @returns {Object|null} Utilisateur authentifié ou null
     */
    login(email, password, userType) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => 
            u.email === email && 
            u.password === password && 
            u.type === userType
        );
        
        if (user) {
            // Stocker l'utilisateur connecté
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                type: user.type,
                name: user.name,
                email: user.email
            }));
            return user;
        }
        
        return null;
    }

    /**
     * Enregistre un nouvel utilisateur
     * @param {Object} userData 
     * @returns {Object} Utilisateur créé
     */
    register(userData) {
        const users = JSON.parse(localStorage.getItem('users'));
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return newUser;
    }

    /**
     * Récupère l'utilisateur actuellement connecté
     * @returns {Object|null} Utilisateur connecté ou null
     */
    getCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    /**
     * Déconnecte l'utilisateur
     */
    logout() {
        localStorage.removeItem('currentUser');
    }

    /**
     * Récupère toutes les offres d'emploi
     * @param {Object} filters - Filtres à appliquer
     * @returns {Array} Liste des offres d'emploi
     */
    getJobs(filters = {}) {
        let jobs = JSON.parse(localStorage.getItem('jobs'));
        
        // Appliquer les filtres
        if (filters.category) {
            jobs = jobs.filter(job => job.category === filters.category);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            jobs = jobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Tri par date de création (le plus récent d'abord)
        jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return jobs;
    }

    /**
     * Récupère une offre d'emploi par son ID
     * @param {number} id 
     * @returns {Object|null} Offre d'emploi ou null
     */
    getJobById(id) {
        const jobs = JSON.parse(localStorage.getItem('jobs'));
        return jobs.find(job => job.id === parseInt(id)) || null;
    }

    /**
     * Crée une nouvelle offre d'emploi
     * @param {Object} jobData 
     * @returns {Object} Offre d'emploi créée
     */
    createJob(jobData) {
        const jobs = JSON.parse(localStorage.getItem('jobs'));
        const newJob = {
            id: jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) + 1 : 1,
            ...jobData,
            createdAt: new Date().toISOString()
        };
        
        jobs.push(newJob);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        
        // Ajouter l'ID du job au recruteur
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.type === 'recruiter') {
            const users = JSON.parse(localStorage.getItem('users'));
            const recruiterIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (recruiterIndex !== -1) {
                if (!users[recruiterIndex].jobIds) {
                    users[recruiterIndex].jobIds = [];
                }
                users[recruiterIndex].jobIds.push(newJob.id);
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        return newJob;
    }

    /**
     * Soumet une candidature à une offre d'emploi
     * @param {number} jobId 
     * @param {number} candidateId 
     * @param {Object} applicationData 
     * @returns {Object} Candidature créée
     */
    applyToJob(jobId, candidateId, applicationData) {
        const applications = JSON.parse(localStorage.getItem('applications'));
        const newApplication = {
            id: applications.length > 0 ? Math.max(...applications.map(app => app.id)) + 1 : 1,
            jobId,
            candidateId,
            status: 'pending',
            ...applicationData,
            createdAt: new Date().toISOString()
        };
        
        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Ajouter l'ID de la candidature au candidat
        const users = JSON.parse(localStorage.getItem('users'));
        const candidateIndex = users.findIndex(u => u.id === candidateId);
        
        if (candidateIndex !== -1) {
            if (!users[candidateIndex].applicationIds) {
                users[candidateIndex].applicationIds = [];
            }
            users[candidateIndex].applicationIds.push(newApplication.id);
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        return newApplication;
    }

    /**
     * Récupère les candidatures d'un candidat
     * @param {number} candidateId 
     * @returns {Array} Liste des candidatures
     */
    getCandidateApplications(candidateId) {
        const applications = JSON.parse(localStorage.getItem('applications'));
        return applications.filter(app => app.candidateId === candidateId);
    }

    /**
     * Récupère les candidatures pour une offre d'emploi
     * @param {number} jobId 
     * @returns {Array} Liste des candidatures
     */
    getJobApplications(jobId) {
        const applications = JSON.parse(localStorage.getItem('applications'));
        return applications.filter(app => app.jobId === jobId);
    }

    /**
     * Met à jour le statut d'une candidature
     * @param {number} applicationId 
     * @param {string} status 
     * @returns {Object} Candidature mise à jour
     */
    updateApplicationStatus(applicationId, status) {
        const applications = JSON.parse(localStorage.getItem('applications'));
        const appIndex = applications.findIndex(app => app.id === applicationId);
        
        if (appIndex !== -1) {
            applications[appIndex].status = status;
            applications[appIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('applications', JSON.stringify(applications));
            return applications[appIndex];
        }
        
        return null;
    }

    /**
     * Sauvegarde le profil d'un candidat
     * @param {number} candidateId 
     * @param {Object} profileData 
     * @returns {Object} Profil mis à jour
     */
    saveCandidateProfile(candidateId, profileData) {
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === candidateId);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...profileData, profileCompleted: true };
            localStorage.setItem('users', JSON.stringify(users));
            return users[userIndex];
        }
        
        return null;
    }

    /**
     * Génère des matchings aléatoires pour un candidat
     * Cette fonction simule un algorithme de matching intelligent
     * @param {number} candidateId 
     * @returns {Array} Liste des offres d'emploi correspondantes
     */
    getMatchesForCandidate(candidateId) {
        const jobs = this.getJobs();
        const users = JSON.parse(localStorage.getItem('users'));
        const candidate = users.find(u => u.id === candidateId);
        
        if (!candidate) return [];
        
        // Algorithme de matching simple basé sur les compétences
        let matches = [];
        
        if (candidate.skills && candidate.skills.length > 0) {
            jobs.forEach(job => {
                if (job.requirements) {
                    // Calculer un score de correspondance basé sur les compétences
                    const matchingSkills = job.requirements.filter(req => 
                        candidate.skills.some(skill => 
                            skill.toLowerCase().includes(req.toLowerCase()) || 
                            req.toLowerCase().includes(skill.toLowerCase())
                        )
                    );
                    
                    const score = matchingSkills.length / job.requirements.length;
                    
                    if (score > 0.2) { // Seuil minimal de correspondance
                        matches.push({
                            jobId: job.id,
                            score: score * 100,
                            job: job
                        });
                    }
                }
            });
            
            // Trier par score de correspondance
            matches.sort((a, b) => b.score - a.score);
            
            // Limiter à 10 correspondances
            matches = matches.slice(0, 10);
        }
        
        // Si pas assez de correspondances, ajouter des offres aléatoires
        if (matches.length < 10) {
            const remainingJobs = jobs.filter(job => 
                !matches.some(match => match.jobId === job.id)
            );
            
            const randomJobs = this.getRandomElements(remainingJobs, 10 - matches.length);
            
            randomJobs.forEach(job => {
                matches.push({
                    jobId: job.id,
                    score: Math.floor(Math.random() * 50) + 30, // Score aléatoire entre 30 et 80
                    job: job
                });
            });
        }
        
        return matches;
    }

    /**
     * Génère des matchings aléatoires pour une offre d'emploi
     * Cette fonction simule un algorithme de matching intelligent
     * @param {number} jobId 
     * @returns {Array} Liste des candidats correspondants
     */
    getMatchesForJob(jobId) {
        const users = JSON.parse(localStorage.getItem('users'));
        const candidates = users.filter(u => u.type === 'candidate');
        const job = this.getJobById(jobId);
        
        if (!job) return [];
        
        // Algorithme de matching simple basé sur les compétences
        let matches = [];
        
        if (job.requirements && job.requirements.length > 0) {
            candidates.forEach(candidate => {
                if (candidate.skills && candidate.skills.length > 0) {
                    // Calculer un score de correspondance basé sur les compétences
                    const matchingSkills = candidate.skills.filter(skill => 
                        job.requirements.some(req => 
                            skill.toLowerCase().includes(req.toLowerCase()) || 
                            req.toLowerCase().includes(skill.toLowerCase())
                        )
                    );
                    
                    const score = matchingSkills.length / job.requirements.length;
                    
                    if (score > 0.2) { // Seuil minimal de correspondance
                        matches.push({
                            candidateId: candidate.id,
                            score: score * 100,
                            candidate: {
                                id: candidate.id,
                                name: candidate.name,
                                title: candidate.title,
                                skills: candidate.skills,
                                experience: candidate.experience,
                                location: candidate.location
                            }
                        });
                    }
                }
            });
            
            // Trier par score de correspondance
            matches.sort((a, b) => b.score - a.score);
            
            // Limiter à 10 correspondances
            matches = matches.slice(0, 10);
        }
        
        // Si pas assez de correspondances, ajouter des candidats aléatoires
        if (matches.length < 10) {
            const remainingCandidates = candidates.filter(candidate => 
                !matches.some(match => match.candidateId === candidate.id)
            );
            
            const randomCandidates = this.getRandomElements(remainingCandidates, 10 - matches.length);
            
            randomCandidates.forEach(candidate => {
                matches.push({
                    candidateId: candidate.id,
                    score: Math.floor(Math.random() * 50) + 30, // Score aléatoire entre 30 et 80
                    candidate: {
                        id: candidate.id,
                        name: candidate.name,
                        title: candidate.title,
                        skills: candidate.skills,
                        experience: candidate.experience,
                        location: candidate.location
                    }
                });
            });
        }
        
        return matches;
    }

    /**
     * Récupère n éléments aléatoires d'un tableau
     * @param {Array} array 
     * @param {number} n 
     * @returns {Array} Tableau de n éléments aléatoires
     */
    getRandomElements(array, n) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }
}

// Créer une instance du service
const dataService = new DataService();