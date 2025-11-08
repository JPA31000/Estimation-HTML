// --- CONSTANTES ---
const PROJECT_TYPES_CONFIG = {
  maison: {
    label: "Maison Individuelle",
    icon: "🏠",
    details: {
      styleArchitectural: "Traditionnel",
      typeConstruction: "Traditionnelle (parpaing/brique)",
      niveauFinition: "Standard",
      performanceEnergetique: "RE 2020",
      amenagementsExterieurs: "Aucun",
    },
    options: {
      styleArchitectural: ["Traditionnel", "Contemporain", "Plain-pied", "À étages"],
      typeConstruction: ["Traditionnelle (parpaing/brique)", "Ossature bois", "Monomur"],
      niveauFinition: ["Standard", "Haut de gamme", "Luxe"],
      performanceEnergetique: ["RT 2012", "RE 2020", "Passif/Bioclimatique"],
      amenagementsExterieurs: ["Aucun", "Terrasse simple", "Terrasse + Piscine"],
    }
  },
  erp: {
    label: "ERP (Public)",
    icon: "🏢",
    details: {
      categorieERP: "5ème catégorie",
      complexiteSecuriteIncendie: "Standard",
      niveauAccessibilitePMR: "Standard",
      typeEtablissement: "Bureaux",
    },
     options: {
      categorieERP: ["5ème catégorie", "4ème catégorie", "3ème catégorie", "2ème catégorie", "1ère catégorie"],
      complexiteSecuriteIncendie: ["Standard", "Élevée (désenfumage, compartimentage)"],
      niveauAccessibilitePMR: ["Standard", "Complexe (plusieurs ascenseurs, rampes)"],
      typeEtablissement: [
        "Bureaux",
        "Magasin / Centre Commercial (Type M)",
        "Établissement d'Éducation",
        "Hôtel / Locaux à sommeil (Type O)",
        "Établissement Sportif / Salle de Spectacle (Type X/L)",
        "Établissement de Soins (Type U)",
      ],
    }
  },
  logement: {
    label: "Immeuble de Logement",
    icon: "🏗️",
    details: {
      nombreNiveaux: "R+1 à R+3",
      parking: "Aucun/Extérieur",
      standingPartiesCommunes: "Standard",
      mixiteUsage: "Non (100% logement)",
    },
    options: {
      nombreNiveaux: ["R+1 à R+3", "R+4 à R+7", "R+8 et plus"],
      parking: ["Aucun/Extérieur", "Souterrain - 1 niveau", "Souterrain - plusieurs niveaux"],
      standingPartiesCommunes: ["Standard", "Haut de gamme", "Luxe"],
      mixiteUsage: ["Non (100% logement)", "Oui (commerces en RDC)"],
    }
  },
};

const DETAILS_WEIGHTING_MAP = {
  styleArchitectural: { "Traditionnel": 0, "Contemporain": 12, "Plain-pied": 5, "À étages": 0 },
  typeConstruction: { "Traditionnelle (parpaing/brique)": 0, "Ossature bois": 8, "Monomur": 10 },
  niveauFinition: { "Standard": 0, "Haut de gamme": 20, "Luxe": 45 },
  performanceEnergetique: { "RT 2012": -5, "RE 2020": 0, "Passif/Bioclimatique": 15 },
  amenagementsExterieurs: { "Aucun": 0, "Terrasse simple": 3, "Terrasse + Piscine": 10 },
  categorieERP: { "5ème catégorie": 0, "4ème catégorie": 5, "3ème catégorie": 12, "2ème catégorie": 20, "1ère catégorie": 30 },
  complexiteSecuriteIncendie: { "Standard": 0, "Élevée (désenfumage, compartimentage)": 25 },
  niveauAccessibilitePMR: { "Standard": 0, "Complexe (plusieurs ascenseurs, rampes)": 18 },
  typeEtablissement: { "Bureaux": 0, "Magasin / Centre Commercial (Type M)": 15, "Établissement d'Éducation": 10, "Hôtel / Locaux à sommeil (Type O)": 30, "Établissement Sportif / Salle de Spectacle (Type X/L)": 50, "Établissement de Soins (Type U)": 60, },
  nombreNiveaux: { "R+1 à R+3": 0, "R+4 à R+7": 15, "R+8 et plus": 35 },
  parking: { "Aucun/Extérieur": 0, "Souterrain - 1 niveau": 25, "Souterrain - plusieurs niveaux": 40 },
  standingPartiesCommunes: { "Standard": 0, "Haut de gamme": 10, "Luxe": 25 },
  mixiteUsage: { "Non (100% logement)": 0, "Oui (commerces en RDC)": 8 },
};

