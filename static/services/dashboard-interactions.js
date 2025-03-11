// Dashboard Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Navigation between sections
    initializeNavigation();
    
    // Filter buttons
    initializeFilterButtons();
    
    // Card actions
    initializeCardActions();
    
    // Mobile menu
    initializeMobileMenu();
    
    // Message suggestions
    initializeMessageSuggestions();
});

function initializeNavigation() {
    // Dashboard cards navigation
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
        });
    });
    
    // Back buttons
    const backButtons = document.querySelectorAll('.section-back');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const returnTo = this.getAttribute('data-return');
            showSection(returnTo);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.dashboard-section, #dashboard-menu');
    allSections.forEach(section => {
        section.classList.remove('section-active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('section-active');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function initializeFilterButtons() {
    const filterGroups = document.querySelectorAll('.messaging-filters, div:has(.filter-button)');
    
    filterGroups.forEach(group => {
        const filterButtons = group.querySelectorAll('.filter-button');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons in this group
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // TODO: Implement actual filtering logic here
                console.log('Filtering by:', this.textContent.trim());
            });
        });
    });
}

function initializeCardActions() {
    // Accept/Reject buttons
    const acceptButtons = document.querySelectorAll('.btn-circle.accept');
    const rejectButtons = document.querySelectorAll('.btn-circle.reject');
    
    acceptButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const card = this.closest('.offer-card');
            
            // Animation for accept
            card.style.borderTopColor = 'var(--success)';
            setTimeout(() => {
                card.style.transform = 'translateX(100%)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 500);
            }, 300);
            
            // TODO: Send acceptance to backend
            console.log('Offer accepted');
        });
    });
    
    rejectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const card = this.closest('.offer-card');
            
            // Animation for reject
            card.style.borderTopColor = 'var(--danger)';
            setTimeout(() => {
                card.style.transform = 'translateX(-100%)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 500);
            }, 300);
            
            // TODO: Send rejection to backend
            console.log('Offer rejected');
        });
    });
    
    // Conversation selection
    const conversationItems = document.querySelectorAll('.conversation-item');
    
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all conversation items
            conversationItems.forEach(convo => {
                convo.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // TODO: Load conversation content
            console.log('Loading conversation:', this.querySelector('.conversation-name').textContent);
        });
    });
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

function initializeMessageSuggestions() {
    // Message suggestion functionality
    const suggestionItems = document.querySelectorAll('[style*="padding: 6px 12px; background-color: white; border-radius: 20px;"]');
    const messageTextarea = document.querySelector('.chat-input textarea');
    
    suggestionItems.forEach(item => {
        item.addEventListener('click', function() {
            // Insert suggestion text into textarea
            if (messageTextarea) {
                messageTextarea.value = this.textContent;
                messageTextarea.focus();
            }
        });
    });
    
    // Send button functionality
    const sendButton = document.querySelector('.send-button');
    
    if (sendButton && messageTextarea) {
        sendButton.addEventListener('click', function() {
            const messageText = messageTextarea.value.trim();
            
            if (messageText) {
                // Create and append new message
                const chatMessages = document.querySelector('.chat-messages');
                
                if (chatMessages) {
                    const now = new Date();
                    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                    
                    const messageHTML = `
                        <div class="message sent">
                            <div class="message-bubble">
                                <p>${messageText}</p>
                            </div>
                            <div class="message-time">Aujourd'hui, ${timeString}</div>
                        </div>
                    `;
                    
                    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
                    
                    // Clear textarea
                    messageTextarea.value = '';
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        });
        
        // Allow Enter key to send message
        messageTextarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    }
}
