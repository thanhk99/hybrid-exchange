'use client';
import React, { useRef } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';

interface ProfileAvatarProps {
  avatar?: string;
  onAvatarChange?: (file: File) => void;
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatar,
  onAvatarChange,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img 
              src={avatar} 
              alt="Profile avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-sm">Ảnh</span>
            </div>
          )}
        </div>
        <button
          onClick={handleAvatarClick}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <AiOutlineEdit size={12} className="text-gray-600" />
        </button>
      </div>
      
      <button
        onClick={handleAvatarClick}
        className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        Thay đổi
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatar;