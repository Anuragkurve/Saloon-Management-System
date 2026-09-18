import React, { useState, useRef } from 'react';
import {
  X,
  UserPlus,
  Percent,
  Phone,
  Briefcase,
  Star,
  Check,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  FolderOpen,
  Camera,
} from 'lucide-react';
import { Staff } from '../types';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: Staff) => void;
}

const PRESET_AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    label: 'Stylist 1',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    label: 'Stylist 2',
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    label: 'Stylist 3',
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    label: 'Stylist 4',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    label: 'Stylist 5',
  },
  {
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    label: 'Stylist 6',
  },
];

const PRESET_ROLES = [
  'Senior Master Stylist & Colorist',
  'Haircut & Texture Specialist',
  'Colorist & Balayage Specialist',
  'Beard Grooming & Men\'s Stylist',
  'Luxury Scalp & Spa Therapist',
  'Nail Artist & Esthetician',
  'Junior Stylist & Blowout Artist',
];

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAddStaff,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(PRESET_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [commissionRate, setCommissionRate] = useState<number>(20);
  const [status, setStatus] = useState<Staff['status']>('active');
  const [rating, setRating] = useState<number>(4.9);
  const [useCustomRole, setUseCustomRole] = useState(false);

  // Photo Source State
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'presets' | 'url'>('upload');
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process and downscale image file to optimize for localStorage & crisp rendering
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 320;
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          const canvas = document.createElement('canvas');
          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxDim, maxDim);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setLocalPhoto(optimizedDataUrl);
            setLocalFileName(file.name);
            setPhotoSourceMode('upload');
          } else {
            setLocalPhoto(result);
            setLocalFileName(file.name);
            setPhotoSourceMode('upload');
          }
        } catch {
          setLocalPhoto(result);
          setLocalFileName(file.name);
          setPhotoSourceMode('upload');
        }
      };
      img.onerror = () => {
        setUploadError('Could not decode the selected image. Please try another.');
      };
      img.src = result;
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file from local drive.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveLocalPhoto = () => {
    setLocalPhoto(null);
    setLocalFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine active avatar
  const getActiveAvatar = () => {
    if (photoSourceMode === 'upload' && localPhoto) {
      return localPhoto;
    }
    if (photoSourceMode === 'url' && customAvatarUrl.trim()) {
      return customAvatarUrl.trim();
    }
    return selectedPresetAvatar;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalRole = useCustomRole && customRole.trim() ? customRole.trim() : role;
    const finalAvatar = getActiveAvatar();

    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      role: finalRole,
      avatar: finalAvatar,
      status,
      rating: Number(rating) || 4.9,
      servicesToday: 0,
      totalRevenueToday: 0,
      commissionRate: Number(commissionRate) || 20,
      phone: phone.trim() || '+91 98000 00000',
    };

    onAddStaff(newStaff);
    onClose();

    // Reset form
    setName('');
    setPhone('+91 ');
    setCustomRole('');
    setUseCustomRole(false);
    setCommissionRate(20);
    setStatus('active');
    setLocalPhoto(null);
    setLocalFileName('');
    setCustomAvatarUrl('');
  };

  const activeAvatar = getActiveAvatar();

  return (
    <div id="add-staff-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="add-staff-modal"
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Salon Stylist / Staff</h3>
              <p className="text-[11px] text-slate-500">Register stylist to station chairs & commission payouts</p>
            </div>
          </div>
          <button
            id="close-add-staff-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Active Avatar Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-purple-50/40 border border-purple-100">
            <div className="relative">
              <img
                src={activeAvatar}
                alt="Stylist preview"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-400/50 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Camera className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {name.trim() || 'Stylist Name'}
              </h4>
              <p className="text-[11px] text-purple-700 font-medium truncate">
                {useCustomRole && customRole.trim() ? customRole.trim() : role}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                <span>{commissionRate}% Comm</span>
                <span>•</span>
                <span className="capitalize">{status.replace('_', ' ')}</span>
                {localPhoto && photoSourceMode === 'upload' && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Local Photo
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stylist Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="new-staff-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Verma or Ananya Deshmukh"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Role & Specialization */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Primary Role / Specialization</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCustomRole(!useCustomRole)}
                className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold"
              >
                {useCustomRole ? 'Choose Preset Role' : '+ Custom Role'}
              </button>
            </div>

            {useCustomRole ? (
              <input
                id="new-staff-custom-role"
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Master Balayage & Keratin Specialist"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            ) : (
              <select
                id="new-staff-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                {PRESET_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Contact Phone & Commission Rate in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Phone Number</span>
              </label>
              <input
                id="new-staff-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-purple-600" />
                <span>Commission Rate (%)</span>
              </label>
              <input
                id="new-staff-commission"
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Initial Shift Status & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shift Status Today
              </label>
              <select
                id="new-staff-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as Staff['status'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 capitalize"
              >
                <option value="active">Active (On Duty)</option>
                <option value="busy">Busy (In Service)</option>
                <option value="on_break">On Break</option>
                <option value="off">Off Duty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Initial Stylist Rating</span>
              </label>
              <input
                id="new-staff-rating"
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Profile Photo: Upload from Local Drive + Presets */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-600" />
                <span>Stylist Profile Photo</span>
              </label>

              {/* Photo Source Tabs */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  id="tab-upload-local-photo"
                  onClick={() => setPhotoSourceMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    photoSourceMode === 'upload'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  From Local Drive
                </button>
                <button
                  type="button"
                  id="tab-preset-photos"
                  onClick={() => setPhotoSourceMode('presets')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    photoSourceMode === 'presets'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  id="tab-url-photo"
                  onClick={() => setPhotoSourceMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    photoSourceMode === 'url'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Image Link
                </button>
              </div>
            </div>

            {/* Mode 1: Local Drive Upload with Drag-and-Drop */}
            {photoSourceMode === 'upload' && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  id="staff-local-photo-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {localPhoto ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={localPhoto}
                        alt="Local file preview"
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                          {localFileName || 'Uploaded Photo'}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready to save
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveLocalPhoto}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    id="staff-photo-dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-purple-600 bg-purple-50/60 scale-[1.01]'
                        : 'border-slate-300 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop photo from your local drive
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      or <span className="text-purple-600 font-semibold underline underline-offset-2">Browse Files</span> on your computer
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Supports JPG, PNG, WEBP (auto-fitted for staff avatar)
                    </p>
                  </div>
                )}

                {uploadError && (
                  <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                  </p>
                )}
              </div>
            )}

            {/* Mode 2: Preset Photos */}
            {photoSourceMode === 'presets' && (
              <div>
                <p className="text-[11px] text-slate-500 mb-2">Select from curated salon team photos:</p>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPresetAvatar(av.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                        selectedPresetAvatar === av.url
                          ? 'border-purple-600 ring-2 ring-purple-500/20 scale-105 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-full h-full object-cover"
                      />
                      {selectedPresetAvatar === av.url && (
                        <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 3: Web Image URL */}
            {photoSourceMode === 'url' && (
              <div>
                <input
                  id="new-staff-custom-avatar"
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/stylist-photo.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Paste a direct web link to an image file.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-add-staff-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-add-staff-btn"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Add Stylist to Roster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

