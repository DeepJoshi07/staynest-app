import { useState } from "react";

export default function ImageUploader({ onChange }) {
  const [preview, setPreview] = useState(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    onChange(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Upload image</label>
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm" />
      <p className="text-xs text-slate-500">Cloudinary integration point: POST /api/upload</p>
      {preview ? (
        <img src={preview} alt="Preview" className="h-48 w-full rounded-xl object-cover" loading="lazy" />
      ) : null}
    </div>
  );
}
