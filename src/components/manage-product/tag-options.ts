// Tag options for product filtering and recommendations

export interface TagOption {
  id: string;
  label: string;
  category: "skinType" | "skinConcern" | "skinTone" | "skinColor";
  applicableTo: "skincare" | "makeup" | "both";
  hexValue?: string; // Optional hex value for skin color tags
  tone?: "cool" | "warm" | "neutral"; // Optional tone for skin color tags
}

export const tagOptions: TagOption[] = [
  // Skin Types
  { id: "dry", label: "Dry", category: "skinType", applicableTo: "both" },
  { id: "oily", label: "Oily", category: "skinType", applicableTo: "both" },
  { id: "combination", label: "Combination", category: "skinType", applicableTo: "both" },
  { id: "normal", label: "Normal", category: "skinType", applicableTo: "both" },
  { id: "sensitive", label: "Sensitive", category: "skinType", applicableTo: "both" },
  
  // Skin Concerns
  { id: "acne", label: "Acne", category: "skinConcern", applicableTo: "both" },
  { id: "aging", label: "Aging", category: "skinConcern", applicableTo: "both" },
  { id: "hyperpigmentation", label: "Hyperpigmentation", category: "skinConcern", applicableTo: "both" },
  { id: "darkCircles", label: "Dark Circles", category: "skinConcern", applicableTo: "both" },
  { id: "dryness", label: "Dryness", category: "skinConcern", applicableTo: "both" },
  { id: "redness", label: "Redness", category: "skinConcern", applicableTo: "both" },
  { id: "largePores", label: "Large Pores", category: "skinConcern", applicableTo: "both" },
  { id: "dullness", label: "Dullness", category: "skinConcern", applicableTo: "both" },
  
  // Skin Tones (for makeup products)
  { id: "cool", label: "Cool", category: "skinTone", applicableTo: "makeup" },
  { id: "warm", label: "Warm", category: "skinTone", applicableTo: "makeup" },
  { id: "neutral", label: "Neutral", category: "skinTone", applicableTo: "makeup" },
  
  // Skin Colors - Cool Tones
  { id: "cool_533624", label: "Cool Deep", category: "skinColor", applicableTo: "makeup", hexValue: "#533624", tone: "cool" },
  { id: "cool_653728", label: "Cool Medium Deep", category: "skinColor", applicableTo: "makeup", hexValue: "#653728", tone: "cool" },
  { id: "cool_b77e53", label: "Cool Medium", category: "skinColor", applicableTo: "makeup", hexValue: "#b77e53", tone: "cool" },
  { id: "cool_d6a98a", label: "Cool Light Medium", category: "skinColor", applicableTo: "makeup", hexValue: "#d6a98a", tone: "cool" },
  { id: "cool_f0cbb0", label: "Cool Light", category: "skinColor", applicableTo: "makeup", hexValue: "#f0cbb0", tone: "cool" },
  { id: "cool_dfbda2", label: "Cool Fair", category: "skinColor", applicableTo: "makeup", hexValue: "#dfbda2", tone: "cool" },
  { id: "cool_e3c8b5", label: "Cool Very Fair", category: "skinColor", applicableTo: "makeup", hexValue: "#e3c8b5", tone: "cool" },
  
  // Skin Colors - Warm Tones
  { id: "warm_f6d4b9", label: "Warm Very Fair", category: "skinColor", applicableTo: "makeup", hexValue: "#f6d4b9", tone: "warm" },
  { id: "warm_deba96", label: "Warm Fair", category: "skinColor", applicableTo: "makeup", hexValue: "#deba96", tone: "warm" },
  { id: "warm_dab08c", label: "Warm Light", category: "skinColor", applicableTo: "makeup", hexValue: "#dab08c", tone: "warm" },
  { id: "warm_cd865a", label: "Warm Light Medium", category: "skinColor", applicableTo: "makeup", hexValue: "#cd865a", tone: "warm" },
  { id: "warm_b37858", label: "Warm Medium", category: "skinColor", applicableTo: "makeup", hexValue: "#b37858", tone: "warm" },
  { id: "warm_96624d", label: "Warm Medium Deep", category: "skinColor", applicableTo: "makeup", hexValue: "#96624d", tone: "warm" },
  { id: "warm_552e1f", label: "Warm Deep", category: "skinColor", applicableTo: "makeup", hexValue: "#552e1f", tone: "warm" },
  
  // Skin Colors - Neutral Tones
  { id: "neutral_60311f", label: "Neutral Deep", category: "skinColor", applicableTo: "makeup", hexValue: "#60311f", tone: "neutral" },
  { id: "neutral_a16f4c", label: "Neutral Medium Deep", category: "skinColor", applicableTo: "makeup", hexValue: "#a16f4c", tone: "neutral" },
  { id: "neutral_bb815c", label: "Neutral Medium", category: "skinColor", applicableTo: "makeup", hexValue: "#bb815c", tone: "neutral" },
  { id: "neutral_bc8f68", label: "Neutral Light Medium", category: "skinColor", applicableTo: "makeup", hexValue: "#bc8f68", tone: "neutral" },
  { id: "neutral_ca9978", label: "Neutral Light", category: "skinColor", applicableTo: "makeup", hexValue: "#ca9978", tone: "neutral" },
  { id: "neutral_dcba9e", label: "Neutral Fair", category: "skinColor", applicableTo: "makeup", hexValue: "#dcba9e", tone: "neutral" },
  { id: "neutral_f3d7c2", label: "Neutral Very Fair", category: "skinColor", applicableTo: "makeup", hexValue: "#f3d7c2", tone: "neutral" },
];

// Helper functions to filter tags by category
export const getSkinTypeTags = () => tagOptions.filter(tag => tag.category === "skinType");
export const getSkinConcernTags = () => tagOptions.filter(tag => tag.category === "skinConcern");
export const getSkinToneTags = () => tagOptions.filter(tag => tag.category === "skinTone");
export const getSkinColorTags = () => tagOptions.filter(tag => tag.category === "skinColor");

// Helper function to get applicable tags based on product category
export const getApplicableTags = (productCategory: string) => {
  if (productCategory === "skincare") {
    return tagOptions.filter(tag => tag.applicableTo === "skincare" || tag.applicableTo === "both");
  } else if (productCategory === "makeup") {
    return tagOptions.filter(tag => tag.applicableTo === "makeup" || tag.applicableTo === "both");
  } else {
    return tagOptions.filter(tag => tag.applicableTo === "both");
  }
}; 