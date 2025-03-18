/**
 * Système de parsing de fiche de poste
 * Permet d'analyser le contenu d'une fiche de poste et d'en extraire les informations pertinentes
 */

// Catégories d'informations à extraire d'une fiche de poste
const JOB_CATEGORIES = {
  JOB_TITLE: ['titre', 'poste', 'intitulé'],
  EXPERIENCE: ['expérience', 'années d\'expérience', 'exp', 'senior', 'junior', 'confirmé'],
  SKILLS: ['compétences', 'skills', 'tech', 'technologies', 'outils', 'langages', 'framework'],
  EDUCATION: ['formation', 'diplôme', 'études', 'diplômé', 'bac+', 'ingénieur', 'master'],
  CONTRACT: ['contrat', 'cdd', 'cdi', 'freelance', 'stage', 'alternance', 'temps', 'partiel', 'plein'],
  LOCATION: ['lieu', 'localisation', 'ville', 'site', 'adresse', 'remote', 'télétravail', 'région', 'pays'],
  SALARY: ['salaire', 'rémunération', 'k€', 'keur', 'package', 'avantages', 'benefits']
};

// Expressions régulières pour identifier certains patterns spécifiques
const REGEX_PATTERNS = {
  EXPERIENCE_YEARS: /(\d+)[\s-]*(ans?|années?|an d['']expérience|années? d['']expérience)/i,
  SALARY_RANGE: /([\d\s]+[k€KE])[^\d]+([\d\s]+[k€KE])/i,
  EDUCATION_LEVEL: /bac\s*\+\s*(\d+)/i,
  CONTRACT_TYPE: /cdi|cdd|stage|alternance|freelance|consultant|temps (plein|partiel)/i,
  REMOTE_WORK: /(full remote|télétravail|remote|à distance)(\s*\d+\s*j(ours?)?)?/i
};

/**
 * Parse une fiche de poste et extrait les informations pertinentes
 * @param {string} jobDescription - Le texte de la fiche de poste
 * @return {Object} - Un objet avec les informations extraites
 */
function parseJobDescription(jobDescription) {
  // Résultats de l'analyse
  const result = {
    jobTitle: '',
    experience: '',
    skills: [],
    education: '',
    contract: '',
    location: '',
    salary: '',
    rawText: jobDescription,
    confidence: {} // Niveau de confiance pour chaque champ extrait
  };
  
  // Diviser le texte en paragraphes et lignes
  const paragraphs = jobDescription.split(/\n\n+/);
  const lines = jobDescription.split(/\n+/);
  
  // Trouver le titre du poste (généralement dans les premières lignes ou en gras)
  result.jobTitle = extractJobTitle(paragraphs, lines);
  result.confidence.jobTitle = calculateConfidence(result.jobTitle);
  
  // Extraire l'expérience requise
  result.experience = extractExperience(jobDescription);
  result.confidence.experience = calculateConfidence(result.experience);
  
  // Extraire les compétences techniques 
  result.skills = extractSkills(jobDescription);
  result.confidence.skills = result.skills.length > 0 ? 0.8 : 0.3;
  
  // Extraire le niveau d'études
  result.education = extractEducation(jobDescription);
  result.confidence.education = calculateConfidence(result.education);
  
  // Extraire le type de contrat
  result.contract = extractContract(jobDescription);
  result.confidence.contract = calculateConfidence(result.contract);
  
  // Extraire le lieu de travail
  result.location = extractLocation(jobDescription);
  result.confidence.location = calculateConfidence(result.location);
  
  // Extraire la rémunération proposée
  result.salary = extractSalary(jobDescription);
  result.confidence.salary = calculateConfidence(result.salary);
  
  return result;
}

/**
 * Extrait le titre du poste de la fiche
 */
function extractJobTitle(paragraphs, lines) {
  // Stratégie 1: Première ligne courte qui ne commence pas par des mots courants à éviter
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 0 && line.length < 80 && 
        !line.toLowerCase().startsWith('nous ') && 
        !line.toLowerCase().startsWith('notre ') &&
        !line.toLowerCase().startsWith('recherch')) {
      return line;
    }
  }
  
  // Stratégie 2: Chercher un titre probable dans les premiers paragraphes
  for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
    const paragraph = paragraphs[i].trim();
    if (paragraph.includes(':')) {
      const parts = paragraph.split(':');
      if (parts[0].toLowerCase().includes('poste') || 
          parts[0].toLowerCase().includes('titre') || 
          parts[0].toLowerCase().includes('intitulé')) {
        return parts[1].trim();
      }
    }
  }
  
  // Stratégie 3: Première ligne non vide comme dernier recours
  for (let line of lines) {
    if (line.trim().length > 0) {
      return line.trim();
    }
  }
  
  return '';
}

