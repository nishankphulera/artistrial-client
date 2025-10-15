import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Page (Deprecated)</h1>
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <p className="text-gray-600">This profile page has been deprecated. Please use ProfilePageFixed.tsx instead.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
