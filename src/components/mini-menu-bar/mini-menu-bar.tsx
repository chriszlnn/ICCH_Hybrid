import { cn } from "@/lib/utils/utils";

export default function MiniMenuBar() {
  return (
    <div className="flex space-x-8 p-4 bg-transparent">
      {["Our Products", "Beauty Info"].map((item) => (
        <a
          key={item}
          href="#"
          className={cn(
            "px-4 py-2 text-black rounded-md transition-colors",
            "hover:bg-gray-200"
          )}
        >
          {item}
        </a>
      ))}
    </div>
  );
}
