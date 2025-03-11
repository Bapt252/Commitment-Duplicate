document.addEventListener('DOMContentLoaded', function() {
    // Toggle language details visibility
    const languageRadios = document.querySelectorAll('input[name="language"]');
    const languageDetails = document.querySelector('.language-details');
    
    if (languageRadios && languageDetails) {
        languageRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'OUI') {
                    languageDetails.classList.remove('d-none');
                } else {
                    languageDetails.classList.add('d-none');
                }
            });
        });
    }
    
    // Conversation list click handling
    const conversationItems = document.querySelectorAll('.conversation-item');
    
    if (conversationItems) {
        conversationItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                conversationItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // In a real application, you would load the conversation here
            });
        });
    }
    
    // Job description expansion (simulate expanding on click)
    const jobDescriptions = document.querySelectorAll('.job-description');
    
    if (jobDescriptions) {
        jobDescriptions.forEach(desc => {
            desc.addEventListener('click', function() {
                this.style.maxHeight = this.style.maxHeight ? null : '200px';
            });
        });
    }
    
    // Simulate message sending
    const chatForm = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');
    const messageInput = document.querySelector('.chat-input textarea');
    const sendButton = document.querySelector('.chat-input button');
    
    if (chatForm && messageInput && sendButton && chatMessages) {
        sendButton.addEventListener('click', function() {
            const messageText = messageInput.value.trim();
            
            if (messageText) {
                // Create new message element
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message candidate';
                
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'message-bubble';
                
                const messageP = document.createElement('p');
                messageP.textContent = messageText;
                
                bubbleDiv.appendChild(messageP);
                messageDiv.appendChild(bubbleDiv);
                
                // Add to chat
                chatMessages.appendChild(messageDiv);
                
                // Clear input
                messageInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
});