const INITIAL_CONTEXT_CRITERIA = [
  { id: 'natureSol', label: 'Nature du Sol', options: ['Standard', 'Argileux', 'Rocheux', 'Remblais'], selected: 'Standard', weighting: 0 },
  { id: 'difficulteTerrain', label: 'Difficulté du Terrain', options: ['Plat', 'Pente faible', 'Pente forte', 'Exigu'], selected: 'Plat', weighting: 0 },
  { id: 'situationChantier', label: 'Situation du Chantier', options: ['Accès facile', 'Milieu urbain', 'Milieu urbain dense', 'Site isolé'], selected: 'Accès facile', weighting: 0 },
  { id: 'complexiteArchitecturale', label: 'Complexité Architecturale Générale', options: ['Simple', 'Moyenne', 'Complexe'], selected: 'Simple', weighting: 0 },
];

const WEIGHTING_MAP = {
  natureSol: { 'Standard': 0, 'Argileux': 8, 'Rocheux': 15, 'Remblais': 12 },
  difficulteTerrain: { 'Plat': 0, 'Pente faible': 5, 'Pente forte': 15, 'Exigu': 10 },
  situationChantier: { 'Accès facile': 0, 'Milieu urbain': 7, 'Milieu urbain dense': 18, 'Site isolé': 5 },
  complexiteArchitecturale: { 'Simple': 0, 'Moyenne': 10, 'Complexe': 25 },
};

const WORK_PACKAGES_DISTRIBUTION = {
  maison: { 'Gros Œuvre (Fondations, Structure, Murs, Toiture)': 0.45, 'Second Œuvre (Isolation, Menuiseries, Plâtrerie)': 0.30, 'Lots Techniques (Plomberie, Électricité, CVC)': 0.20, 'Finitions (Revêtements, Peintures)': 0.05, },
  erp: { 'Gros Œuvre (Fondations, Structure, Murs, Toiture)': 0.55, 'Second Œuvre (Isolation, Menuiseries, Plâtrerie)': 0.25, 'Lots Techniques (Plomberie, Électricité, CVC)': 0.15, 'Finitions (Revêtements, Peintures)': 0.05, },
  logement: { 'Gros Œuvre (Fondations, Structure, Murs, Toiture)': 0.55, 'Second Œuvre (Isolation, Menuiseries, Plâtrerie)': 0.25, 'Lots Techniques (Plomberie, Électricité, CVC)': 0.15, 'Finitions (Revêtements, Peintures)': 0.05, }
};

