import React from 'react';
import { RotateCcw, Save, Calculator, Target } from 'lucide-react';

interface BacNotes {
  regional: number | null;
  controleContinue: number | null;
  national: number | null;
  moyenne: number | null;
}

interface SimulatorCardProps {
  notes: BacNotes;
  mode: 'calculate' | 'reverse';
  onNotesChange: (notes: BacNotes) => void;
  onModeChange: (mode: 'calculate' | 'reverse') => void;
  onReset: () => void;
  onSave: () => void;
}

const SimulatorCard: React.FC<SimulatorCardProps> = ({
  notes,
  mode,
  onNotesChange,
  onModeChange,
  onReset,
  onSave
}) => {
  const handleInputChange = (field: keyof BacNotes, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    if (numValue !== null && (numValue < 0 || numValue > 20)) return;
    
    onNotesChange({
      ...notes,
      [field]: numValue
    });
  };

  const isValidNote = (value: number | null) => {
    return value !== null && value >= 0 && value <= 20;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Mode Selector */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex space-x-1">
          <button
            onClick={() => onModeChange('calculate')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === 'calculate'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-blue-600 shadow-sm'
            }`}
          >
            <Calculator className="w-4 h-4 inline mr-2" />
            Calculer ma moyenne
          </button>
          <button
            onClick={() => onModeChange('reverse')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === 'reverse'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-purple-600 shadow-sm'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Objectif à atteindre
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {/* Inputs selon le mode */}
          {mode === 'calculate' ? (
            <>
              <InputField
                label="Note Examen Régional"
                value={notes.regional}
                onChange={(value) => handleInputChange('regional', value)}
                color="blue"
                weight="25%"
                isValid={isValidNote(notes.regional)}
              />
              <InputField
                label="Note Contrôles Continus"
                value={notes.controleContinue}
                onChange={(value) => handleInputChange('controleContinue', value)}
                color="green"
                weight="25%"
                isValid={isValidNote(notes.controleContinue)}
              />
              <InputField
                label="Note Examen National"
                value={notes.national}
                onChange={(value) => handleInputChange('national', value)}
                color="purple"
                weight="50%"
                isValid={isValidNote(notes.national)}
              />
            </>
          ) : (
            <>
              <InputField
                label="Moyenne souhaitée"
                value={notes.moyenne}
                onChange={(value) => handleInputChange('moyenne', value)}
                color="orange"
                weight="Objectif"
                isValid={isValidNote(notes.moyenne)}
              />
              <InputField
                label="Note Examen Régional (acquise)"
                value={notes.regional}
                onChange={(value) => handleInputChange('regional', value)}
                color="blue"
                weight="25%"
                isValid={isValidNote(notes.regional)}
                optional
              />
              <InputField
                label="Note Contrôles Continus (acquise)"
                value={notes.controleContinue}
                onChange={(value) => handleInputChange('controleContinue', value)}
                color="green"
                weight="25%"
                isValid={isValidNote(notes.controleContinue)}
                optional
              />
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={onReset}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </button>
          <button
            onClick={onSave}
            disabled={notes.moyenne === null}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// Component InputField
interface InputFieldProps {
  label: string;
  value: number | null;
  onChange: (value: string) => void;
  color: string;
  weight: string;
  isValid?: boolean;
  optional?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  color,
  weight,
  isValid = true,
  optional = false
}) => {
  const colorClasses = {
    blue: 'border-blue-200 focus:border-blue-500 focus:ring-blue-200',
    green: 'border-green-200 focus:border-green-500 focus:ring-green-200',
    purple: 'border-purple-200 focus:border-purple-500 focus:ring-purple-200',
    orange: 'border-orange-200 focus:border-orange-500 focus:ring-orange-200'
  };

  const badgeColors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {optional && <span className="text-gray-400 ml-1">(optionnel)</span>}
        </label>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors[color as keyof typeof badgeColors]}`}>
          {weight}
        </span>
      </div>
      <div className="relative">
        <input
          type="number"
          min="0"
          max="20"
          step="0.01"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors text-lg font-medium
            ${isValid 
              ? colorClasses[color as keyof typeof colorClasses]
              : 'border-red-300 focus:border-red-500 focus:ring-red-200'
            }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
          /20
        </div>
      </div>
      {value !== null && !isValid && (
        <p className="text-red-500 text-xs mt-1">La note doit être entre 0 et 20</p>
      )}
    </div>
  );
};

export default SimulatorCard;
