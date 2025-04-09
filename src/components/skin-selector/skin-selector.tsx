"use client";

import { useState, useCallback, useEffect } from "react";
import { Palette, X, Loader2 } from "lucide-react";
import SkinConcerns from "./skin-concerns";
import { toast } from "sonner";
import { SaveAllRecommendationsButton } from "@/components/product/save-all-recommendations-button";
import { SkinAnalysisCheck } from "./skin-analysis-check";

type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive" | "analyzing";
type SkinTone = "cool" | "warm" | "neutral";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  tags: string[];
}

interface Recommendations {
  skincare: Product[];
  makeup: Product[];
}

const skinTypes: { value: SkinType; label: string; description: string }[] = [
  { value: "dry", label: "Dry", description: "Skin that feels tight, flaky, or rough" },
  { value: "normal", label: "Normal", description: "Balanced skin with minimal concerns" },
  { value: "sensitive", label: "Sensitive", description: "Skin that easily reacts to products" },
  { value: "combination", label: "Combination", description: "Mix of oily and dry areas" },
];

// Cool, Warm, and Neutral tone colors
const coolTones = [
  "#533624", "#653728", "#b77e53", "#d6a98a", 
  "#f0cbb0", "#dfbda2", "#e3c8b5"
];

const warmTones = [
  "#f6d4b9", "#deba96", "#dab08c", "#cd865a", 
  "#b37858", "#96624d", "#552e1f"
];

const neutralTones = [
  "#60311f", "#a16f4c", "#bb815c", "#bc8f68", 
  "#ca9978", "#dcba9e", "#f3d7c2"
];