const CRITERIA_EXPLANATIONS = {
  styleArchitectural: { "Contemporain": "Implique souvent des formes complexes, de grandes ouvertures vitrées et des matériaux spécifiques (bardage, béton brut) qui augmentent les coûts de mise en œuvre.", "Plain-pied": "Nécessite plus de surface de fondations et de toiture pour une même surface habitable, augmentant le coût du gros œuvre.", },
  typeConstruction: { "Ossature bois": "Matériau plus cher à l'achat mais plus rapide à monter. Le coût est impacté par la nécessité d'une main d'œuvre spécialisée.", "Monomur": "Brique technique plus onéreuse que le parpaing, demandant une mise en œuvre très précise pour garantir ses performances thermiques.", },
  niveauFinition: { "Haut de gamme": "Utilisation de matériaux nobles (parquet massif, pierre naturelle), menuiseries sur-mesure, équipements sanitaires et électriques de marques supérieures.", "Luxe": "Prestations exceptionnelles : domotique avancée, matériaux rares, équipements de luxe (piscine intérieure, spa), intervention d'artisans d'art.", },
  performanceEnergetique: { "RT 2012": "Standard de construction moins exigeant, permettant une isolation et des systèmes moins performants et donc moins chers (économies à court terme, mais coûts d'exploitation plus élevés).", "Passif/Bioclimatique": "Exige une conception très poussée, une isolation et une étanchéité à l'air parfaites, des menuiseries triple vitrage et une VMC double flux à haut rendement. Surcoût important à l'investissement.", },
  amenagementsExterieurs: { "Terrasse simple": "Coût lié à la surface et au matériau (bois, composite, carrelage sur dalle béton).", "Terrasse + Piscine": "Poste très coûteux incluant terrassement, structure béton, étanchéité, filtration, et local technique. Impacte fortement le budget global.", },
  categorieERP: {
    "4ème catégorie": "Contraintes de sécurité incendie plus élevées que la 5ème cat., notamment sur les issues de secours et le désenfumage.",
    "3ème catégorie": "Exigences accrues sur la stabilité au feu de la structure et les systèmes d'alarme incendie.",
    "2ème catégorie": "Systèmes de sécurité complexes (SSI de catégorie A), compartimentage, et souvent deux escaliers encloisonnés.",
    "1ère catégorie": "Contraintes réglementaires maximales : multiples escaliers, désenfumage complexe, redondance des systèmes de sécurité, impactant tous les lots techniques.",
  },
  complexiteSecuriteIncendie: {
    "Élevée (désenfumage, compartimentage)": "Installation de volets et conduits de désenfumage, portes coupe-feu, murs et planchers à haute résistance au feu. Coût élevé en équipement et main d'œuvre.",
  },
  niveauAccessibilitePMR: {
    "Complexe (plusieurs ascenseurs, rampes)": "Installation d'ascenseurs supplémentaires, création de rampes d'accès avec des pentes réglementaires, sanitaires adaptés plus nombreux. Augmente la surface construite et le coût des équipements.",
  },
  typeEtablissement: {
    "Magasin / Centre Commercial (Type M)": "Impact de la sécurité incendie (sprinklage), de la structure pour les atriums et trémies, et des façades avec grandes vitrines.",
    "Établissement d'Éducation": "Nécessite une forte isolation acoustique entre les salles, des préaux, et des équipements spécifiques. Salles de sciences et ateliers techniques sont coûteux.",
    "Hôtel / Locaux à sommeil (Type O)": "Exigences de sécurité incendie draconiennes dues aux locaux à sommeil (détection, alarme par chambre, désenfumage) et forte isolation acoustique entre chambres.",
    "Établissement Sportif / Salle de Spectacle (Type X/L)": "Contraintes structurelles majeures (grandes portées, hauteurs), traitement acoustique poussé et gestion CVC de grands volumes. Coût élevé sur le gros œuvre et les lots techniques.",
    "Établissement de Soins (Type U)": "Complexité technique très élevée: réseaux de fluides médicaux, traitement d'air spécifique, sécurité incendie adaptée aux personnes alitées. Un des types d'ERP les plus coûteux au m².",
  },
  nombreNiveaux: {
    "R+4 à R+7": "Nécessite généralement un ascenseur, une structure plus robuste, et des équipements de sécurité incendie plus complexes (colonnes sèches).",
    "R+8 et plus": "Bâtiment de grande hauteur (IGH) ou proche, avec des contraintes structurelles (contreventement), de sécurité (escaliers encloisonnés, ascenseurs pompiers) et de logistique de chantier très importantes.",
  },
  parking: {
    "Souterrain - 1 niveau": "Coût très élevé dû au terrassement en déblai, aux parois moulées ou murs de soutènement, à l'étanchéité (cuvelage) et à la ventilation/désenfumage.",
    "Souterrain - plusieurs niveaux": "Le coût augmente exponentiellement avec la profondeur à cause des contraintes techniques (reprises en sous-œuvre, pompage) et de la complexité structurelle.",
  },
  standingPartiesCommunes: {
    "Haut de gamme": "Matériaux nobles dans le hall et les paliers (marbre, bois), éclairage design, décoration par un architecte d'intérieur.",
    "Luxe": "Services additionnels (conciergerie), grands halls décorés, œuvres d'art, équipements de qualité supérieure.",
  },
  mixiteUsage: {
    "Oui (commerces en RDC)": "Structure du RDC spécifique pour permettre de grandes vitrines et des espaces ouverts, dissociation des réseaux, isolation acoustique renforcée entre commerces et logements.",
  },
  natureSol: {
    'Argileux': "Impose des fondations profondes (micropieux) pour éviter les fissures dues au retrait-gonflement des argiles, entraînant un surcoût majeur sur le gros œuvre.",
    'Rocheux': "Nécessite l'usage d'un brise-roche hydraulique pour le terrassement, ce qui est lent et coûteux.",
    'Remblais': "Sol instable demandant des fondations spéciales (radier général, pieux) ou une substitution du sol, deux options très onéreuses.",
  },
  difficulteTerrain: {
    'Pente faible': "Léger surcoût pour le terrassement et l'adaptation des fondations.",
    'Pente forte': "Coût très élevé : terrassement en gradins, murs de soutènement, fondations étagées, complexité d'accès pour les engins de chantier.",
    'Exigu': "Difficulté d'approvisionnement et de stockage, besoin d'engins de chantier plus petits et moins efficaces, logistique complexe qui augmente les temps et les coûts.",
  },
  situationChantier: {
    'Milieu urbain': "Contraintes de circulation, de livraison, de bruit et de poussière. Horaires de travail souvent restreints.",
    'Milieu urbain dense': "Toutes les contraintes du milieu urbain sont exacerbées. Mitoyenneté, reprises en sous-œuvre, grue à tour coûteuse, emprise de chantier quasi-nulle, base-vie déportée.",
    'Site isolé': "Coût du transport des matériaux et du personnel, nécessité de créer des voies d'accès, coût de raccordement aux réseaux (eau, électricité, assainissement).",
  },
  complexiteArchitecturale: {
    'Moyenne': "Présence de quelques décrochés en façade, de porte-à-faux simples, ou de matériaux variés.",
    'Complexe': "Formes non orthogonales, porte-à-faux importants, murs courbes, toitures complexes, multiples matériaux de façade. Augmente le temps d'étude et de réalisation pour tous les corps d'état.",
  },
};

