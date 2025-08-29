'use client';
import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;