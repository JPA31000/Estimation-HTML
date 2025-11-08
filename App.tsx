import React, { useState, useCallback, useMemo } from 'react';
import { ProjectType, Estimation, ContextCriterion } from './types';
import { PROJECT_TYPES_CONFIG, INITIAL_CONTEXT_CRITERIA, WEIGHTING_MAP, WORK_PACKAGES_DISTRIBUTION, DETAILS_WEIGHTING_MAP, CRITERIA_EXPLANATIONS } from './constants';
import { jsPDF } from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

type Stage = 'selection' | 'form' | 'report';

// --- UI Components defined in the same file for simplicity ---

const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div
    className={`bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const Button: React.FC<{ children: React.ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' }> = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = "px-6 py-2 font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const variantClasses = variant === 'primary'
    ? "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500"
    : "bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500";
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input {...props} className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }> = ({ label, options, className, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select {...props} className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 ${className || ''}`}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);


// --- App Component ---

export default function App() {
  const [stage, setStage] = useState<Stage>('selection');
  const [estimation, setEstimation] = useState<Estimation | null>(null);

  const handleProjectSelect = (projectType: ProjectType) => {
    setEstimation({
      projectType,
      projectInfo: { name: '', surface: 100, baseCostPerM2: 1800 },
      projectDetails: PROJECT_TYPES_CONFIG[projectType].details,
      contextCriteria: INITIAL_CONTEXT_CRITERIA.map(c => ({...c, weighting: WEIGHTING_MAP[c.id][c.selected]}))
    });
    setStage('form');
  };

  const updateEstimation = <K extends keyof Estimation>(key: K, value: Estimation[K]) => {
    setEstimation(prev => prev ? { ...prev, [key]: value } : null);
  };
  
  const handleCriteriaChange = (id: string, selected: string) => {
    if(!estimation) return;
    const newCriteria = estimation.contextCriteria.map(c => {
        if(c.id === id) {
            const newWeighting = WEIGHTING_MAP[c.id]?.[selected] ?? c.weighting;
            return {...c, selected, weighting: newWeighting};
        }
        return c;
    });
    updateEstimation('contextCriteria', newCriteria);
  };

  const handleWeightingChange = (id: string, weighting: number) => {
    if(!estimation) return;
    const newCriteria = estimation.contextCriteria.map(c => c.id === id ? {...c, weighting: isNaN(weighting) ? 0 : weighting } : c);
    updateEstimation('contextCriteria', newCriteria);
  };

  const handleBackToSelection = () => {
    setEstimation(null);
    setStage('selection');
  };

  const renderContent = () => {
    switch (stage) {
      case 'form':
        return estimation && <EstimationForm estimation={estimation} setEstimation={setEstimation} onShowReport={() => setStage('report')} onCriteriaChange={handleCriteriaChange} onWeightingChange={handleWeightingChange} onBackToSelection={handleBackToSelection} />;
      case 'report':
        return estimation && <SummaryReport estimation={estimation} onBack={() => setStage('form')} onBackToSelection={handleBackToSelection} />;
      case 'selection':
      default:
        return <ProjectSelector onSelect={handleProjectSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            Estimateur de Coûts de Construction
          </h1>
          <p className="text-gray-400 mt-2">Outil d'aide à la décision pour la phase APS</p>
        </header>
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// --- Sub Components ---

const ProjectSelector: React.FC<{ onSelect: (type: ProjectType) => void }> = ({ onSelect }) => (
  <div>
    <h2 className="text-2xl font-bold text-center mb-8">Choisissez un type de projet</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {(Object.keys(PROJECT_TYPES_CONFIG) as ProjectType[]).map(type => (
        <Card key={type} onClick={() => onSelect(type)}>
          <div className="text-6xl text-center mb-4">{PROJECT_TYPES_CONFIG[type].icon}</div>
          <h3 className="text-xl font-bold text-center text-cyan-400">{PROJECT_TYPES_CONFIG[type].label}</h3>
        </Card>
      ))}
    </div>
  </div>
);

interface EstimationFormProps {
  estimation: Estimation;
  setEstimation: React.Dispatch<React.SetStateAction<Estimation | null>>;
  onShowReport: () => void;
  onCriteriaChange: (id: string, selected: string) => void;
  onWeightingChange: (id: string, weighting: number) => void;
  onBackToSelection: () => void;
}

const EstimationForm: React.FC<EstimationFormProps> = ({ estimation, setEstimation, onShowReport, onCriteriaChange, onWeightingChange, onBackToSelection }) => {
  const { projectType, projectInfo, projectDetails, contextCriteria } = estimation;
  const config = PROJECT_TYPES_CONFIG[projectType];

  const updateField = (section: keyof Estimation, field: string, value: any) => {
    setEstimation(prev => {
      if (!prev) return null;
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...(sectionData as object),
            [field]: value,
          }
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">Informations Générales</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Nom du Projet" value={projectInfo.name} onChange={e => updateField('projectInfo', 'name', e.target.value)} />
          <Input label="Surface (m²)" type="number" value={projectInfo.surface} onChange={e => updateField('projectInfo', 'surface', parseFloat(e.target.value) || 0)} />
          <Input label="Coût de base (€/m²)" type="number" value={projectInfo.baseCostPerM2} onChange={e => updateField('projectInfo', 'baseCostPerM2', parseFloat(e.target.value) || 0)} />
        </div>
      </Card>
      
      <Card>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">Détails Spécifiques: {config.label}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(projectDetails).map(([key, value]) => {
            const weighting = DETAILS_WEIGHTING_MAP[key]?.[value as string] ?? 0;
            return (
              <div key={key} className="relative">
                <Select
                  label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  options={(config.options as any)[key]}
                  value={value as string}
                  onChange={e => updateField('projectDetails', key, e.target.value)}
                  className="pr-20"
                />
                <div className={`
                  absolute right-2 bottom-2 text-center px-2 py-0.5 rounded text-xs font-mono
                  ${weighting > 0 ? 'bg-green-900/50 text-green-300' : ''}
                  ${weighting < 0 ? 'bg-red-900/50 text-red-300' : ''}
                  ${weighting === 0 ? 'bg-gray-700/80 text-gray-400' : ''}
                  pointer-events-none
                `}>
                  {weighting > 0 ? '+' : ''}{weighting}%
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">Contexte et Difficultés</h3>
        <div className="space-y-4">
          {contextCriteria.map(criterion => (
            <div key={criterion.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-900/50 p-3 rounded-md">
              <label className="font-medium text-gray-300">{criterion.label}</label>
              <Select
                label=""
                options={criterion.options}
                value={criterion.selected}
                onChange={e => onCriteriaChange(criterion.id, e.target.value)}
                className="md:col-span-1"
              />
              <div className="relative">
                 <Input
                  label=""
                  type="number"
                  value={criterion.weighting}
                  onChange={e => onWeightingChange(criterion.id, parseFloat(e.target.value))}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Button onClick={onBackToSelection} variant="secondary">Retour à la sélection</Button>
        <Button onClick={onShowReport}>Générer le Rapport de Synthèse</Button>
      </div>
    </div>
  );
};

interface SummaryReportProps {
  estimation: Estimation;
  onBack: () => void;
  onBackToSelection: () => void;
}

const DetailedWeightingExplanation: React.FC<{ estimation: Estimation }> = ({ estimation }) => {
  const { projectDetails, contextCriteria } = estimation;

  const impactfulDetails = Object.entries(projectDetails)
    .map(([key, value]) => {
      const weighting = DETAILS_WEIGHTING_MAP[key]?.[value as string] ?? 0;
      // @ts-ignore
      const explanation = CRITERIA_EXPLANATIONS[key]?.[value as string];
      if (weighting !== 0 && explanation) {
        return {
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          value: value as string,
          weighting: weighting,
          explanation: explanation,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const impactfulContext = contextCriteria
    .map(criterion => {
      // @ts-ignore
      const explanation = CRITERIA_EXPLANATIONS[criterion.id]?.[criterion.selected];
      if (criterion.weighting !== 0 && explanation) {
        return {
          label: criterion.label,
          value: criterion.selected,
          weighting: criterion.weighting,
          explanation: explanation,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const allImpactfulCriteria = [...impactfulDetails, ...impactfulContext];

  if (allImpactfulCriteria.length === 0) {
    return (
      <p className="text-gray-400 italic mt-4">Aucun critère spécifique avec un impact significatif sur le coût n'a été sélectionné. L'estimation se base sur les standards.</p>
    );
  }

  return (
    <div className="relative overflow-x-auto mt-4">
      <table className="w-full text-sm text-left text-gray-300 border-collapse">
        <thead className="text-xs text-cyan-300 uppercase bg-gray-900/50">
          <tr>
            <th scope="col" className="px-4 py-3 border border-gray-700 w-1/4">Critère Impactant</th>
            <th scope="col" className="px-4 py-3 border border-gray-700 w-1/6">Option Choisie</th>
            <th scope="col" className="px-4 py-3 border border-gray-700 w-1/12 text-center">Impact</th>
            <th scope="col" className="px-4 py-3 border border-gray-700">Justification Technique</th>
          </tr>
        </thead>
        <tbody>
          {allImpactfulCriteria.map((item, index) => (
            <tr key={index} className={index % 2 !== 0 ? 'bg-gray-900/30' : ''}>
              <td className="px-4 py-3 border border-gray-700 font-medium">{item.label}</td>
              <td className="px-4 py-3 border border-gray-700">{item.value}</td>
              <td className={`px-4 py-3 border border-gray-700 font-bold text-center ${item.weighting > 0 ? 'text-green-400' : 'text-red-400'}`}>{item.weighting > 0 ? '+' : ''}{item.weighting}%</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-400">{item.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SummaryReport: React.FC<SummaryReportProps> = ({ estimation, onBack, onBackToSelection }) => {

  const { detailsModifier, contextModifier, totalModifier, baseCost, totalCost, costPerM2, workPackages } = useMemo(() => {
    const detailsModifier = Object.entries(estimation.projectDetails).reduce((acc, [key, value]) => {
        const weight = DETAILS_WEIGHTING_MAP[key]?.[value as string] ?? 0;
        return acc + weight;
    }, 0);

    const contextModifier = estimation.contextCriteria.reduce((acc, curr) => acc + curr.weighting, 0);
    
    const totalModifier = detailsModifier + contextModifier;

    const baseCost = estimation.projectInfo.surface * estimation.projectInfo.baseCostPerM2;
    const totalCost = baseCost * (1 + totalModifier / 100);
    const costPerM2 = estimation.projectInfo.surface > 0 ? totalCost / estimation.projectInfo.surface : 0;
    
    const distribution = WORK_PACKAGES_DISTRIBUTION[estimation.projectType];
    const workPackages = Object.entries(distribution).map(([name, percentage]) => ({
        name,
        // Fix: Explicitly cast percentage to Number to resolve potential TypeScript inference issues with Object.entries.
        amount: totalCost * Number(percentage)
    }));

    return { detailsModifier, contextModifier, totalModifier, baseCost, totalCost, costPerM2, workPackages };
  }, [estimation]);
  
  const handleExportPDF = () => {
    const reportElement = document.getElementById('pdf-report');
    if(reportElement) {
        // @ts-ignore
        html2canvas(reportElement, { backgroundColor: '#111827', scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const widthInPdf = pdfWidth - 20; // with margin
            const heightInPdf = widthInPdf / ratio;
            
            let currentHeight = 10;
            if(heightInPdf < pdfHeight - 20) {
                 pdf.addImage(imgData, 'PNG', 10, currentHeight, widthInPdf, heightInPdf);
            } else {
                 let position = 0;
                 const pageHeight = pdf.internal.pageSize.height - 20;
                 pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
                 let heightLeft = heightInPdf - pageHeight;
                 while (heightLeft > 0) {
                   position = -heightLeft -10;
                   pdf.addPage();
                   pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
                   heightLeft -= pageHeight;
                 }
            }
            pdf.save(`rapport-estimation-${estimation.projectInfo.name || 'projet'}.pdf`);
        });
    }
  };

  const handleExportCSV = () => {
    const { projectInfo, projectType, projectDetails, contextCriteria } = estimation;

    const rows = [
        ['Rapport d\'Estimation de Coût'],
        ['"Date"', `"${new Date().toLocaleDateString('fr-FR')}"`],
        [],
        ['SYNTHÈSE DU PROJET'],
        ['"Nom du projet"', `"${projectInfo.name}"`],
        ['"Type de projet"', `"${PROJECT_TYPES_CONFIG[projectType].label}"`],
        ['"Surface"', `"${projectInfo.surface} m²"`],
        [],
        ['ESTIMATION FINANCIÈRE'],
        ['"Coût Total Estimé (HT)"', `"${totalCost.toLocaleString('fr-FR')}"`],
        ['"Coût au m²"', `"${costPerM2.toLocaleString('fr-FR')}"`],
        [],
        ['MODIFICATEURS DE COÛT'],
        ['"Modificateur (Détails Spécifiques)"', `"${detailsModifier.toFixed(2)}%"`],
        ['"Modificateur (Contexte & Difficultés)"', `"${contextModifier.toFixed(2)}%"`],
        ['"Total des Modificateurs"', `"${totalModifier.toFixed(2)}%"`],
        [],
        ['DÉTAILS SPÉCIFIQUES'],
        ...Object.entries(projectDetails).map(([key, value]) => [`"${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}"`, `"${value}"`]),
        [],
        ['CONTEXTE & DIFFICULTÉS'],
        ...contextCriteria.map(c => [`"${c.label}"`, `"${c.selected} (${c.weighting > 0 ? '+' : ''}${c.weighting}%)"`]),
        [],
        ['RÉPARTITION PAR LOTS'],
        ...workPackages.map(wp => [`"${wp.name}"`, `"${wp.amount.toLocaleString('fr-FR')}"`]),
        ['"Total"', `"${totalCost.toLocaleString('fr-FR')}"`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `estimation_${projectInfo.name.replace(/ /g,"_") || 'projet'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div id="pdf-report" className="p-8 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">Rapport de Synthèse d'Estimation</h2>
        <p className="text-center text-gray-400 mb-8">{new Date().toLocaleDateString('fr-FR')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-900/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-cyan-500 mb-3">Synthèse du Projet</h3>
                <p><strong>Nom :</strong> {estimation.projectInfo.name}</p>
                <p><strong>Type :</strong> {PROJECT_TYPES_CONFIG[estimation.projectType].label}</p>
                <p><strong>Surface :</strong> {estimation.projectInfo.surface.toLocaleString('fr-FR')} m²</p>
            </div>
            <div className="bg-cyan-900/30 border border-cyan-700 p-6 rounded-lg text-center flex flex-col justify-center">
                 <p className="text-gray-300 text-lg">Coût Total Estimé (HT)</p>
                 <p className="text-4xl font-extrabold text-white my-2">{totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</p>
                 <p className="font-bold text-cyan-400 text-xl">{costPerM2.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })} / m²</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-cyan-500 mb-3">Critères Spécifiques</h3>
            <ul className="list-disc list-inside space-y-1 bg-gray-900/50 p-4 rounded-lg">
              {Object.entries(estimation.projectDetails).map(([key, value]) => (
                 <li key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong> {value as string}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-500 mb-3">Analyse des Modificateurs</h3>
            <div className="bg-gray-900/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between"><span>Coût de base</span> <span className="font-mono">{baseCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between"><span>Ajustement (Détails Projet)</span> <span className={`font-mono ${detailsModifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>{detailsModifier > 0 ? '+' : ''}{detailsModifier.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span>Ajustement (Contexte)</span> <span className={`font-mono ${contextModifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>{contextModifier > 0 ? '+' : ''}{contextModifier.toFixed(1)}%</span></div>
                <div className="flex justify-between font-bold border-t border-gray-600 pt-2 mt-2"><span>Total Modificateurs</span> <span className={`font-mono ${totalModifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalModifier > 0 ? '+' : ''}{totalModifier.toFixed(1)}%</span></div>
            </div>
          </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-cyan-500 mb-3">Répartition par Grands Lots</h3>
            <div className="bg-gray-900/50 p-4 rounded-lg space-y-2">
                {workPackages.map(wp => (
                    <div key={wp.name} className="flex justify-between items-center">
                        <span>{wp.name}</span>
                        <span className="font-mono font-semibold">{wp.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</span>
                    </div>
                ))}
                <div className="flex justify-between items-center font-bold border-t border-gray-600 pt-2 mt-2">
                    <span>Total</span>
                    <span className="font-mono">{totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</span>
                </div>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 border-t border-gray-700 pt-6">📐 Justification des principaux impacts sur le coût</h3>
            <DetailedWeightingExplanation estimation={estimation} />
        </div>

      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button onClick={onBack} variant="secondary">Retour au Formulaire</Button>
          <Button onClick={onBackToSelection} variant="secondary">Nouvelle Estimation</Button>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleExportCSV} variant="secondary">Exporter en CSV</Button>
          <Button onClick={handleExportPDF}>Exporter en PDF</Button>
        </div>
      </div>
    </div>
  );
};