// --- ÉTAT DE L'APPLICATION ---
let stage = 'selection';
let estimation = null;

// Références DOM (initialisées dans main)
let selectionStageEl;
let formStageEl;
let reportStageEl;
let projectSelectorContainer;
let detailsTitleEl;
let detailsContainerEl;
let contextContainerEl;
let infoNameInput;
let infoSurfaceInput;
let infoBaseCostPerM2Input;

// --- FONCTIONS UTILITAIRES ---
const formatCurrency = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1').trim();

// --- LOGIQUE DE CALCUL ---
function calculateCosts() {
    if (!estimation) {
        return { detailsModifier: 0, contextModifier: 0, totalModifier: 0, baseCost: 0, totalCost: 0, costPerM2: 0, workPackages: [] };
    }

    const detailsModifier = Object.entries(estimation.projectDetails).reduce((acc, [key, value]) => {
        const weight = DETAILS_WEIGHTING_MAP[key]?.[value] ?? 0;
        return acc + weight;
    }, 0);

    const contextModifier = estimation.contextCriteria.reduce((acc, curr) => acc + (Number(curr.weighting) || 0), 0);
    const totalModifier = detailsModifier + contextModifier;
    const baseCost = estimation.projectInfo.surface * estimation.projectInfo.baseCostPerM2;
    const totalCost = baseCost * (1 + totalModifier / 100);
    const costPerM2 = estimation.projectInfo.surface > 0 ? totalCost / estimation.projectInfo.surface : 0;
    const distribution = WORK_PACKAGES_DISTRIBUTION[estimation.projectType] || {};
    const workPackages = Object.entries(distribution).map(([name, percentage]) => ({
        name,
        amount: totalCost * Number(percentage)
    }));

    return { detailsModifier, contextModifier, totalModifier, baseCost, totalCost, costPerM2, workPackages };
}

// --- RENDU UI ---
function updateUI() {
    if (!selectionStageEl || !formStageEl || !reportStageEl) {
        return;
    }

    selectionStageEl.classList.toggle('hidden', stage !== 'selection');
    formStageEl.classList.toggle('hidden', stage !== 'form');
    reportStageEl.classList.toggle('hidden', stage !== 'report');

    if (stage === 'selection') renderSelectionScreen();
    if (stage === 'form') renderFormScreen();
    if (stage === 'report') renderReportScreen();
}