export default function SkinSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<SkinTone | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendations>({ skincare: [], makeup: [] });
  const [showResults, setShowResults] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showSkinAnalysisCheck, setShowSkinAnalysisCheck] = useState(false);

  useEffect(() => {
    if (selectedSkinType) {
      setShowSkinAnalysisCheck(false);
      setIsOpen(true);
    }
  }, [selectedSkinType]);

  const handleConcernsSelected = useCallback((concerns: string[]) => {
    setSelectedConcerns(concerns);
  }, []);

  const handleColorSelect = (color: string, tone: SkinTone) => {
    setSelectedColor(color);
    setSelectedTone(tone);
  };

  const handleGetRecommendations = async () => {
    // Check if at least one of skin type or skin tone is selected
    if (!selectedSkinType && !selectedTone) return;
    
    setIsLoading(true);
    setShowResults(true);

    try {
      const response = await fetch("/api/products/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skinType: selectedSkinType || "universal", // Use "universal" if no skin type selected
          skinTone: selectedTone || "universal", // Use "universal" if no skin tone selected
          concerns: selectedConcerns,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("API error:", data.error);
        toast.error(data.error || "Failed to fetch recommendations");
        return;
      }

      console.log("Recommendations data:", data); // Log the data for debugging
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("An error occurred while fetching recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSkinType(null);
    setSelectedColor(null);
    setSelectedTone(null);
    setSelectedConcerns([]);
    setRecommendations({ skincare: [], makeup: [] });
    setShowResults(false);
  };

  const handleSaveAll = () => {
    // This function is now only used as a callback for the SaveAllRecommendationsButton
    // No need to disable individual buttons anymore
  };

  const handleFloatingButtonClick = () => {
    setShowSkinAnalysisCheck(true);
  };

  const handleProceedWithAnalysis = () => {
    setSelectedSkinType("analyzing");
  };

  const handleCloseSkinAnalysisCheck = () => {
    setShowSkinAnalysisCheck(false);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={product.image || "/placeholder-product.png"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.category}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-green-600">RM{product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SkinAnalysisCheck
        isOpen={showSkinAnalysisCheck}
        onClose={handleCloseSkinAnalysisCheck}
        onProceed={handleProceedWithAnalysis}
      />
      
      {/* Floating Button */}
      <button
        onClick={handleFloatingButtonClick}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        aria-label="Skin Analysis"
      >
        <Palette className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {showResults ? "Recommended Products" : "Skin Analysis"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showResults ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">What&apos;s your skin type?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skinTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedSkinType(type.value)}
                        className={`p-4 text-left rounded-lg border transition-colors ${
                          selectedSkinType === type.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <SkinConcerns onConcernsSelected={handleConcernsSelected} />

                <div>
                  <h3 className="text-lg font-medium mb-3">Select your skin color</h3>
                  <div className="flex flex-col space-y-6">
                    {/* Cool tones */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Cool Tones</p>
                      <div className="flex flex-wrap gap-3">
                        {coolTones.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color, "cool")}
                            style={{ backgroundColor: color }}
                            className={`w-10 h-10 rounded-full border-2 transition-colors ${
                              selectedColor === color
                                ? "border-green-500 scale-110"
                                : "border-gray-200 hover:border-green-300 hover:scale-105"
                            }`}
                            title={`Cool tone ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Warm tones */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Warm Tones</p>
                      <div className="flex flex-wrap gap-3">
                        {warmTones.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color, "warm")}
                            style={{ backgroundColor: color }}
                            className={`w-10 h-10 rounded-full border-2 transition-colors ${
                              selectedColor === color
                                ? "border-green-500 scale-110"
                                : "border-gray-200 hover:border-green-300 hover:scale-105"
                            }`}
                            title={`Warm tone ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Neutral tones */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Neutral Tones</p>
                      <div className="flex flex-wrap gap-3">
                        {neutralTones.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color, "neutral")}
                            style={{ backgroundColor: color }}
                            className={`w-10 h-10 rounded-full border-2 transition-colors ${
                              selectedColor === color
                                ? "border-green-500 scale-110"
                                : "border-gray-200 hover:border-green-300 hover:scale-105"
                            }`}
                            title={`Neutral tone ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleGetRecommendations}
                    disabled={!selectedSkinType || !selectedTone}
                    className={`px-6 py-2 rounded-full font-medium ${
                      !selectedSkinType || !selectedTone
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Get Recommendations
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Debug Toggle */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowDebug(!showDebug)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                      </button>
                    </div>
                    
                    {/* Debug Information */}
                    {showDebug && (
                      <div className="bg-gray-100 p-4 rounded-lg mb-4 text-xs overflow-auto max-h-40">
                        <h4 className="font-medium mb-2">Debug Information:</h4>
                        <p>Selected Skin Type: {selectedSkinType || "None"}</p>
                        <p>Selected Skin Tone: {selectedTone || "None"}</p>
                        <p>Selected Concerns: {selectedConcerns.length > 0 ? selectedConcerns.join(", ") : "None"}</p>
                        <p>Raw Recommendations Data:</p>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(recommendations, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {/* Skincare Recommendations */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Skincare Recommendations</h3>
                        {recommendations.skincare.length > 0 && (
                          <SaveAllRecommendationsButton 
                            productIds={recommendations.skincare.map(p => p.id)} 
                            onSaveAll={handleSaveAll}
                          />
                        )}
                      </div>
                      {recommendations.skincare.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {recommendations.skincare.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-600">No skincare products found matching your criteria.</p>
                          <p className="text-sm text-gray-500 mt-2">Try selecting different skin types or concerns.</p>
                        </div>
                      )}
                    </div>

                    {/* Makeup Recommendations */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Makeup Recommendations</h3>
                        {recommendations.makeup.length > 0 && (
                          <SaveAllRecommendationsButton 
                            productIds={recommendations.makeup.map(p => p.id)} 
                            onSaveAll={handleSaveAll}
                          />
                        )}
                      </div>
                      {recommendations.makeup.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {recommendations.makeup.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-600">No makeup products found matching your criteria.</p>
                          <p className="text-sm text-gray-500 mt-2">Try selecting different skin tones or concerns.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 