/**
 * Extrait les informations d'expérience requise
 */
function extractExperience(text) {
  // Recherche d'un pattern d'années d'expérience
  const expMatch = text.match(REGEX_PATTERNS.EXPERIENCE_YEARS);
  if (expMatch) {
    return `${expMatch[1]} ${expMatch[2]}`;
  }
  
  // Recherche par mots-clés
  const lowerText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/);
  
  for (let sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (JOB_CATEGORIES.EXPERIENCE.some(keyword => lowerSentence.includes(keyword))) {
      if (lowerSentence.includes('junior')) return 'Junior';
      if (lowerSentence.includes('senior')) return 'Senior';
      if (lowerSentence.includes('confirmé')) return 'Profil confirmé';
      if (lowerSentence.includes('débutant')) return 'Débutant accepté';
      
      // Si on trouve une phrase avec le mot expérience, on la retourne
      return sentence.trim();
    }
  }
  
  return '';
}

/**
 * Extrait les compétences techniques mentionnées
 */
function extractSkills(text) {
  const skills = [];
  const lowerText = text.toLowerCase();
  
  // Liste de technologies et langages couramment recherchés
  const techKeywords = [
    'java', 'python', 'javascript', 'js', 'typescript', 'ts', 'c#', 'c++', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'symfony',
    'sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'nosql', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'devops', 'ci/cd', 'jenkins', 'git',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
    'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'machine learning', 'ml', 'ai', 'deep learning', 'nlp', 'data science',
    'linux', 'unix', 'windows', 'macos',
    'rest', 'graphql', 'api', 'soap', 'microservices'
  ];
  
  // Rechercher les technologies dans le texte
  for (let keyword of techKeywords) {
    // Recherche avec délimiteurs de mots pour éviter les faux positifs
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerText)) {
      skills.push(keyword);
    }
  }
  
  // Rechercher des listes de compétences dans le texte
  const sentences = text.split(/[.!?]+/);
  for (let sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (JOB_CATEGORIES.SKILLS.some(keyword => lowerSentence.includes(keyword))) {
      // Si on trouve une liste avec des puces ou des virgules
      const listItems = sentence.match(/[•\-*]\s*([^•\-*\n]+)/g) || [];
      for (let item of listItems) {
        const cleanItem = item.replace(/[•\-*]\s*/, '').trim();
        if (cleanItem && !skills.includes(cleanItem)) {
          skills.push(cleanItem);
        }
      }
      
      // Ajouter les éléments séparés par des virgules
      if (sentence.includes(',')) {
        const parts = sentence.split(',');
        for (let part of parts) {
          const cleanPart = part.trim();
          if (cleanPart && !skills.includes(cleanPart) && cleanPart.length < 30) {
            skills.push(cleanPart);
          }
        }
      }
    }
  }
  
  return [...new Set(skills)]; // Dédupliquer
}

/**
 * Extrait les informations de formation/éducation requise
 */
function extractEducation(text) {
  const lowerText = text.toLowerCase();
  
  // Recherche de pattern Bac+X
  const educMatch = text.match(REGEX_PATTERNS.EDUCATION_LEVEL);
  if (educMatch) {
    return `Bac+${educMatch[1]}`;
  }
  
  // Recherche par mots-clés
  const sentences = text.split(/[.!?]+/);
  for (let sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (JOB_CATEGORIES.EDUCATION.some(keyword => lowerSentence.includes(keyword))) {
      if (lowerSentence.includes('ingénieur')) return 'École d\'ingénieur';
      if (lowerSentence.includes('master')) return 'Master';
      if (lowerSentence.includes('licence')) return 'Licence';
      if (lowerSentence.includes('bts')) return 'BTS';
      if (lowerSentence.includes('dut')) return 'DUT';
      
      // Si on trouve une phrase avec le mot formation, on la retourne
      return sentence.trim();
    }
  }
  
  return '';
}

/**
 * Extrait le type de contrat proposé
 */
