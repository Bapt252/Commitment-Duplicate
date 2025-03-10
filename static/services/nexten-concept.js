/**
 * Nexten Concept - Module JavaScript pour illustrer le concept 
 * des "10 connexions stratégiques" de Nexten
 */

class NextenConcept {
  constructor() {
    this.initialized = false;
    this.init();
  }

  /**
   * Initialise les fonctionnalités du concept Nexten
   */
  init() {
    if (this.initialized) return;
    
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupConcept());
    } else {
      this.setupConcept();
    }
    
    this.initialized = true;
  }

  /**
   * Configure les éléments visuels et interactifs du concept
   */
  setupConcept() {
    this.createConnectionsSection();
    this.setupConnectionDots();
    this.setupCircuitAnimation();
    this.setupTenCounters();
  }

  /**
   * Crée la section des 10 connexions stratégiques si elle n'existe pas déjà
   */
  createConnectionsSection() {
    // Vérifier si la section existe déjà
    if (document.querySelector('.ten-strategy-section')) return;
    
    // Trouver la section à laquelle ajouter notre nouvelle section
    const targetSection = document.querySelector('.features, .user-types');
    if (!targetSection) return;
    
    // Créer la section des 10 connexions
    const tenSection = document.createElement('section');
    tenSection.className = 'ten-strategy-section';
    
    tenSection.innerHTML = `
      <div class="container">
        <div class="ten-strategy-content">
          <h2 class="section-title">Les <span class="ten-accent">10</span> connexions stratégiques</h2>
          <p class="section-subtitle">
            Notre approche unique repose sur 10 connexions stratégiques entre candidats et recruteurs,
            offrant une expérience de recrutement plus efficace et personnalisée.
          </p>
          
          <div class="ten-badges">
            <span class="ten-badge"><i class="fas fa-bolt"></i> 10x plus rapide</span>
            <span class="ten-badge"><i class="fas fa-bullseye"></i> 10x plus précis</span>
            <span class="ten-badge"><i class="fas fa-handshake"></i> 10x plus humain</span>
          </div>
          
          <div class="ten-connections">
            <div class="connection-item">
              <h3>Analyse intelligente des profils</h3>
              <p>Notre IA analyse en profondeur les compétences techniques et molles pour assurer un matching précis.</p>
            </div>
            
            <div class="connection-item">
              <h3>Matching contextuel</h3>
              <p>Au-delà des mots-clés, nous comprenons le contexte et l'environnement de travail idéal.</p>
            </div>
            
            <div class="connection-item">
              <h3>Évaluation des aspirations</h3>
              <p>Nous prenons en compte les aspirations professionnelles pour des connexions durables.</p>
            </div>
            
            <div class="connection-item">
              <h3>Culture d'entreprise</h3>
              <p>La compatibilité culturelle est essentielle pour une intégration réussie et pérenne.</p>
            </div>
            
            <div class="connection-item">
              <h3>Connexion directe</h3>
              <p>Facilitez la prise de contact entre les parties les plus compatibles sans intermédiaire.</p>
            </div>
            
            <div class="connection-item">
              <h3>Retour d'expérience</h3>
              <p>L'apprentissage continu de notre algorithme permet d'améliorer constamment les matchings.</p>
            </div>
            
            <div class="connection-item">
              <h3>Confidentialité sécurisée</h3>
              <p>Protégez vos données sensibles tout en permettant des connexions pertinentes.</p>
            </div>
            
            <div class="connection-item">
              <h3>Accompagnement personnalisé</h3>
              <p>Un accompagnement adapté à chaque étape du processus de recrutement.</p>
            </div>
            
            <div class="connection-item">
              <h3>Intégration simplifiée</h3>
              <p>Un parcours fluide de la candidature à l'intégration dans l'entreprise.</p>
            </div>
            
            <div class="connection-item">
              <h3>Évolution continue</h3>
              <p>Suivi de la progression et adaptation aux nouveaux besoins des deux parties.</p>
            </div>
          </div>
          
          <div class="connection-circuit" id="connection-circuit">
            <!-- Les nœuds et connexions seront générés par JavaScript -->
          </div>
        </div>
      </div>
    `;
    
    // Insérer après la section cible
    targetSection.parentNode.insertBefore(tenSection, targetSection.nextSibling);
  }

  /**
   * Configure l'animation des points de connexion
   */
  setupConnectionDots() {
    const dots = document.querySelectorAll('.connection-dot');
    
    if (dots.length === 0) return;
    
    dots.forEach((dot, index) => {
      // Animer les points avec un délai progressif
      dot.style.animationDelay = `${index * 0.2}s`;
    });
  }

  /**
   * Crée et anime le circuit de connexion
   */
  setupCircuitAnimation() {
    const circuitContainer = document.getElementById('connection-circuit');
    if (!circuitContainer) return;
    
    // Vider le conteneur
    circuitContainer.innerHTML = '';
    
    // Créer 10 nœuds
    const nodeCount = 10;
    const nodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'circuit-node';
      
      // Positionner les nœuds de manière aléatoire mais harmonieuse
      const x = (i % 5) * 20 + Math.random() * 10;
      const y = Math.floor(i / 5) * 50 + Math.random() * 20;
      
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      
      circuitContainer.appendChild(node);
      nodes.push(node);
    }
    
    // Créer des connexions entre les nœuds
    for (let i = 0; i < nodes.length - 1; i++) {
      this.createConnection(circuitContainer, nodes[i], nodes[i + 1]);
    }
    
    // Ajouter quelques connexions supplémentaires pour créer un réseau
    for (let i = 0; i < 5; i++) {
      const nodeA = nodes[Math.floor(Math.random() * nodes.length)];
      const nodeB = nodes[Math.floor(Math.random() * nodes.length)];
      
      if (nodeA !== nodeB) {
        this.createConnection(circuitContainer, nodeA, nodeB);
      }
    }
    
    // Ajouter des pulsations animées
    this.addCircuitPulses(circuitContainer, nodes);
  }

  /**
   * Crée une connexion entre deux nœuds
   */
  createConnection(container, nodeA, nodeB) {
    // Récupérer les positions des nœuds
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    
    const containerRect = container.getBoundingClientRect();
    
    const startX = rectA.left - containerRect.left + rectA.width / 2;
    const startY = rectA.top - containerRect.top + rectA.height / 2;
    const endX = rectB.left - containerRect.left + rectB.width / 2;
    const endY = rectB.top - containerRect.top + rectB.height / 2;
    
    // Calculer la longueur et l'angle de la connexion
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    
    // Créer la ligne de connexion
    const line = document.createElement('div');
    line.className = 'circuit-line';
    
    line.style.width = `${length}px`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(line);
  }

  /**
   * Ajoute des pulsations animées sur le circuit
   */
  addCircuitPulses(container, nodes) {
    // Ajouter quelques pulsations à intervalles réguliers
    setInterval(() => {
      // Choisir un nœud de départ aléatoire
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      const rect = startNode.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Créer une pulsation
      const pulse = document.createElement('div');
      pulse.className = 'circuit-pulse';
      
      pulse.style.left = `${rect.left - containerRect.left + rect.width / 2 - 5}px`;
      pulse.style.top = `${rect.top - containerRect.top + rect.height / 2 - 5}px`;
      
      container.appendChild(pulse);
      
      // Supprimer la pulsation après l'animation
      setTimeout(() => {
        pulse.remove();
      }, 3000);
    }, 2000);
  }

  /**
   * Configure les compteurs animés pour le concept des "10"
   */
  setupTenCounters() {
    const tenAccents = document.querySelectorAll('.ten-accent');
    
    if (tenAccents.length === 0) return;
    
    tenAccents.forEach(accent => {
      // Animation de comptage de 1 à 10
      let count = 0;
      const interval = setInterval(() => {
        count++;
        accent.textContent = count;
        
        if (count >= 10) {
          clearInterval(interval);
        }
      }, 150);
    });
  }
}

// Créer l'instance du concept Nexten
const nextenConcept = new NextenConcept();
