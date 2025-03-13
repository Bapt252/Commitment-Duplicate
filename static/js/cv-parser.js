/**
 * CV Parser Interface - JavaScript
 * Gestion des interactions pour la page de parsing et optimisation de CV
 */

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // File Upload Functionality
    const dropZone = document.getElementById('dropZone');
    const fileUpload = document.getElementById('cvFileUpload');
    
    if (dropZone && fileUpload) {
        const uploadBtn = dropZone.querySelector('.file-upload-btn');
        
        // Trigger file input when clicking on the upload zone or button
        dropZone.addEventListener('click', function() {
            fileUpload.click();
        });
        
        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.classList.add('dragover');
        }
        
        function unhighlight() {
            dropZone.classList.remove('dragover');
        }
        
        // Handle file drop
        dropZone.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileUpload.files = files;
            handleFiles(files);
        }
        
        // Handle file selection via input
        fileUpload.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                // Check file type
                const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                if (!validTypes.includes(file.type)) {
                    showNotification('Format de fichier non supporté. Veuillez utiliser un fichier PDF, Word ou TXT.', 'error');
                    return;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Le fichier est trop volumineux. La taille maximale est de 5 Mo.', 'error');
                    return;
                }
                
                // Show loading state
                const uploadText = dropZone.querySelector('.file-upload-text h3');
                const originalText = uploadText.textContent;
                uploadText.textContent = 'Analyse en cours...';
                
                const uploadIcon = dropZone.querySelector('.file-upload-icon i');
                uploadIcon.className = 'fas fa-spinner fa-spin';
                
                // Simulate file upload and CV parsing (would be AJAX in production)
                setTimeout(() => {
                    // Show success state
                    uploadText.textContent = file.name;
                    uploadIcon.className = 'fas fa-check-circle';
                    uploadIcon.style.color = '#4CAF50';
                    
                    // Change button text
                    if (uploadBtn) {
                        uploadBtn.textContent = 'Changer de fichier';
                    }
                    
                    // Auto-fill form based on CV parsing
                    simulateCVParsing();
                    
                    // Show confirmation message
                    showNotification('CV importé avec succès! Les informations ont été automatiquement extraites.', 'success');
                }, 1500);
            }
        }
    }
    
    // Simulate CV parsing and form auto-filling
    function simulateCVParsing() {
        // This would normally be done by sending the file to a backend API
        // For demonstration, we'll simulate a parsed CV with data from the template
        
        // Auto-fill form fields with simulated data
        setFormValue('jobTitle', 'Développeur Full Stack');
        setFormValue('experience', 'intermediaire');
        setFormValue('industry', 'tech');
        setFormValue('lastPosition', 'Développeur Front-end Senior');
        setFormValue('company', 'TechSolutions');
        setFormValue('duration', '3 ans et 4 mois');
        setFormValue('jobDescription', 'Développement d\'applications web responsives utilisant React, Node.js et MongoDB. Chef d\'équipe sur plusieurs projets clients. Optimisation des performances et migration vers une architecture microservices.');
        setFormValue('highestDegree', 'Master en Ingénierie Informatique');
        setFormValue('school', 'École Supérieure d\'Informatique');
        setFormValue('graduationYear', '2018');
        setFormValue('skills', 'JavaScript, React, Node.js, Express, MongoDB, GraphQL, Docker');
        setFormValue('softSkills', 'Gestion de projet, Communication, Travail d\'équipe, Résolution de problèmes');
        
        // Highlight the pre-filled fields
        highlightFields();
    }
    
    // Helper function to set form values with validation
    function setFormValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
            // Add a class to indicate the field was auto-filled
            element.classList.add('auto-filled');
        }
    }
    
    // Highlight pre-filled fields with animation
    function highlightFields() {
        const autoFilledFields = document.querySelectorAll('.auto-filled');
        
        autoFilledFields.forEach((field, index) => {
            setTimeout(() => {
                field.classList.add('highlight-animation');
                setTimeout(() => {
                    field.classList.remove('highlight-animation');
                }, 1000);
            }, index * 100); // Stagger the animations
        });
    }
    
    // Form navigation and validation
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // In a real application, this would navigate back or cancel
            // For demo, we'll just show a notification
            showNotification('Opération annulée. Vous pouvez réimporter un nouveau CV.', 'info');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Validate the form before proceeding
            if (validateForm()) {
                // In a real app, this would move to the next step
                // For demo, we'll show a success message
                showNotification('Informations validées. Passage à l\'étape suivante...', 'success');
                
                // Simulate moving to next step
                simulateNextStep();
            }
        });
    }
    
    // Basic form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = [
            'jobTitle',
            'experience',
            'industry',
            'lastPosition',
            'company'
        ];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && !element.value.trim()) {
                element.classList.add('error');
                isValid = false;
                
                // Add error message
                let errorMsg = element.parentNode.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Ce champ est requis';
                    errorMsg.style.color = 'var(--danger-red)';
                    errorMsg.style.fontSize = '0.8rem';
                    errorMsg.style.marginTop = '0.25rem';
                    element.parentNode.appendChild(errorMsg);
                }
            } else if (element) {
                element.classList.remove('error');
                const errorMsg = element.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        if (!isValid) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
        }
        
        return isValid;
    }
    
    // Add event listeners to clear validation errors on input
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    // Simulate moving to next step
    function simulateNextStep() {
        // Update progress indicators
        const steps = document.querySelectorAll('.progress-step');
        if (steps.length >= 2) {
            steps[0].classList.add('completed');
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            
            // Update connectors
            const connectors = document.querySelectorAll('.step-connector');
            if (connectors.length >= 1) {
                connectors[0].style.backgroundColor = 'var(--success-green)';
            }
        }
        
        // In a real application, this would show the next step
        // For demo purposes, we'll just show a message
        setTimeout(() => {
            showNotification('Cette démo s\'arrête ici. En production, l\'application passerait à l\'étape de vérification des informations.', 'info');
        }, 1000);
    }
    
    // Notification function
    function showNotification(message, type = 'success') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => {
            notif.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Skill badges functionality
    const skillsInput = document.getElementById('skills');
    const softSkillsInput = document.getElementById('softSkills');
    
    // Function to update badges when input changes
    function setupSkillBadges(inputElement, badgeContainer, badgeClass) {
        if (inputElement && badgeContainer) {
            inputElement.addEventListener('change', function() {
                updateBadges(this.value, badgeContainer, badgeClass);
            });
            
            // Initial badges are already in HTML
        }
    }
    
    // Helper function to update badges
    function updateBadges(skillsString, container, badgeClass) {
        if (!container) return;
        
        // Clear existing badges
        container.innerHTML = '';
        
        // Create badges for each skill
        if (skillsString.trim()) {
            const skills = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
            
            skills.forEach(skill => {
                const badge = document.createElement('span');
                badge.className = `badge ${badgeClass}`;
                badge.textContent = skill;
                container.appendChild(badge);
            });
        }
    }
    
    // Setup badge functionality
    if (skillsInput) {
        const technicalBadgesContainer = document.querySelector('.skill-badges');
        setupSkillBadges(skillsInput, technicalBadgesContainer, 'badge-primary');
    }
    
    if (softSkillsInput) {
        const softSkillBadgesContainer = document.querySelectorAll('.skill-badges')[1];
        setupSkillBadges(softSkillsInput, softSkillBadgesContainer, 'badge-info');
    }
    
    // Animation au défilement
    const animatedElements = document.querySelectorAll('.fade-in');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animatedElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Si l'élément est visible dans la fenêtre
            if (elementBottom > windowTop && elementTop < windowBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    // Vérifier au chargement de la page
    checkIfInView();
    
    // Vérifier lors du défilement
    window.addEventListener('scroll', checkIfInView);
    
    // Bouton de retour en haut
    const scrollToTopButton = document.getElementById('scroll-to-top');
    
    if (scrollToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        });
        
        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add highlight animation class
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlightField {
            0% { background-color: rgba(124, 58, 237, 0); }
            50% { background-color: rgba(124, 58, 237, 0.1); }
            100% { background-color: rgba(124, 58, 237, 0); }
        }
        
        .highlight-animation {
            animation: highlightField 1s ease-in-out;
        }
        
        .form-control.auto-filled {
            border-left: 3px solid var(--purple);
        }
        
        .form-control.error {
            border-color: var(--danger-red);
        }
    `;
    document.head.appendChild(style);
});
