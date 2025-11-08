
export type ProjectType = 'maison' | 'erp' | 'logement';

export interface ProjectInfo {
  name: string;
  surface: number;
  baseCostPerM2: number;
}

export interface MaisonDetails {
  styleArchitectural: string;
  typeConstruction: string;
  niveauFinition: string;
  performanceEnergetique: string;
  amenagementsExterieurs: string;
}

export interface ErpDetails {
  categorieERP: string;
  complexiteSecuriteIncendie: string;
  niveauAccessibilitePMR: string;
  typeEtablissement: string;
}

export interface LogementDetails {
  nombreNiveaux: string;
  parking: string;
  standingPartiesCommunes: string;
  mixiteUsage: string;
}

export type ProjectDetails = MaisonDetails | ErpDetails | LogementDetails;

export interface ContextCriterion {
  id: string;
  label: string;
  options: string[];
  selected: string;
  weighting: number;
}

export interface Estimation {
  projectType: ProjectType;
  projectInfo: ProjectInfo;
  projectDetails: ProjectDetails;
  contextCriteria: ContextCriterion[];
}