import { useState, useEffect } from "react";

interface SkinConcernsProps {
  onConcernsSelected: (concerns: string[]) => void;
}

const SKIN_CONCERNS = [
  { id: "acne", label: "Acne/Blemishes" },
  { id: "sensitivity", label: "Sensitivity/Irritation" },
  { id: "hyperpigmentation", label: "Hyperpigmentation" },
  { id: "blackheads", label: "Blackheads" },
  { id: "dullness", label: "Dullness/Uneven Tone" },
  { id: "dryness", label: "Dryness/Dehydration" },
  { id: "sunDamage", label: "Sun Damage" },
  { id: "aging", label: "Aging/Fine Lines" },
  { id: "pores", label: "Visible Pores/Enlarged Pores" },
  { id: "redness", label: "Redness/Rosacea" },
  { id: "oiliness", label: "Oiliness" },
];

export default function SkinConcerns({ onConcernsSelected }: SkinConcernsProps) {
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  // Use useEffect to handle changes to selectedConcerns
  useEffect(() => {
    onConcernsSelected(selectedConcerns);
  }, [selectedConcerns, onConcernsSelected]);

  const handleConcernToggle = (concernId: string) => {
    setSelectedConcerns((prev) => 
      prev.includes(concernId)
        ? prev.filter((id) => id !== concernId)
        : [...prev, concernId]
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2">Do you have any skin concerns?</h2>
      <p className="text-gray-600 mb-4">
        Please select all of your concerns for accurate recommendations
      </p>
      <div className="flex flex-wrap gap-2">
        {SKIN_CONCERNS.map((concern) => (
          <button
            key={concern.id}
            onClick={() => handleConcernToggle(concern.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedConcerns.includes(concern.id)
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            {concern.label}
          </button>
        ))}
      </div>
    </div>
  );
} 