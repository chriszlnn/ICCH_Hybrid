export const SKIN_TYPE_TAGS = [
  "dry",
  "normal", 
  "sensitive",
  "combination",
  "universal" // For products that work for all skin types
] as const;

export const SKIN_CONCERN_TAGS = [
  "acne",
  "sensitivity",
  "hyperpigmentation",
  "blackheads",
  "dullness",
  "dryness",
  "sunDamage",
  "aging",
  "pores",
  "redness",
  "oiliness"
] as const;

export const SKIN_TONE_TAGS = [
  "cool",
  "warm",
  "neutral",
  "universal" // For products that work for all skin tones
] as const;

export type SkinTypeTag = typeof SKIN_TYPE_TAGS[number];
export type SkinConcernTag = typeof SKIN_CONCERN_TAGS[number];
export type SkinToneTag = typeof SKIN_TONE_TAGS[number];

// Helper function to get all available tags
export const getAllTags = () => {
  return {
    skinType: SKIN_TYPE_TAGS,
    skinConcern: SKIN_CONCERN_TAGS,
    skinTone: SKIN_TONE_TAGS
  };
}; 