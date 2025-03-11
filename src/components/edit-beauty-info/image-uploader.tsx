"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, MoveUp, MoveDown } from "lucide-react";
import { useToast } from "../ui/toast/use-toast";
import { useUploadThing } from "@/lib/utils/uploadthing";
import Cropper from "react-easy-crop";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  // Cropper States
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  interface CroppedAreaPixels {
    width: number;
    height: number;
    x: number;
    y: number;
  }
  
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadResponse = await startUpload(Array.from(files));
      if (!uploadResponse || uploadResponse.length === 0) throw new Error("Upload failed");

      const uploadedImageUrls = uploadResponse.map((res) => res.url);
      onChange([...images, ...uploadedImageUrls]);

      toast({
        title: "Success",
        description: `${uploadedImageUrls.length} image${uploadedImageUrls.length > 1 ? "s" : ""} uploaded`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({ title: "Error", description: "Failed to upload images", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === images.length - 1)) return;
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onChange(newImages);
  };

  const handleCropChange = useCallback((crop: { x: number; y: number }) => setCrop(crop), []);
  const handleZoomChange = useCallback((zoom: number) => setZoom(zoom), []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => setCroppedAreaPixels(croppedAreaPixels), []);

  // Open cropper modal
  const openCropper = (index: number) => {
    setSelectedImage(images[index]);
    setCropIndex(index);
    setIsCropping(true);
  };

  // Apply cropping
  const applyCrop = async () => {
    if (!selectedImage || !croppedAreaPixels || cropIndex === null) return;

    const image = new window.Image();
    image.src = selectedImage;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedImage = canvas.toDataURL("image/png");

    const updatedImages = [...images];
    updatedImages[cropIndex] = croppedImage;
    onChange(updatedImages);

    setIsCropping(false);
    setSelectedImage(null);
    setCropIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative group aspect-square overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover cursor-pointer"
              onDoubleClick={() => openCropper(index)}
            />

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => moveImage(index, "up")} disabled={index === 0}>
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => moveImage(index, "down")} disabled={index === images.length - 1}>
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => removeImage(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">{index + 1}</div>
          </Card>
        ))}

        <Card className="aspect-square flex items-center justify-center border-dashed">
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
            <div className="flex flex-col items-center justify-center p-4">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">{uploading ? "Uploading..." : "Upload Images"}</p>
            </div>
          </label>
        </Card>
      </div>

      {images.length > 0 && <p className="text-sm text-muted-foreground">Double-click an image to crop it.</p>}

      {/* Crop Modal */}
      {isCropping && selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={handleCropChange}
              onZoomChange={handleZoomChange}
              onCropComplete={onCropComplete}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsCropping(false)}>
                Cancel
              </Button>
              <Button onClick={applyCrop}>Apply Crop</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