function renderSelectionScreen() {
    if (!projectSelectorContainer) return;
    projectSelectorContainer.innerHTML = '';
    Object.entries(PROJECT_TYPES_CONFIG).forEach(([type, config]) => {
        const card = document.createElement('div');
        card.className = "bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500 cursor-pointer";
        card.innerHTML = `
            <div class="text-6xl text-center mb-4">${config.icon}</div>
            <h3 class="text-xl font-bold text-center text-cyan-400">${config.label}</h3>
        `;
        card.addEventListener('click', () => handleProjectSelect(type));
        projectSelectorContainer.appendChild(card);
    });
}

function renderFormScreen() {
    if (!estimation || !detailsTitleEl || !detailsContainerEl || !contextContainerEl || !infoNameInput || !infoSurfaceInput || !infoBaseCostPerM2Input) return;
    const config = PROJECT_TYPES_CONFIG[estimation.projectType];
    detailsTitleEl.textContent = `Détails Spécifiques: ${config.label}`;

    infoNameInput.value = estimation.projectInfo.name;
    infoSurfaceInput.value = String(estimation.projectInfo.surface);
    infoBaseCostPerM2Input.value = String(estimation.projectInfo.baseCostPerM2);

    detailsContainerEl.innerHTML = '';
    Object.entries(estimation.projectDetails).forEach(([key, value]) => {
        const weighting = DETAILS_WEIGHTING_MAP[key]?.[value] ?? 0;
        const div = document.createElement('div');
        div.className = 'relative';
        div.innerHTML = `
            <label class="block text-sm font-medium text-gray-300 mb-1">${titleCase(key)}</label>
            <select data-section="projectDetails" data-key="${key}" class="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 pr-20">
                ${(config.options[key] || []).map(option => `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`).join('')}
            </select>
            <div class="absolute right-2 bottom-2 text-center px-2 py-0.5 rounded text-xs font-mono ${
                weighting > 0 ? 'bg-green-900/50 text-green-300' : ''
            } ${
                weighting < 0 ? 'bg-red-900/50 text-red-300' : ''
            } ${
                weighting === 0 ? 'bg-gray-700/80 text-gray-400' : ''
            } pointer-events-none">
                ${weighting > 0 ? '+' : ''}${weighting}%
            </div>
        `;
        detailsContainerEl.appendChild(div);
    });

    contextContainerEl.innerHTML = '';
    estimation.contextCriteria.forEach(criterion => {
        const wrapper = document.createElement('div');
        wrapper.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-900/50 p-3 rounded-md';
        wrapper.innerHTML = `
            <label class="font-medium text-gray-300">${criterion.label}</label>
            <select data-section="contextCriteria" data-key="${criterion.id}" data-type="selected" class="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                ${criterion.options.map(option => `<option value="${option}" ${option === criterion.selected ? 'selected' : ''}>${option}</option>`).join('')}
            </select>
            <div class="relative">
                <input data-section="contextCriteria" data-key="${criterion.id}" data-type="weighting" type="number" value="${criterion.weighting}" class="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 pr-8" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
        `;
        contextContainerEl.appendChild(wrapper);
    });
}

