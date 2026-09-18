import React, { useState, useRef } from 'react';
import {
  X,
  UserPlus,
  Phone,
  Mail,
  Clock,
  Check,
  Upload,
  Trash2,
  AlertCircle,
  Camera,
  MapPin,
  Languages,
  FileText,
} from 'lucide-react';
import { Receptionist } from '../types';

interface AddReceptionistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReceptionist: (receptionist: Receptionist) => void;
}

const PRESET_RECEPTIONIST_AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    label: 'Front Desk 1',
  },
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    label: 'Front Desk 2',
  },
  {
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    label: 'Front Desk 3',
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    label: 'Front Desk 4',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    label: 'Front Desk 5',
  },
  {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    label: 'Front Desk 6',
  },
];

const PRESET_DESKS = [
  'Front Desk #1 (Main Entrance)',
  'Front Desk #2 (Express Check-in)',
  'VIP Concierge Desk',
  'Billing & Appointment Desk',
  'Lounge Reception Desk',
];

const PRESET_SHIFTS = [
  'Morning (8:30 AM - 2:30 PM)',
  'Evening (2:00 PM - 8:30 PM)',
  'Full Day (9:00 AM - 8:00 PM)',
  'Weekend Special (10:00 AM - 9:00 PM)',
];

export const AddReceptionistModal: React.FC<AddReceptionistModalProps> = ({
  isOpen,
  onClose,
  onAddReceptionist,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [deskNumber, setDeskNumber] = useState(PRESET_DESKS[0]);
  const [customDesk, setCustomDesk] = useState('');
  const [useCustomDesk, setUseCustomDesk] = useState(false);
  const [shift, setShift] = useState(PRESET_SHIFTS[0]);
  const [customShift, setCustomShift] = useState('');
  const [useCustomShift, setUseCustomShift] = useState(false);
  const [status, setStatus] = useState<Receptionist['status']>('active');
  const [notes, setNotes] = useState('');
  const [languages, setLanguages] = useState('English, Hindi');

  // Photo Source State
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'presets' | 'url'>('upload');
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(PRESET_RECEPTIONIST_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process and downscale image file
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

    const finalDesk = useCustomDesk && customDesk.trim() ? customDesk.trim() : deskNumber;
    const finalShift = useCustomShift && customShift.trim() ? customShift.trim() : shift;
    const finalAvatar = getActiveAvatar();

    const parsedLanguages = languages
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    const newReceptionist: Receptionist = {
      id: `rec-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '+91 98000 00000',
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@houseofhair.com`,
      avatar: finalAvatar,
      deskNumber: finalDesk,
      shift: finalShift,
      status,
      notes: notes.trim() || 'Front counter check-in & client hospitality.',
      languages: parsedLanguages.length > 0 ? parsedLanguages : ['English', 'Hindi'],
    };

    onAddReceptionist(newReceptionist);
    onClose();

    // Reset form
    setName('');
    setPhone('+91 ');
    setEmail('');
    setDeskNumber(PRESET_DESKS[0]);
    setCustomDesk('');
    setUseCustomDesk(false);
    setShift(PRESET_SHIFTS[0]);
    setCustomShift('');
    setUseCustomShift(false);
    setStatus('active');
    setNotes('');
    setLanguages('English, Hindi');
    setLocalPhoto(null);
    setLocalFileName('');
    setCustomAvatarUrl('');
  };

  const activeAvatar = getActiveAvatar();

  return (
    <div id="add-receptionist-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="add-receptionist-modal"
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Receptionist / Front Desk</h3>
              <p className="text-[11px] text-slate-500">Register front desk staff for client check-in & counter operations</p>
            </div>
          </div>
          <button
            id="close-add-receptionist-modal-btn"
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
                alt="Receptionist preview"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-400/50 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Camera className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {name.trim() || 'Receptionist Name'}
              </h4>
              <p className="text-[11px] text-purple-700 font-semibold truncate">
                {useCustomDesk && customDesk.trim() ? customDesk.trim() : deskNumber}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium truncate">
                <span>{useCustomShift && customShift.trim() ? customShift.trim() : shift}</span>
                <span>•</span>
                <span className="capitalize">{status === 'active' ? 'On Duty' : status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Receptionist Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="new-receptionist-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins or Priya Sharma"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Desk Station & Shift in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>Desk / Counter</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomDesk(!useCustomDesk)}
                  className="text-[10px] text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {useCustomDesk ? 'Preset' : '+ Custom'}
                </button>
              </div>
              {useCustomDesk ? (
                <input
                  type="text"
                  value={customDesk}
                  onChange={(e) => setCustomDesk(e.target.value)}
                  placeholder="e.g. VIP Concierge Counter"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              ) : (
                <select
                  value={deskNumber}
                  onChange={(e) => setDeskNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  {PRESET_DESKS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Shift Timing</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomShift(!useCustomShift)}
                  className="text-[10px] text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {useCustomShift ? 'Preset' : '+ Custom'}
                </button>
              </div>
              {useCustomShift ? (
                <input
                  type="text"
                  value={customShift}
                  onChange={(e) => setCustomShift(e.target.value)}
                  placeholder="e.g. 10:00 AM - 6:00 PM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              ) : (
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  {PRESET_SHIFTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Contact Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Phone Number</span>
              </label>
              <input
                id="new-receptionist-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address</span>
              </label>
              <input
                id="new-receptionist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reception@houseofhair.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Initial Duty Status & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shift Status Today
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Receptionist['status'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="active">On Duty (Active)</option>
                <option value="on_break">On Break</option>
                <option value="off">Off Duty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-purple-600" />
                <span>Languages Spoken</span>
              </label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. English, Hindi, Marathi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Desk Notes / Assigned Responsibilities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Counter Notes & Responsibilities (Optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Appointment call bookings, VIP client welcoming, invoice bills"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Profile Photo: Upload from Local Drive + Presets */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-600" />
                <span>Receptionist Photo</span>
              </label>

              {/* Photo Source Tabs */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  id="tab-rec-upload-photo"
                  onClick={() => setPhotoSourceMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    photoSourceMode === 'upload'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  From Computer
                </button>
                <button
                  type="button"
                  id="tab-rec-preset-photos"
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
                  id="tab-rec-url-photo"
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
                  id="receptionist-local-photo-input"
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
                    id="receptionist-photo-dropzone"
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
                      Drag & drop receptionist photo here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      or <span className="text-purple-600 font-semibold underline underline-offset-2">Browse Files</span> from local disk
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
                <p className="text-[11px] text-slate-500 mb-2">Select from front desk staff presets:</p>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_RECEPTIONIST_AVATARS.map((av, idx) => (
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
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/receptionist-photo.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-add-receptionist-btn"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Add Receptionist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
