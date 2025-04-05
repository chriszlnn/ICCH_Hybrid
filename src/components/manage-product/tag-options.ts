// Tag options for product filtering and recommendations

export interface TagOption {
  id: string;
  label: string;
  category: "skinType" | "skinConcern" | "skinTone";
  applicableTo: "skincare" | "makeup" | "both";
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
];

// Helper functions to filter tags by category
export const getSkinTypeTags = () => tagOptions.filter(tag => tag.category === "skinType");
export const getSkinConcernTags = () => tagOptions.filter(tag => tag.category === "skinConcern");
export const getSkinToneTags = () => tagOptions.filter(tag => tag.category === "skinTone");

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