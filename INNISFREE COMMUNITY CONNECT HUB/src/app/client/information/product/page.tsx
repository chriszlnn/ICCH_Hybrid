import ViewProductPage from "@/components/view-product/view-product";
import SkinSelector from "@/components/skin-selector/skin-selector";

export default function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      {/* Product List */}
      <div className="pb-24">
        <ViewProductPage />
      </div>
      {/* Skin Selector */}
      <SkinSelector />
    </div>
  );
}