function renderReportScreen() {
    if (!estimation || !reportStageEl) return;

    const { detailsModifier, contextModifier, totalModifier, baseCost, totalCost, costPerM2, workPackages } = calculateCosts();

    const impactfulDetails = Object.entries(estimation.projectDetails)
        .map(([key, value]) => {
            const weighting = DETAILS_WEIGHTING_MAP[key]?.[value] ?? 0;
            const explanation = CRITERIA_EXPLANATIONS[key]?.[value];
            if (weighting !== 0 && explanation) {
                return {
                    label: titleCase(key),
                    value,
                    weighting,
                    explanation,
                };
            }
            return null;
        })
        .filter(Boolean);

    const impactfulContext = estimation.contextCriteria
        .map(criterion => {
            const explanation = CRITERIA_EXPLANATIONS[criterion.id]?.[criterion.selected];
            if ((Number(criterion.weighting) || 0) !== 0 && explanation) {
                return {
                    label: criterion.label,
                    value: criterion.selected,
                    weighting: Number(criterion.weighting) || 0,
                    explanation,
                };
            }
            return null;
        })
        .filter(Boolean);

    const allImpactfulCriteria = [...impactfulDetails, ...impactfulContext];
    const impactfulRows = allImpactfulCriteria.length > 0
        ? allImpactfulCriteria.map((item, index) => `
            <tr class="${index % 2 !== 0 ? 'bg-gray-900/30' : ''}">
              <td class="px-4 py-3 border border-gray-700 font-medium">${item.label}</td>
              <td class="px-4 py-3 border border-gray-700">${item.value}</td>
              <td class="px-4 py-3 border border-gray-700 font-bold text-center ${item.weighting > 0 ? 'text-green-400' : 'text-red-400'}">${item.weighting > 0 ? '+' : ''}${item.weighting}%</td>
              <td class="px-4 py-3 border border-gray-700 text-gray-400">${item.explanation}</td>
            </tr>
        `).join('')
        : '';

    reportStageEl.innerHTML = `
        <div class="space-y-6">
          <div id="pdf-report" class="p-8 bg-gray-800 rounded-lg border border-gray-700">
            <h2 class="text-3xl font-bold text-center mb-2 text-cyan-400">Rapport de Synthèse d'Estimation</h2>
            <p class="text-center text-gray-400 mb-8">${new Date().toLocaleDateString('fr-FR')}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-gray-900/50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold text-cyan-500 mb-3">Synthèse du Projet</h3>
                    <p><strong>Nom :</strong> ${estimation.projectInfo.name}</p>
                    <p><strong>Type :</strong> ${PROJECT_TYPES_CONFIG[estimation.projectType].label}</p>
                    <p><strong>Surface :</strong> ${estimation.projectInfo.surface.toLocaleString('fr-FR')} m²</p>
                </div>
                <div class="bg-cyan-900/30 border border-cyan-700 p-6 rounded-lg text-center flex flex-col justify-center">
                     <p class="text-gray-300 text-lg">Coût Total Estimé (HT)</p>
                     <p class="text-4xl font-extrabold text-white my-2">${totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</p>
                     <p class="font-bold text-cyan-400 text-xl">${costPerM2.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })} / m²</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 class="text-lg font-semibold text-cyan-500 mb-3">Critères Spécifiques</h3>
                <ul class="list-disc list-inside space-y-1 bg-gray-900/50 p-4 rounded-lg">
                  ${Object.entries(estimation.projectDetails).map(([key, value]) => `
                     <li><strong>${titleCase(key)}:</strong> ${value}</li>
                  `).join('')}
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-cyan-500 mb-3">Analyse des Modificateurs</h3>
                <div class="bg-gray-900/50 p-4 rounded-lg space-y-2">
                    <div class="flex justify-between"><span>Coût de base</span> <span class="font-mono">${formatCurrency(baseCost)}</span></div>
                    <div class="flex justify-between"><span>Ajustement (Détails Projet)</span> <span class="font-mono ${detailsModifier >= 0 ? 'text-green-400' : 'text-red-400'}">${detailsModifier > 0 ? '+' : ''}${detailsModifier.toFixed(1)}%</span></div>
                    <div class="flex justify-between"><span>Ajustement (Contexte)</span> <span class="font-mono ${contextModifier >= 0 ? 'text-green-400' : 'text-red-400'}">${contextModifier > 0 ? '+' : ''}${contextModifier.toFixed(1)}%</span></div>
                    <div class="flex justify-between font-bold border-t border-gray-600 pt-2 mt-2"><span>Total Modificateurs</span> <span class="font-mono ${totalModifier >= 0 ? 'text-green-400' : 'text-red-400'}">${totalModifier > 0 ? '+' : ''}${totalModifier.toFixed(1)}%</span></div>
                </div>
              </div>
            </div>

            <div>
                <h3 class="text-lg font-semibold text-cyan-500 mb-3">Répartition par Grands Lots</h3>
                <div class="bg-gray-900/50 p-4 rounded-lg space-y-2">
                    ${workPackages.map(wp => `
                        <div class="flex justify-between items-center">
                            <span>${wp.name}</span>
                            <span class="font-mono font-semibold">${formatCurrency(wp.amount)}</span>
                        </div>
                    `).join('')}
                    <div class="flex justify-between items-center font-bold border-t border-gray-600 pt-2 mt-2">
                        <span>Total</span>
                        <span class="font-mono">${formatCurrency(totalCost)}</span>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h3 class="text-xl font-bold text-cyan-400 mb-4 border-t border-gray-700 pt-6">📐 Justification des principaux impacts sur le coût</h3>
                ${impactfulRows || '<p class="text-gray-400 italic mt-4">Aucun critère spécifique avec un impact significatif sur le coût n\'a été sélectionné. L\'estimation se base sur les standards.</p>'}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex gap-4">
              <button id="back-to-form-btn" class="px-6 py-2 font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500">Retour au Formulaire</button>
              <button id="new-estimation-btn" class="px-6 py-2 font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500">Nouvelle Estimation</button>
            </div>
            <div class="flex items-center gap-4">
              <button id="export-csv-btn" class="px-6 py-2 font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500">Exporter en CSV</button>
              <button id="export-pdf-btn" class="px-6 py-2 font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500">Exporter en PDF</button>
            </div>
          </div>
        </div>
    `;

    const backBtn = document.getElementById('back-to-form-btn');
    const newEstimationBtn = document.getElementById('new-estimation-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    if (backBtn) backBtn.addEventListener('click', () => { stage = 'form'; updateUI(); });
    if (newEstimationBtn) newEstimationBtn.addEventListener('click', handleBackToSelection);
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', handleExportCSV);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', handleExportPDF);
}

