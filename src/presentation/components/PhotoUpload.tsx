import { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Loader } from 'lucide-react';

interface PhotoUploadProps {
  value: File | null;
  preview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  uploading?: boolean;
}

export function PhotoUpload({ value, preview, onChange, uploading }: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(file, url);
    setShowOptions(false);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    onChange(null, null);
  };

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-white/10">
        <img
          src={preview}
          alt="Preview"
          className="w-full aspect-[4/3] object-cover"
        />
        {uploading ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader size={28} className="text-green-400 animate-spin" />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/70 transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      {showOptions ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex-1 aspect-[2/1] rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-2 hover:border-green-500/30 hover:bg-green-500/5 transition-all active:scale-[0.98]"
          >
            <Camera size={28} className="text-green-400" />
            <span className="text-xs text-white/50 font-medium">拍照</span>
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 aspect-[2/1] rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-2 hover:border-green-500/30 hover:bg-green-500/5 transition-all active:scale-[0.98]"
          >
            <ImageIcon size={28} className="text-blue-400" />
            <span className="text-xs text-white/50 font-medium">相簿</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowOptions(true)}
          className="w-full aspect-[3/2] rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 active:scale-[0.98] group"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <Camera size={28} className="text-green-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/50 group-hover:text-white/70 transition-colors">
              添加產品照片
            </p>
            <p className="text-[11px] text-white/25 mt-0.5">Add product photo</p>
          </div>
        </button>
      )}
    </>
  );
}
