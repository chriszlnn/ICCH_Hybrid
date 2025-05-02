import { useState, useEffect } from "react";
import { SKIN_TYPE_TAGS, SKIN_CONCERN_TAGS, SKIN_TONE_TAGS } from "@/lib/constants/product-tags";

interface ProductTagsManagerProps {
  initialTags?: string[];
  category: "Skincare" | "Makeup";
  onTagsChange: (tags: string[]) => void;
}

export default function ProductTagsManager({
  initialTags = [],
  category,
  onTagsChange,
}: ProductTagsManagerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const renderTagSection = (title: string, tags: readonly string[]) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTags.includes(tag)
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
            }`}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {category === "Skincare" ? (
        <>
          {renderTagSection("Skin Types", SKIN_TYPE_TAGS)}
          {renderTagSection("Skin Concerns", SKIN_CONCERN_TAGS)}
        </>
      ) : (
        renderTagSection("Skin Tones", SKIN_TONE_TAGS)
      )}
    </div>
  );
} 