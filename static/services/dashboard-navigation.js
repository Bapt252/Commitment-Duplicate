/**
 * Dashboard Navigation Script
 * Handles all interactions for the candidate dashboard
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
    
    // Scroll to top functionality
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

    // Dashboard section navigation
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    const dashboardMenu = document.getElementById('dashboard-menu');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const backButtons = document.querySelectorAll('.section-back');

    // Function to show a specific section
    function showSection(sectionId) {
        // Hide dashboard menu
        dashboardMenu.classList.remove('section-active');
        
        // Hide all sections
        dashboardSections.forEach(section => {
            section.classList.remove('section-active');
        });
        
        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('section-active');
            // Scroll to top of the section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Function to show the main dashboard menu
    function showDashboardMenu() {
        // Hide all sections
        dashboardSections.forEach(section => {
            section.classList.remove('section-active');
        });
        
        // Show dashboard menu
        dashboardMenu.classList.add('section-active');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add click event listeners to dashboard cards
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // Add click event listeners to back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const returnTo = this.getAttribute('data-return');
            if (returnTo === 'dashboard-menu') {
                showDashboardMenu();
            } else if (returnTo) {
                showSection(returnTo);
            }
        });
    });

    // Handle filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find all filter buttons in the same container
            const container = this.closest('div');
            const siblingButtons = container.querySelectorAll('.filter-button');
            
            // Remove active class from all buttons in this container
            siblingButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to the clicked button
            this.classList.add('active');
        });
    });

    // Handle accept/reject buttons in offers
    const acceptButtons = document.querySelectorAll('.btn-circle.accept');
    const rejectButtons = document.querySelectorAll('.btn-circle.reject');
    
    acceptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const offerCard = this.closest('.offer-card');
            if (offerCard) {
                // Add a visual feedback class
                offerCard.style.borderTopColor = 'var(--success)';
                
                // You would typically send an AJAX request here to update the status in the backend
                
                // Show a confirmation message (in a real app, this could be a toast notification)
                alert('Offre acceptée avec succès !');
            }
        });
    });
    
    rejectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const offerCard = this.closest('.offer-card');
            if (offerCard) {
                // Add a visual feedback class
                offerCard.style.borderTopColor = 'var(--danger)';
                offerCard.style.opacity = '0.6';
                
                // You would typically send an AJAX request here to update the status in the backend
                
                // Show a confirmation message (in a real app, this could be a toast notification)
                alert('Offre refusée.');
            }
        });
    });

    // Handle conversation selection in messaging
    const conversationItems = document.querySelectorAll('.conversation-item');
    
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all conversation items
            conversationItems.forEach(convItem => {
                convItem.classList.remove('active');
            });
            
            // Add active class to the clicked item
            this.classList.add('active');
            
            // In a real app, you would load the conversation content here
            // For this demo, we'll just show a message
            console.log('Conversation selected:', this.querySelector('.conversation-name').textContent);
        });
    });

    // Handle chat form submission
    const chatForm = document.querySelector('.input-container');
    const chatTextarea = document.querySelector('.chat-input textarea');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatForm && sendButton) {
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
        
        // Allow Enter key to submit
        chatTextarea?.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = chatTextarea.value.trim();
        if (message) {
            // Create a new message element
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message sent';
            
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    <p>${message}</p>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            
            // Add to chat
            chatMessages.appendChild(messageDiv);
            
            // Clear textarea
            chatTextarea.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Handle suggested responses
    const suggestedResponses = document.querySelectorAll('.chat-input span[style*="cursor: pointer"]');
    
    suggestedResponses.forEach(response => {
        response.addEventListener('click', function() {
            chatTextarea.value = this.textContent;
            chatTextarea.focus();
        });
    });
});
