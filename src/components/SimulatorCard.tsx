import React, { useRef } from 'react';
import { RotateCcw, Save, Target } from 'lucide-react';

interface BacNotes {
  regional: number | null;
  controleContinue: number | null;
  national: number | null;
  moyenne: number | null;
}

interface SimulatorCardProps {
  notes: BacNotes;
  onNotesChange: (notes: BacNotes) => void;
  onReset: () => void;
  onSave: () => void;
  onSaveButtonClick?: (buttonRect: DOMRect) => void;
}

const SimulatorCard: React.FC<SimulatorCardProps> = ({
  notes,
  onNotesChange,
  onReset,
  onSave,
  onSaveButtonClick
}) => {
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const handleInputChange = (field: keyof BacNotes, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    if (numValue !== null && (numValue < 0 || numValue > 20)) return;
    
    onNotesChange({
      ...notes,
      [field]: numValue
    });
  };

  const handleSaveClick = () => {
    if (saveButtonRef.current && onSaveButtonClick) {
      const rect = saveButtonRef.current.getBoundingClientRect();
      onSaveButtonClick(rect);
    }
    onSave();
  };

  const isValidNote = (value: number | null) => {
    return value !== null && value >= 0 && value <= 20;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="space-y-6">
          {/* Mode objectif à atteindre uniquement */}
          <InputField
            label="Moyenne souhaitée"
            value={notes.moyenne}
            onChange={(value) => handleInputChange('moyenne', value)}
            color="orange"
            weight="Objectif"
            isValid={isValidNote(notes.moyenne)}
          />
          <InputField
            label="Note Examen Régional"
            value={notes.regional}
            onChange={(value) => handleInputChange('regional', value)}
            color="blue"
            weight="25%"
            isValid={isValidNote(notes.regional)}
            optional={true}
          />
          <InputField
            label="Note Contrôles Continus"
            value={notes.controleContinue}
            onChange={(value) => handleInputChange('controleContinue', value)}
            color="green"
            weight="25%"
            isValid={isValidNote(notes.controleContinue)}
            optional={true}
          />
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
            ref={saveButtonRef}
            onClick={handleSaveClick}
            disabled={notes.moyenne === null}
            className="flex-1 py-3 px-4 bg-[#cda86b] text-white rounded-lg font-medium hover:bg-[#b8956b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
    blue: 'border-blue-200 focus:border-[#cda86b] focus:ring-[#cda86b]/20',
    green: 'border-green-200 focus:border-[#cda86b] focus:ring-[#cda86b]/20',
    purple: 'border-purple-200 focus:border-[#004235] focus:ring-[#004235]/20',
    orange: 'border-orange-200 focus:border-[#cda86b] focus:ring-[#cda86b]/20'
  };

  const badgeColors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-[#004235]/10 text-[#004235]',
    orange: 'bg-[#cda86b]/10 text-[#004235]'
  };

  return (
    <div className="space-y-3">
      {/* Badge centered at top */}
      <div className="text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColors[color as keyof typeof badgeColors]}`}>
          {weight}
        </span>
      </div>
      
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 text-center mb-3">
          {label}
          {optional && <span className="text-gray-400 ml-1">(optionnel)</span>}
        </label>
      </div>
      
      {/* Input */}
      <div className="relative">
        <input
          type="number"
          min="0"
          max="20"
          step="0.01"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors text-xl font-bold text-center
            ${isValid 
              ? colorClasses[color as keyof typeof colorClasses]
              : 'border-red-300 focus:border-red-500 focus:ring-red-200'
            }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">
          /20
        </div>
      </div>
      
      {/* Error message */}
      {value !== null && !isValid && (
        <p className="text-red-500 text-xs text-center mt-2">La note doit être entre 0 et 20</p>
      )}
    </div>
  );
};

export default SimulatorCard;