function extractContract(text) {
  const lowerText = text.toLowerCase();
  
  // Recherche d'un pattern de type de contrat
  const contractMatch = text.match(REGEX_PATTERNS.CONTRACT_TYPE);
  if (contractMatch) {
    const contract = contractMatch[0].toUpperCase();
    
    // Vérifier télétravail
    const remoteMatch = text.match(REGEX_PATTERNS.REMOTE_WORK);
    if (remoteMatch) {
      return `${contract} - ${remoteMatch[0]}`;
    }
    
    return contract;
  }
  
  // Recherche par mots-clés
  const sentences = text.split(/[.!?]+/);
  for (let sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (JOB_CATEGORIES.CONTRACT.some(keyword => lowerSentence.includes(keyword))) {
      return sentence.trim();
    }
  }
  
  return '';
}

/**
 * Extrait la localisation du poste
 */
function extractLocation(text) {
  const lowerText = text.toLowerCase();
  
  // Recherche par mots-clés
  const sentences = text.split(/[.!?]+/);
  for (let sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (JOB_CATEGORIES.LOCATION.some(keyword => lowerSentence.includes(keyword))) {
      // Recherche télétravail
      if (REGEX_PATTERNS.REMOTE_WORK.test(lowerSentence)) {
        const remoteMatch = lowerSentence.match(REGEX_PATTERNS.REMOTE_WORK);
        return remoteMatch[0];
      }
      
      // Sinon retourner la phrase entière
      return sentence.trim();
    }
  }
  
  return '';
}

/**
 * Extrait les informations de salaire proposé
 */
function extractSalary(text) {
  const lowerText = text.toLowerCase();
  
  // Recherche d'un pattern de fourchette de salaire
  const salaryMatch = text.match(REGEX_PATTERNS.SALARY_RANGE);
  if (salaryMatch) {
    return `${salaryMatch[1]} - ${salaryMatch[2]}`;
  }
  
  // Recherche par mots-clés
  const sentences = text.split(/[.!?]+/);
  for (let sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (JOB_CATEGORIES.SALARY.some(keyword => lowerSentence.includes(keyword))) {
      // Rechercher tout pattern qui ressemble à un salaire
      const keurosPattern = /\d+\s*[k€KE]/g;
      const matches = lowerSentence.match(keurosPattern);
      if (matches && matches.length > 0) {
        if (matches.length >= 2) {
          return `${matches[0]} - ${matches[1]}`;
        } else {
          return matches[0];
        }
      }
      
      // Sinon retourner la phrase entière
      return sentence.trim();
    }
  }
  
  return '';
}

/**
 * Calcule le niveau de confiance pour un champ extrait
 */
function calculateConfidence(value) {
  if (!value || value.trim() === '') return 0;
  if (value.length < 5) return 0.3;
  if (value.length < 15) return 0.6;
  return 0.8;
}

