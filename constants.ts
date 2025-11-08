
// Fix: Import ProjectType to resolve missing type error.
import { MaisonDetails, ErpDetails, LogementDetails, ContextCriterion, ProjectType } from './types';

export const PROJECT_TYPES_CONFIG = {
  maison: {
    label: "Maison Individuelle",
    icon: "🏠",
    details: {
      styleArchitectural: "Traditionnel",
      typeConstruction: "Traditionnelle (parpaing/brique)",
      niveauFinition: "Standard",
      performanceEnergetique: "RE 2020",
      amenagementsExterieurs: "Aucun",
    } as MaisonDetails,
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
    } as ErpDetails,
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
    } as LogementDetails,
    options: {
      nombreNiveaux: ["R+1 à R+3", "R+4 à R+7", "R+8 et plus"],
      parking: ["Aucun/Extérieur", "Souterrain - 1 niveau", "Souterrain - plusieurs niveaux"],
      standingPartiesCommunes: ["Standard", "Haut de gamme", "Luxe"],
      mixiteUsage: ["Non (100% logement)", "Oui (commerces en RDC)"],
    }
  },
};

export const DETAILS_WEIGHTING_MAP: { [key: string]: { [key: string]: number } } = {
  // Maison
  styleArchitectural: { "Traditionnel": 0, "Contemporain": 12, "Plain-pied": 5, "À étages": 0 },
  typeConstruction: { "Traditionnelle (parpaing/brique)": 0, "Ossature bois": 8, "Monomur": 10 },
  niveauFinition: { "Standard": 0, "Haut de gamme": 20, "Luxe": 45 },
  performanceEnergetique: { "RT 2012": -5, "RE 2020": 0, "Passif/Bioclimatique": 15 },
  amenagementsExterieurs: { "Aucun": 0, "Terrasse simple": 3, "Terrasse + Piscine": 10 },
  // ERP
  categorieERP: { "5ème catégorie": 0, "4ème catégorie": 5, "3ème catégorie": 12, "2ème catégorie": 20, "1ère catégorie": 30 },
  complexiteSecuriteIncendie: { "Standard": 0, "Élevée (désenfumage, compartimentage)": 25 },
  niveauAccessibilitePMR: { "Standard": 0, "Complexe (plusieurs ascenseurs, rampes)": 18 },
  typeEtablissement: {
    "Bureaux": 0,
    "Magasin / Centre Commercial (Type M)": 15,
    "Établissement d'Éducation": 10,
    "Hôtel / Locaux à sommeil (Type O)": 30,
    "Établissement Sportif / Salle de Spectacle (Type X/L)": 50,
    "Établissement de Soins (Type U)": 60,
  },
  // Logement
  nombreNiveaux: { "R+1 à R+3": 0, "R+4 à R+7": 15, "R+8 et plus": 35 },
  parking: { "Aucun/Extérieur": 0, "Souterrain - 1 niveau": 25, "Souterrain - plusieurs niveaux": 40 },
  standingPartiesCommunes: { "Standard": 0, "Haut de gamme": 10, "Luxe": 25 },
  mixiteUsage: { "Non (100% logement)": 0, "Oui (commerces en RDC)": 8 },
};

export const INITIAL_CONTEXT_CRITERIA: ContextCriterion[] = [
  {
    id: 'natureSol',
    label: 'Nature du Sol',
    options: ['Standard', 'Argileux', 'Rocheux', 'Remblais'],
    selected: 'Standard',
    weighting: 0
  },
  {
    id: 'difficulteTerrain',
    label: 'Difficulté du Terrain',
    options: ['Plat', 'Pente faible', 'Pente forte', 'Exigu'],
    selected: 'Plat',
    weighting: 0
  },
  {
    id: 'situationChantier',
    label: 'Situation du Chantier',
    options: ['Accès facile', 'Milieu urbain', 'Milieu urbain dense', 'Site isolé'],
    selected: 'Accès facile',
    weighting: 0
  },
  {
    id: 'complexiteArchitecturale',
    label: 'Complexité Architecturale Générale',
    options: ['Simple', 'Moyenne', 'Complexe'],
    selected: 'Simple',
    weighting: 0
  },
];

