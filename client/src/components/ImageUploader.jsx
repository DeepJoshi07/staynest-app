import { useState } from "react";

export default function ImageUploader({ onChange }) {
  const [previews, setPreviews] = useState([]);

  const handleFile = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const localUrls = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews(p => [...p,...localUrls]);
    onChange(files);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Upload image</label>
      <input
        type="file"
        accept="image/*"
        name="image"
        multiple
        onChange={handleFile}
        className="block w-full text-sm"
      />
      <p className="text-xs text-slate-500">
        Cloudinary integration point: POST /api/upload
      </p>
      <div className="grid grid-cols-3 gap-2">
        {previews.map(({ file, preview }, index) => (
          <div key={index} className="space-y-1">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="h-32 w-full rounded-xl object-cover"
              loading="lazy"
            />
            <p className="text-xs text-center text-slate-600">{file?file.name:"Unnamed file"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