/**
 * Script d'intégration du parsing de fiche de poste pour le questionnaire client
 * Intègre le système de parsing directement dans le formulaire
 */
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page du questionnaire client
    if (!document.getElementById('questionnaire-form')) {
        return;
    }
    
    // Ajouter la div du système de parsing après la question "Avez-vous un poste sur lequel vous souhaitez recruter ?"
    const hasPositionRadioGroup = document.querySelector('input[name="has-position"]').closest('.form-group');
    
    // Vérifier si la div existe déjà pour éviter les doublons
    if (!document.getElementById('job-description-upload')) {
        // Créer et insérer le HTML du système de parsing
        const parserHTML = `
        <div id="job-description-upload" class="job-description-upload">
            <h3 class="form-section-subtitle">Détails du poste à pourvoir</h3>
            <p class="section-description">
                Pour nous permettre de mieux comprendre vos besoins et de vous proposer les candidats les plus pertinents, 
                vous pouvez nous communiquer les détails de votre poste.
            </p>
            
            <div class="upload-methods">
                <div class="upload-method" id="upload-file-method">
                    <i class="fas fa-file-upload"></i>
                    <h4>Importer une fiche de poste</h4>
                    <p>Déposez un fichier texte, PDF ou Word contenant votre fiche de poste</p>
                </div>
                
                <div class="upload-method" id="paste-text-method">
                    <i class="fas fa-paste"></i>
                    <h4>Coller le texte</h4>
                    <p>Copiez-collez le contenu de votre fiche de poste dans le formulaire</p>
                </div>
                
                <div class="upload-method" id="manual-entry-method">
                    <i class="fas fa-pencil-alt"></i>
                    <h4>Remplir manuellement</h4>
                    <p>Complétez directement les champs du formulaire sans analyse</p>
                </div>
            </div>
            
            <!-- Méthode : Import de fichier -->
            <div class="upload-content" id="upload-file-content">
                <div class="file-drop-area" id="file-drop-area">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Déposez votre fichier ici ou <strong>cliquez pour parcourir</strong></p>
                    <small>Formats acceptés: PDF, DOC, DOCX, TXT (max 5MB)</small>
                    <input type="file" id="job-file-input" accept=".pdf,.doc,.docx,.txt">
                    
                    <div class="file-info" id="file-info">
                        <span class="file-name" id="file-name"></span>
                        <span class="file-size" id="file-size"></span>
                        <span class="remove-file" id="remove-file"><i class="fas fa-times"></i></span>
                    </div>
                </div>
                
                <div class="textarea-actions">
                    <div></div>
                    <button type="button" id="analyze-file-btn" class="btn-generate" disabled>
                        <i class="fas fa-magic"></i> Analyser la fiche de poste
                    </button>
                </div>
            </div>
            
            <!-- Méthode : Coller le texte -->
            <div class="upload-content" id="paste-text-content">
                <div class="text-area-container">
                    <textarea id="job-description-text" class="form-control" rows="10" placeholder="Collez ici le contenu de votre fiche de poste..."></textarea>
                </div>
                
                <div class="textarea-actions">
                    <button type="button" id="clear-text-btn" class="btn-generate" style="color: #EF4444; border-color: #EF4444;">
                        <i class="fas fa-trash-alt"></i> Effacer
                    </button>
                    <button type="button" id="analyze-text-btn" class="btn-generate">
                        <i class="fas fa-magic"></i> Analyser la fiche de poste
                    </button>
                </div>
            </div>
            
            <!-- Aperçu et résultats de l'analyse -->
            <div class="job-description-preview" id="job-description-preview">
                <div class="preview-header">
                    <div class="preview-title">
                        <i class="fas fa-clipboard-check"></i> Résultats de l'analyse
                    </div>
                    <div class="preview-actions">
                        <button id="edit-analysis-btn" title="Modifier l'analyse">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button id="refresh-analysis-btn" title="Relancer l'analyse">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="preview-content">
                    <div class="preview-column">
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-jobTitle"></span>
                                Intitulé du poste
                            </div>
                            <div class="preview-item-value" id="preview-jobTitle"></div>
                        </div>
                        
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-experience"></span>
                                Expérience requise
                            </div>
                            <div class="preview-item-value" id="preview-experience"></div>
                        </div>
                        
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-education"></span>
                                Formation / Diplôme
                            </div>
                            <div class="preview-item-value" id="preview-education"></div>
                        </div>
                        
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-contract"></span>
                                Type de contrat
                            </div>
                            <div class="preview-item-value" id="preview-contract"></div>
                        </div>
                    </div>
                    
                    <div class="preview-column">
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-location"></span>
                                Localisation
                            </div>
                            <div class="preview-item-value" id="preview-location"></div>
                        </div>
                        
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-salary"></span>
                                Rémunération
                            </div>
                            <div class="preview-item-value" id="preview-salary"></div>
                        </div>
                        
                        <div class="preview-item">
                            <div class="preview-item-label">
                                <span class="confidence-indicator" id="confidence-skills"></span>
                                Compétences identifiées
                            </div>
                            <div class="preview-item-skills" id="preview-skills"></div>
                        </div>
                    </div>
                </div>
                
                <div class="apply-preview">
                    <button type="button" id="apply-analysis-btn">
                        <i class="fas fa-check"></i> Utiliser ces informations
                    </button>
                </div>
            </div>
        </div>
        `;
        
        // Insérer après le groupe radio
        hasPositionRadioGroup.insertAdjacentHTML('afterend', parserHTML);
        
        // Ajouter les styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .job-description-upload {
                display: none;
                background-color: var(--cream);
                border-radius: 8px;
                padding: var(--spacing-md);
                margin-top: var(--spacing-md);
                transition: all 0.3s ease;
                animation: fadeIn 0.5s ease forwards;
            }

            .job-description-upload.active {
                display: block;
            }
            
            .form-section-subtitle {
                font-size: 1.25rem;
                margin-bottom: var(--spacing-sm);
                font-weight: 500;
                color: var(--black);
            }
            
            .section-description {
                margin-bottom: var(--spacing-md);
                color: var(--gray);
            }

            .upload-methods {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-md);
                margin-bottom: var(--spacing-md);
            }

            .upload-method {
                flex: 1;
                min-width: 250px;
                background-color: var(--white);
                border-radius: 8px;
                padding: var(--spacing-md);
                border: 1px solid var(--cream-dark);
                transition: all 0.3s ease;
                cursor: pointer;
                text-align: center;
            }

            .upload-method:hover {
                border-color: var(--purple);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .upload-method.active {
                border-color: var(--purple);
                background-color: var(--purple-glass);
            }

            .upload-method i {
                font-size: 2rem;
                color: var(--purple);
                margin-bottom: var(--spacing-xs);
                display: block;
            }

            .upload-method h4 {
                font-weight: 500;
                margin-bottom: var(--spacing-xs);
            }

            .upload-method p {
                font-size: 0.9rem;
                color: var(--gray);
            }

            .upload-content {
                display: none;
                margin-top: var(--spacing-md);
                animation: fadeIn 0.3s ease forwards;
            }

            .upload-content.active {
                display: block;
            }

            .file-drop-area {
                border: 2px dashed var(--cream-dark);
                border-radius: 8px;
                padding: var(--spacing-lg);
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            }

            .file-drop-area:hover {
                border-color: var(--purple);
                background-color: var(--cream);
            }

            .file-drop-area.drag-over {
                border-color: var(--purple);
                background-color: var(--purple-glass);
            }

            .file-drop-area i {
                font-size: 2.5rem;
                color: var(--purple);
                margin-bottom: var(--spacing-sm);
                display: block;
            }

            .file-drop-area p {
                margin-bottom: var(--spacing-xs);
            }

            .file-drop-area input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }

            .file-drop-area .file-info {
                display: none;
                margin-top: var(--spacing-md);
                padding: var(--spacing-sm);
                background-color: var(--white);
                border-radius: 6px;
                animation: fadeIn 0.3s ease forwards;
            }

            .file-drop-area .file-info.active {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--spacing-sm);
            }

            .file-drop-area .file-name {
                font-weight: 500;
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .file-drop-area .file-size {
                color: var(--gray);
                font-size: 0.9rem;
            }

            .file-drop-area .remove-file {
                color: var(--gray);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .file-drop-area .remove-file:hover {
                color: #EF4444;
                transform: scale(1.1);
            }

            .text-area-container {
                position: relative;
            }

            .textarea-actions {
                display: flex;
                justify-content: space-between;
                margin-top: var(--spacing-xs);
            }

            .job-description-preview {
                display: none;
                margin-top: var(--spacing-lg);
                background-color: var(--white);
                border-radius: 8px;
                padding: var(--spacing-md);
                border: 1px solid var(--purple);
                animation: fadeIn 0.3s ease forwards;
            }

            .job-description-preview.active {
                display: block;
            }

            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-md);
                padding-bottom: var(--spacing-sm);
                border-bottom: 1px solid var(--cream-dark);
            }

            .preview-title {
                font-weight: 600;
                color: var(--purple);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .preview-actions button {
                background: none;
                border: none;
                color: var(--gray);
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 4px 8px;
            }

            .preview-actions button:hover {
                color: var(--purple);
            }

            .preview-content {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-md);
            }

            .preview-column {
                flex: 1;
                min-width: 280px;
            }

            .preview-item {
                margin-bottom: var(--spacing-md);
            }

            .preview-item-label {
                font-weight: 500;
                margin-bottom: 4px;
                color: var(--gray);
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .confidence-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 4px;
            }

            .confidence-high {
                background-color: #10B981;
            }

            .confidence-medium {
                background-color: #F59E0B;
            }

            .confidence-low {
                background-color: #EF4444;
            }

            .preview-item-value {
                font-size: 1rem;
                line-height: 1.4;
            }

            .preview-item-skills {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .skill-tag {
                background-color: var(--purple-glass);
                color: var(--purple);
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .apply-preview {
                text-align: right;
                margin-top: var(--spacing-md);
                padding-top: var(--spacing-sm);
                border-top: 1px solid var(--cream-dark);
            }

            .apply-preview button {
                background: linear-gradient(135deg, var(--purple) 0%, var(--purple-dark) 100%);
                color: var(--white);
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .apply-preview button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
            }

            .loading-spinner-small {
                display: inline-block;
                width: 24px;
                height: 24px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s linear infinite;
            }

            /* Ajouter des infobulles pour les niveaux de confiance */
            [data-tooltip] {
                position: relative;
                cursor: help;
            }

            [data-tooltip]:after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 130%;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--black);
                color: var(--white);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                white-space: nowrap;
                visibility: hidden;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 10;
            }

            [data-tooltip]:hover:after {
                visibility: visible;
                opacity: 1;
            }

            @media (max-width: 768px) {
                .upload-methods {
                    flex-direction: column;
                }
                
                .preview-content {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    // Éléments DOM pour le parsing
    const jobDescriptionUpload = document.getElementById('job-description-upload');
    const hasPositionRadios = document.querySelectorAll('input[name="has-position"]');
    const uploadMethods = document.querySelectorAll('.upload-method');
    const uploadContents = document.querySelectorAll('.upload-content');
    
    // Méthode d'upload de fichier
    const uploadFileMethod = document.getElementById('upload-file-method');
    const uploadFileContent = document.getElementById('upload-file-content');
    const fileDropArea = document.getElementById('file-drop-area');
    const jobFileInput = document.getElementById('job-file-input');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFile = document.getElementById('remove-file');
    const analyzeFileBtn = document.getElementById('analyze-file-btn');
    
    // Méthode de copier-coller
    const pasteTextMethod = document.getElementById('paste-text-method');
    const pasteTextContent = document.getElementById('paste-text-content');
    const jobDescriptionText = document.getElementById('job-description-text');
    const clearTextBtn = document.getElementById('clear-text-btn');
    const analyzeTextBtn = document.getElementById('analyze-text-btn');
    
    // Méthode de saisie manuelle
    const manualEntryMethod = document.getElementById('manual-entry-method');
    
    // Aperçu et résultats
    const jobDescriptionPreview = document.getElementById('job-description-preview');
    const editAnalysisBtn = document.getElementById('edit-analysis-btn');
    const refreshAnalysisBtn = document.getElementById('refresh-analysis-btn');
    const applyAnalysisBtn = document.getElementById('apply-analysis-btn');
    
    // Variables pour stocker les données
    let analysisResults = null;
    let currentFile = null;
    
    // Afficher la section d'upload si "Oui" est sélectionné
    hasPositionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                jobDescriptionUpload.classList.add('active');
            } else {
                jobDescriptionUpload.classList.remove('active');
            }
        });
        
        // Vérifier l'état initial
        if (radio.checked && radio.value === 'yes') {
            jobDescriptionUpload.classList.add('active');
        }
    });
    
    // Sélectionner une méthode d'upload
    uploadMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Retirer la classe active de toutes les méthodes
            uploadMethods.forEach(m => m.classList.remove('active'));
            // Ajouter la classe active à la méthode sélectionnée
            this.classList.add('active');
            
            // Cacher tous les contenus
            uploadContents.forEach(content => content.classList.remove('active'));
            
            // Afficher le contenu correspondant à la méthode sélectionnée
            if (this === uploadFileMethod) {
                uploadFileContent.classList.add('active');
            } else if (this === pasteTextMethod) {
                pasteTextContent.classList.add('active');
            } else if (this === manualEntryMethod) {
                // Pour la saisie manuelle, passer directement à l'étape 3
                document.getElementById('next-step2').click();
            }
            
            // Cacher l'aperçu
            jobDescriptionPreview.classList.remove('active');
        });
    });
    
    // Initialisation du drag & drop pour le fichier
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileDropArea.classList.add('drag-over');
    }
    
    function unhighlight() {
        fileDropArea.classList.remove('drag-over');
    }
    
    fileDropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    jobFileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length) {
            const file = files[0];
            
            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Le fichier est trop volumineux (max 5MB)', 'error');
                return;
            }
            
            // Vérifier le type de fichier
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
            
            if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
                showNotification('Format de fichier non supporté', 'error');
                return;
            }
            
            // Stocker le fichier
            currentFile = file;
            
            // Afficher les informations du fichier
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileInfo.classList.add('active');
            
            // Activer le bouton d'analyse
            analyzeFileBtn.disabled = false;
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' octets';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
        else return (bytes / 1048576).toFixed(1) + ' Mo';
    }
    
    // Supprimer le fichier
    removeFile.addEventListener('click', function() {
        jobFileInput.value = '';
        fileInfo.classList.remove('active');
        analyzeFileBtn.disabled = true;
        currentFile = null;
    });
    
    // Effacer le texte collé
    clearTextBtn.addEventListener('click', function() {
        jobDescriptionText.value = '';
        jobDescriptionText.focus();
    });
    
    // Analyser le fichier
    analyzeFileBtn.addEventListener('click', function() {
        if (!currentFile) {
            showNotification('Veuillez d\'abord sélectionner un fichier', 'error');
            return;
        }
        
        // Changer l'état du bouton pour indiquer le chargement
        const originalContent = this.innerHTML;
        this.innerHTML = '<span class="loading-spinner-small"></span> Analyse en cours...';
        this.disabled = true;
        
        // Simuler l'analyse pour cette démo
        setTimeout(() => {
            // Dans un environnement réel, on aurait une requête au serveur pour traiter le fichier
            // et utiliser la fonction parseJobDescription sur le contenu extrait
            
            // Simuler un résultat d'analyse basé sur le nom du fichier
            const jobTitle = currentFile.name.replace(/\.[^/.]+$/, "").replace(/-|_/g, " ");
            
            analysisResults = {
                jobTitle: capitalizeFirstLetter(jobTitle),
                experience: '3-5 ans d\'expérience',
                skills: ['JavaScript', 'HTML', 'CSS', 'React', 'Node.js', 'Git'],
                education: 'Bac+5 Informatique ou équivalent',
                contract: 'CDI',
                location: 'Paris, France (Télétravail partiel)',
                salary: '45K€ - 60K€ selon expérience',
                rawText: "Contenu simulé de la fiche de poste",
                confidence: {
                    jobTitle: 0.8,
                    experience: 0.7,
                    skills: 0.9,
                    education: 0.6,
                    contract: 0.8,
                    location: 0.7,
                    salary: 0.6
                }
            };
            
            // Afficher les résultats
            displayAnalysisResults(analysisResults);
            
            // Restaurer l'état du bouton
            this.innerHTML = originalContent;
            this.disabled = false;
            
            showNotification('Analyse du fichier terminée avec succès', 'success');
        }, 1500);
    });
    
    // Analyser le texte collé
    analyzeTextBtn.addEventListener('click', function() {
        const text = jobDescriptionText.value.trim();
        
        if (!text) {
            showNotification('Veuillez d\'abord coller votre fiche de poste', 'error');
            return;
        }
        
        // Changer l'état du bouton pour indiquer le chargement
        const originalContent = this.innerHTML;
        this.innerHTML = '<span class="loading-spinner-small"></span> Analyse en cours...';
        this.disabled = true;
        
        // Utiliser la fonction de parsing
        setTimeout(() => {
            try {
                // Appeler la fonction de parsing
                analysisResults = parseJobDescription(text);
                
                // Afficher les résultats
                displayAnalysisResults(analysisResults);
                
                showNotification('Analyse du texte terminée avec succès', 'success');
            } catch (error) {
                console.error('Erreur lors de l\'analyse:', error);
                showNotification('Erreur lors de l\'analyse de la fiche de poste', 'error');
            }
            
            // Restaurer l'état du bouton
            this.innerHTML = originalContent;
            this.disabled = false;
        }, 1000);
    });
    
    // Fonction pour afficher les résultats de l'analyse
    function displayAnalysisResults(results) {
        // Mettre à jour les valeurs dans l'aperçu
        document.getElementById('preview-jobTitle').textContent = results.jobTitle || 'Non spécifié';
        document.getElementById('preview-experience').textContent = results.experience || 'Non spécifié';
        document.getElementById('preview-education').textContent = results.education || 'Non spécifié';
        document.getElementById('preview-contract').textContent = results.contract || 'Non spécifié';
        document.getElementById('preview-location').textContent = results.location || 'Non spécifié';
        document.getElementById('preview-salary').textContent = results.salary || 'Non spécifié';
        
        // Afficher les compétences sous forme de tags
        const skillsContainer = document.getElementById('preview-skills');
        skillsContainer.innerHTML = '';
        
        if (results.skills && results.skills.length > 0) {
            results.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skillsContainer.appendChild(skillTag);
            });
        } else {
            skillsContainer.textContent = 'Aucune compétence identifiée';
        }
        
        // Mettre à jour les indicateurs de confiance
        Object.keys(results.confidence).forEach(key => {
            const confidenceElement = document.getElementById(`confidence-${key}`);
            if (confidenceElement) {
                const confidenceValue = results.confidence[key];
                let confidenceClass = 'confidence-low';
                let tooltipText = 'Confiance faible';
                
                if (confidenceValue >= 0.7) {
                    confidenceClass = 'confidence-high';
                    tooltipText = 'Confiance élevée';
                } else if (confidenceValue >= 0.4) {
                    confidenceClass = 'confidence-medium';
                    tooltipText = 'Confiance moyenne';
                }
                
                confidenceElement.className = `confidence-indicator ${confidenceClass}`;
                confidenceElement.parentElement.setAttribute('data-tooltip', tooltipText);
            }
        });
        
        // Afficher l'aperçu
        jobDescriptionPreview.classList.add('active');
    }
    
    // Éditer l'analyse
    editAnalysisBtn.addEventListener('click', function() {
        // Pour le moment, cela ouvre simplement l'étape 3 du formulaire
        document.getElementById('next-step2').click();
    });
    
    // Rafraîchir l'analyse
    refreshAnalysisBtn.addEventListener('click', function() {
        if (uploadFileMethod.classList.contains('active')) {
            analyzeFileBtn.click();
        } else if (pasteTextMethod.classList.contains('active')) {
            analyzeTextBtn.click();
        }
    });
    
    // Utiliser les résultats de l'analyse
    applyAnalysisBtn.addEventListener('click', function() {
        if (!analysisResults) {
            showNotification('Aucune analyse disponible', 'error');
            return;
        }
        
        // Passer à l'étape 3
        document.getElementById('next-step2').click();
        
        // Remplir les champs correspondants
        setTimeout(() => {
            // Titre du poste - à adapter selon votre formulaire
            if (document.getElementById('team-composition')) {
                document.getElementById('team-composition').value = `Pour le poste de ${analysisResults.jobTitle}`;
            }
            
            // Expérience requise
            if (document.getElementById('required-experience')) {
                const expSelect = document.getElementById('required-experience');
                const expValue = analysisResults.experience.toLowerCase();
                
                if (expValue.includes('junior') || expValue.includes('débutant')) {
                    selectOptionByValue(expSelect, 'junior');
                } else if (expValue.includes('2') || expValue.includes('3')) {
                    selectOptionByValue(expSelect, '2-3years');
                } else if ((expValue.includes('5') || expValue.includes('10')) && 
                          !expValue.includes('15')) {
                    selectOptionByValue(expSelect, '5-10years');
                } else if (expValue.includes('10+') || expValue.includes('15') || 
                          expValue.includes('senior')) {
                    selectOptionByValue(expSelect, '10+years');
                }
            }
            
            // Rémunération
            if (document.getElementById('compensation')) {
                document.getElementById('compensation').value = analysisResults.salary;
            }
            
            // Type de contrat
            if (document.getElementById('contract-type')) {
                document.getElementById('contract-type').value = analysisResults.contract;
            }
            
            // Avantages - on peut y mettre les compétences requises
            if (document.getElementById('benefits') && analysisResults.skills.length > 0) {
                document.getElementById('benefits').value = `Compétences requises : ${analysisResults.skills.join(', ')}`;
            }
            
            showNotification('Les informations ont été appliquées au formulaire', 'success');
        }, 300);
    });
    
    // Fonction utilitaire pour sélectionner une option dans un select
    function selectOptionByValue(selectElement, value) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === value) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    }
    
    // Fonction utilitaire pour capitaliser la première lettre
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Surcharger la fonction de notification existante ou en créer une nouvelle
    function showNotification(message, type = 'success') {
        // Vérifier si la fonction showNotification existe déjà
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Créer une notification si la fonction n'existe pas
            const notification = document.getElementById('notification');
            const notificationMessage = notification.querySelector('.notification-message');
            
            notification.className = 'notification ' + type;
            notificationMessage.innerText = message;
            
            const icon = notification.querySelector('i:first-child');
            icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }
    }
});
