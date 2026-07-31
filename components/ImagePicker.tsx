import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ImagePickerProps {
  label: string;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  required?: boolean;
}

export default function ImagePicker({
  label,
  file,
  setFile,
  required = false,
}: ImagePickerProps) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  return (
    <div className="mb-6">
      <label className="block mb-2 text-white font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];

          if (!selectedFile) return;

          setFile(selectedFile);
        }}
        className="w-full
                   text-white
                   file:mr-4
                   file:py-2
                   file:px-4
                   file:rounded
                   file:border-0
                   file:bg-red-600
                   file:text-white
                   hover:file:bg-red-700"
      />

      {preview && (
        <img
          src={preview}
          alt={label}
          className="mt-4 w-full h-56 object-cover rounded-lg border border-zinc-700"
        />
      )}
    </div>
  );
}