export const WEIGHTING_MAP: { [key: string]: { [key: string]: number } } = {
  natureSol: { 'Standard': 0, 'Argileux': 8, 'Rocheux': 15, 'Remblais': 12 },
  difficulteTerrain: { 'Plat': 0, 'Pente faible': 5, 'Pente forte': 15, 'Exigu': 10 },
  situationChantier: { 'Accès facile': 0, 'Milieu urbain': 7, 'Milieu urbain dense': 18, 'Site isolé': 5 },
  complexiteArchitecturale: { 'Simple': 0, 'Moyenne': 10, 'Complexe': 25 },
};

export const WORK_PACKAGES_DISTRIBUTION: { [key in ProjectType]: { [key: string]: number } } = {
  maison: {
    'Gros Œuvre (Fondations, Structure, Murs, Toiture)': 0.45,
    'Second Œuvre (Isolation, Menuiseries, Plâtrerie)': 0.30,
    'Lots Techniques (Plomberie, Électricité, CVC)': 0.20,
    'Finitions (Revêtements, Peintures)': 0.05,
  },
  erp: {
    'Gros Œuvre (Fondations, Structure, Murs, Toiture)': 0.55,
    'Second Œuvre (Isolation, Menuiseries, Plâtrerie)': 0.25,
    'Lots Techniques (Plomberie, Électricité, CVC)': 0.15,
    'Finitions (Revêtements, Peintures)': 0.05,
  },
  logement: {
    'Gros Œuvre (Fondations, Structure, Murs, Toiture)': 0.55,
    'Second Œuvre (Isolation, Menuiseries, Plâtrerie)': 0.25,
    'Lots Techniques (Plomberie, Électricité, CVC)': 0.15,
    'Finitions (Revêtements, Peintures)': 0.05,
  }
};

export const CRITERIA_EXPLANATIONS: { [key: string]: { [key: string]: string } } = {
  // Maison
  styleArchitectural: {
    "Contemporain": "Implique souvent des formes complexes, de grandes ouvertures vitrées et des matériaux spécifiques (bardage, béton brut) qui augmentent les coûts de mise en œuvre.",
    "Plain-pied": "Nécessite plus de surface de fondations et de toiture pour une même surface habitable, augmentant le coût du gros œuvre.",
  },
  typeConstruction: {
    "Ossature bois": "Matériau plus cher à l'achat mais plus rapide à monter. Le coût est impacté par la nécessité d'une main d'œuvre spécialisée.",
    "Monomur": "Brique technique plus onéreuse que le parpaing, demandant une mise en œuvre très précise pour garantir ses performances thermiques.",
  },
  niveauFinition: {
    "Haut de gamme": "Utilisation de matériaux nobles (parquet massif, pierre naturelle), menuiseries sur-mesure, équipements sanitaires et électriques de marques supérieures.",
    "Luxe": "Prestations exceptionnelles : domotique avancée, matériaux rares, équipements de luxe (piscine intérieure, spa), intervention d'artisans d'art.",
  },
  performanceEnergetique: {
    "RT 2012": "Standard de construction moins exigeant, permettant une isolation et des systèmes moins performants et donc moins chers (économies à court terme, mais coûts d'exploitation plus élevés).",
    "Passif/Bioclimatique": "Exige une conception très poussée, une isolation et une étanchéité à l'air parfaites, des menuiseries triple vitrage et une VMC double flux à haut rendement. Surcoût important à l'investissement.",
  },
  amenagementsExterieurs: {
    "Terrasse simple": "Coût lié à la surface et au matériau (bois, composite, carrelage sur dalle béton).",
    "Terrasse + Piscine": "Poste très coûteux incluant terrassement, structure béton, étanchéité, filtration, et local technique. Impacte fortement le budget global.",
  },
  // ERP
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
  // Logement
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
  // Contexte
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