// --- GESTIONNAIRES D'ÉVÉNEMENTS ---
function handleProjectSelect(projectType) {
    estimation = {
      projectType,
      projectInfo: { name: '', surface: 100, baseCostPerM2: 1800 },
      projectDetails: { ...PROJECT_TYPES_CONFIG[projectType].details },
      contextCriteria: JSON.parse(JSON.stringify(INITIAL_CONTEXT_CRITERIA)).map(c => ({...c, weighting: WEIGHTING_MAP[c.id]?.[c.selected] ?? c.weighting}))
    };
    stage = 'form';
    updateUI();
}

function handleFormChange(event) {
    if (!estimation) return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

    const { section, key, type } = target.dataset;
    if (!section || !key) return;

    let value = target.value;
    if (target.type === 'number') {
        value = parseFloat(target.value) || 0;
    }

    if (section === 'projectInfo') {
        estimation.projectInfo[key] = value;
    } else if (section === 'projectDetails') {
        estimation.projectDetails[key] = value;
        renderFormScreen();
    } else if (section === 'contextCriteria') {
        const criterion = estimation.contextCriteria.find(c => c.id === key);
        if (criterion) {
            if (type === 'selected') {
                criterion.selected = value;
                criterion.weighting = WEIGHTING_MAP[key]?.[value] ?? criterion.weighting;
            } else if (type === 'weighting') {
                criterion.weighting = Number(value) || 0;
            }
            renderFormScreen();
        }
    }
}

function handleBackToSelection() {
    estimation = null;
    stage = 'selection';
    updateUI();
}

