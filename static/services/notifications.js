/**
 * Module de gestion des notifications pour améliorer l'UX
 */

class NotificationService {
  constructor() {
    this.init();
  }

  /**
   * Initialise le service de notifications
   */
  init() {
    // Créer le conteneur de notifications s'il n'existe pas déjà
    if (!document.querySelector('.toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }

  /**
   * Affiche une notification de succès
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {number} duration - Durée d'affichage en ms (défaut: 5000ms)
   */
  success(title, message, duration = 5000) {
    this.showNotification(title, message, 'success', 'check-circle', duration);
  }

  /**
   * Affiche une notification d'erreur
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {number} duration - Durée d'affichage en ms (défaut: 5000ms)
   */
  error(title, message, duration = 5000) {
    this.showNotification(title, message, 'error', 'times-circle', duration);
  }

  /**
   * Affiche une notification d'avertissement
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {number} duration - Durée d'affichage en ms (défaut: 5000ms)
   */
  warning(title, message, duration = 5000) {
    this.showNotification(title, message, 'warning', 'exclamation-triangle', duration);
  }

  /**
   * Affiche une notification d'information
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {number} duration - Durée d'affichage en ms (défaut: 5000ms)
   */
  info(title, message, duration = 5000) {
    this.showNotification(title, message, 'info', 'info-circle', duration);
  }

  /**
   * Méthode générique pour afficher une notification
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {string} type - Type de notification (success, error, warning, info)
   * @param {string} icon - Icône FontAwesome
   * @param {number} duration - Durée d'affichage en ms
   */
  showNotification(title, message, type, icon, duration) {
    const toastContainer = document.querySelector('.toast-container');
    
    // Créer l'élément de notification
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Fermer">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Ajouter au conteneur
    toastContainer.appendChild(toast);
    
    // Animation d'entrée avec retard pour que l'animation fonctionne
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Gérer la fermeture
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      this.closeToast(toast);
    });
    
    // Fermeture automatique après la durée spécifiée
    setTimeout(() => {
      this.closeToast(toast);
    }, duration);
  }

  /**
   * Ferme une notification avec animation
   * @param {HTMLElement} toast - Élément de notification à fermer
   */
  closeToast(toast) {
    // Animation de sortie
    toast.style.transform = 'translateX(150%)';
    
    // Supprimer après l'animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * Affiche un dialogue de confirmation
   * @param {string} title - Titre du dialogue
   * @param {string} message - Message du dialogue
   * @param {function} onConfirm - Fonction à exécuter si confirmé
   * @param {function} onCancel - Fonction à exécuter si annulé
   */
  confirm(title, message, onConfirm, onCancel) {
    // Créer le fond modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal';
    modalOverlay.style.display = 'flex';
    
    // Créer le contenu du dialogue
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '400px';
    modalContent.innerHTML = `
      <div style="padding: 2rem;">
        <h3 style="margin-top: 0; color: var(--dark);">${title}</h3>
        <p style="margin-bottom: 2rem;">${message}</p>
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button class="btn btn-secondary cancel-btn">Annuler</button>
          <button class="btn confirm-btn">Confirmer</button>
        </div>
      </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Animer l'entrée
    setTimeout(() => {
      modalOverlay.classList.add('show');
    }, 10);
    
    // Gérer les boutons
    const confirmBtn = modalContent.querySelector('.confirm-btn');
    const cancelBtn = modalContent.querySelector('.cancel-btn');
    
    // Fonction de fermeture
    const closeModal = () => {
      modalOverlay.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
      }, 300);
    };
    
    // Événements des boutons
    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    });
    
    cancelBtn.addEventListener('click', () => {
      closeModal();
      if (typeof onCancel === 'function') {
        onCancel();
      }
    });
    
    // Fermer en cliquant en dehors
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }
    });
  }
}

// Créer une instance globale du service de notifications
const notifications = new NotificationService();

// Exemple d'utilisation:
// notifications.success('Succès', 'L\'opération a été effectuée avec succès.');
// notifications.error('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
// notifications.warning('Attention', 'Votre session va expirer dans 5 minutes.');
// notifications.info('Information', 'Nouvelle mise à jour disponible.');
// notifications.confirm('Confirmation', 'Êtes-vous sûr de vouloir supprimer cet élément ?', 
//   () => console.log('Confirmé'), 
//   () => console.log('Annulé')
// );
