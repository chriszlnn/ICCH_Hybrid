import BeautyPostsGrid from "@/components/beauty-info/beauty-posts-grid";
import SkinSelector from "@/components/skin-selector/skin-selector";
export default function BeautyInfoPage() {
    return (
      <div>
        <div className="pb-4">
        <h1 className="text-2xl font-bold">Beauty Info</h1>
        <p>Learn about beauty tips and skincare routines.</p>
        </div>
        <BeautyPostsGrid />
        <SkinSelector />
      </div>
    );
  }
  