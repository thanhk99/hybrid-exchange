'use client';
import React from 'react';
import { AiOutlineEdit, AiOutlineCopy, AiTwotoneEye, AiFillCheckCircle } from 'react-icons/ai';

interface ProfileFieldProps {
  label: string;
  value: string;
  actionType: 'edit' | 'copy' | 'view' | 'manage';
  actionText: string;
  onAction?: () => void;
  isVerified?: boolean;
  className?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  actionType,
  actionText,
  onAction,
  isVerified = false,
  className = ''
}) => {
  const getActionIcon = () => {
    switch (actionType) {
      case 'edit':
        return <AiOutlineEdit size={14} />;
      case 'copy':
        return <AiOutlineCopy size={14} />;
      case 'view':
        return <AiTwotoneEye size={14} />;
      default:
        return null;
    }
  };

  const handleCopy = async () => {
    if (actionType === 'copy') {
      try {
        await navigator.clipboard.writeText(value);
        // You could add a toast notification here
        console.log('Copied to clipboard:', value);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
    onAction?.();
  };

  return (
    <div className={`flex items-center py-3 border-b border-gray-100 ${className}`}>
      <span className="flex-1 text-gray-900 font-medium">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        {isVerified ? (
          <div className="flex items-center gap-2 text-green-600">
            <AiFillCheckCircle size={16} />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-gray-600">{value}</span>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
      >
        {getActionIcon()}
        {actionText}
      </button>
    </div>
  );
};

export default ProfileField;