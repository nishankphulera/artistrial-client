import React from 'react';
import { useRouter } from 'next/navigation';

interface UserProfileLinkProps {
  userId: string;
  userName: string;
  className?: string;
  prefix?: string;
}

export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  userId,
  userName,
  className = "text-blue-600 hover:text-blue-800 hover:underline transition-colors",
  prefix = "by"
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${userId}`);
  };

  return (
    <span>
      {prefix && `${prefix} `}
      <button
        onClick={handleClick}
        className={className}
        type="button"
      >
        {userName}
      </button>
    </span>
  );
};

