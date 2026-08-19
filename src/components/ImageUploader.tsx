import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Check, Trash2, Link as LinkIcon, Sparkles, RefreshCw, AlertCircle, Cloud } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Trip Cover Photo',
  value,
  onChange,
  helperText = 'Upload local image file from device, pick HD travel preset, or paste Cloud / Cloudinary image URL.'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState('I8DT5sPMc8dpWns2SrX2A-DLmXA');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('dl2pct1rb');
  const [cloudinaryPreset, setCloudinaryPreset] = useState('ml_default');
  const [imgbbApiKey, setImgbbApiKey] = useState('0222f7b4c6e949988225e3dbdf93fb9d');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Curated Travel Presets Collection
  const TRAVEL_PRESETS = [
    { title: 'Manali & Atal Tunnel Snow', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Kasol & Parvati Pine Trail', url: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Spiti Kaza Monastery Pass', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Riverside Alpine Camp & Bonfire', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Jaisalmer Desert Dunes Safari', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Meghalaya Living Root Bridge', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Gokarna Beach Sunset Shacks', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { title: 'AC Force Traveller Executive Coach', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Handle Device File Upload (Cloudinary API -> ImgBB API -> Local FileReader Fallback)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Try Cloudinary Direct Unsigned/Signed Upload if configured
      if (cloudinaryCloudName.trim() && cloudinaryApiKey.trim()) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        formData.append('api_key', cloudinaryApiKey.trim());

        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName.trim()}/image/upload`, {
            method: 'POST',
            body: formData
          });
          const resData = await res.json();
          if (resData && resData.secure_url) {
            onChange(resData.secure_url);
            setIsUploading(false);
            return;
          }
        } catch (cErr) {
          console.warn("Cloudinary endpoint fallback to ImgBB / DataURL:", cErr);
        }
      }

      // 2. Try ImgBB Free Cloud Upload fallback
      if (imgbbApiKey.trim()) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey.trim()}`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data && data.data && data.data.url) {
          onChange(data.data.url);
          setIsUploading(false);
          return;
        }
      }

      // 3. High-speed local Data URL fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.warn("Upload fallback to DataURL:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      onChange(customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
      
      {/* Label & Active Preview Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-white flex items-center space-x-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{label}</span>
          </label>
          <p className="text-[10px] text-slate-400">{helperText}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'upload' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📁 Device File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'presets' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ HD Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'url' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔗 Image URL
          </button>
        </div>
      </div>

      {/* Active Image Thumbnail Preview */}
      {value && (
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-900 group h-36 sm:h-44">
          <img
            src={value}
            alt="Uploaded Trip Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          
          <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
            <Check className="w-3 h-3" />
            <span>Photo Attached</span>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-rose-500/80 hover:bg-rose-500 text-white p-1.5 rounded-xl text-xs transition-colors"
            title="Remove Photo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="absolute bottom-2 left-2 right-2 text-[10px] text-slate-300 truncate font-mono bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 flex items-center space-x-1">
            <Cloud className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{value.startsWith('data:') ? 'Local Image File Stream (Ready)' : value}</span>
          </div>
        </div>
      )}

      {/* TAB 1: DEVICE FILE UPLOADER */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/60 transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1.5 pointer-events-none">
              <Upload className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-white">
                {isUploading ? 'Processing & Uploading Photo...' : 'Click or Drag Image File From Device'}
              </p>
              <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP (Cloudinary API / ImgBB / Instant Stream)</p>
            </div>
          </div>

          {/* Cloudinary API Key Banner */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[10px] text-slate-300">
            <div className="flex items-center space-x-1.5 font-bold text-cyan-400">
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloudinary API Integrated</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Cloudinary API Key:</span>
                <input
                  type="text"
                  value={cloudinaryApiKey}
                  onChange={(e) => setCloudinaryApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono text-[10px] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-slate-500 block">Cloud Name:</span>
                <input
                  type="text"
                  value={cloudinaryCloudName}
                  onChange={(e) => setCloudinaryCloudName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono text-[10px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HD TRAVEL PRESETS */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TRAVEL_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.url)}
              className={`relative rounded-xl overflow-hidden border text-left group transition-all h-20 ${
                value === preset.url
                  ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white line-clamp-1">
                {preset.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* TAB 3: CUSTOM IMAGE URL */}
      {activeTab === 'url' && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <LinkIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="url"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyCustomUrl}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex-shrink-0"
          >
            Apply URL
          </button>
        </div>
      )}

    </div>
  );
};