function handleExportPDF() {
    const reportElement = document.getElementById('pdf-report');
    const html2canvasFn = window.html2canvas;
    const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
    if (!reportElement || !html2canvasFn || !jsPDFConstructor) {
        console.error('Export PDF indisponible : librairies manquantes.');
        return;
    }

    html2canvasFn(reportElement, { backgroundColor: '#111827', scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDFConstructor('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const widthInPdf = pdfWidth - 20;
        const heightInPdf = widthInPdf / ratio;

        if (heightInPdf < pdfHeight - 20) {
             pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
        } else {
             let position = 0;
             const pageHeight = pdf.internal.pageSize.height - 20;
             pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
             let heightLeft = heightInPdf - pageHeight;
             while (heightLeft > 0) {
               position = -heightLeft - 10;
               pdf.addPage();
               pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
               heightLeft -= pageHeight;
             }
        }
        pdf.save(`rapport-estimation-${(estimation?.projectInfo.name || 'projet').replace(/\s+/g, '_')}.pdf`);
    });
}

function handleExportCSV() {
    if (!estimation) return;
    const { projectInfo, projectType, projectDetails, contextCriteria } = estimation;
    const { totalCost, costPerM2, detailsModifier, contextModifier, totalModifier, workPackages } = calculateCosts();
    const rows = [
        ['Rapport d\'Estimation de Coût'],
        ['"Date"', `"${new Date().toLocaleDateString('fr-FR')}"`], [],
        ['SYNTHÈSE DU PROJET'],
        ['"Nom du projet"', `"${projectInfo.name}"`],
        ['"Type de projet"', `"${PROJECT_TYPES_CONFIG[projectType].label}"`],
        ['"Surface"', `"${projectInfo.surface} m²"`], [],
        ['ESTIMATION FINANCIÈRE'],
        ['"Coût Total Estimé (HT)"', `"${totalCost.toLocaleString('fr-FR')}"`],
        ['"Coût au m²"', `"${costPerM2.toLocaleString('fr-FR')}"`], [],
        ['MODIFICATEURS DE COÛT'],
        ['"Modificateur (Détails Spécifiques)"', `"${detailsModifier.toFixed(2)}%"`],
        ['"Modificateur (Contexte & Difficultés)"', `"${contextModifier.toFixed(2)}%"`],
        ['"Total des Modificateurs"', `"${totalModifier.toFixed(2)}%"`], [],
        ['DÉTAILS SPÉCIFIQUES'],
        ...Object.entries(projectDetails).map(([key, value]) => [`"${titleCase(key)}"` , `"${value}"`]), [],
        ['CONTEXTE & DIFFICULTÉS'],
        ...contextCriteria.map(c => [`"${c.label}"`, `"${c.selected} (${c.weighting > 0 ? '+' : ''}${c.weighting}%)"`]), [],
        ['RÉPARTITION PAR LOTS'],
        ...workPackages.map(wp => [`"${wp.name}"`, `"${wp.amount.toLocaleString('fr-FR')}"`]),
        ['"Total"', `"${totalCost.toLocaleString('fr-FR')}"`],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `estimation_${(projectInfo.name || 'projet').replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- INITIALISATION ---
function attachStaticListeners() {
    if (!formStageEl) return;
    formStageEl.addEventListener('change', handleFormChange);

    if (infoNameInput) {
        infoNameInput.addEventListener('input', (event) => {
            if (!estimation) return;
            const input = event.target;
            if (!(input instanceof HTMLInputElement)) return;
            estimation.projectInfo.name = input.value;
        });
    }

    if (infoSurfaceInput) {
        infoSurfaceInput.addEventListener('input', (event) => {
            if (!estimation) return;
            const input = event.target;
            if (!(input instanceof HTMLInputElement)) return;
            const value = parseFloat(input.value) || 0;
            estimation.projectInfo.surface = value;
        });
    }

    if (infoBaseCostPerM2Input) {
        infoBaseCostPerM2Input.addEventListener('input', (event) => {
            if (!estimation) return;
            const input = event.target;
            if (!(input instanceof HTMLInputElement)) return;
            const value = parseFloat(input.value) || 0;
            estimation.projectInfo.baseCostPerM2 = value;
        });
    }

    const backBtn = document.getElementById('back-to-selection-btn');
    const generateReportBtn = document.getElementById('generate-report-btn');

    if (backBtn) backBtn.addEventListener('click', handleBackToSelection);
    if (generateReportBtn) generateReportBtn.addEventListener('click', () => { stage = 'report'; updateUI(); });
}

function main() {
    selectionStageEl = document.getElementById('selection-stage');
    formStageEl = document.getElementById('form-stage');
    reportStageEl = document.getElementById('report-stage');
    projectSelectorContainer = document.getElementById('project-selector-container');
    detailsTitleEl = document.getElementById('details-title');
    detailsContainerEl = document.getElementById('details-container');
    contextContainerEl = document.getElementById('context-container');
    infoNameInput = document.getElementById('info-name');
    infoSurfaceInput = document.getElementById('info-surface');
    infoBaseCostPerM2Input = document.getElementById('info-baseCostPerM2');

    attachStaticListeners();
    updateUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
