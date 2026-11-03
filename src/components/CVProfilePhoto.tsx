import React from 'react';
import { PhotoShape, PhotoBorder } from '../types/cv';

interface CVProfilePhotoProps {
  photoUrl?: string;
  alt?: string;
  shape?: PhotoShape;
  border?: PhotoBorder;
  className?: string;
  containerClassName?: string;
  accentColor?: string;
  fallbackInitials?: string;
}

export const CVProfilePhoto: React.FC<CVProfilePhotoProps> = ({
  photoUrl,
  alt = 'Profile photo',
  shape = 'circle',
  border = 'none',
  className = 'w-24 h-24',
  containerClassName = '',
  accentColor = '#2563eb',
  fallbackInitials
}) => {
  if (!photoUrl) {
    if (!fallbackInitials) return null;
    return (
      <div
        className={`flex items-center justify-center font-bold text-white bg-slate-700 select-none ${className} ${containerClassName}`}
        style={{
          borderRadius: shape === 'circle' ? '9999px' : shape === 'rounded' ? '1rem' : shape === 'oval' ? '50% / 40%' : '0px',
          clipPath:
            shape === 'hexagon'
              ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              : shape === 'badge'
              ? 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)'
              : undefined
        }}
      >
        {fallbackInitials}
      </div>
    );
  }

  // Determine shape styles
  let shapeClass = 'rounded-full';
  let clipPath: string | undefined = undefined;

  switch (shape) {
    case 'circle':
      shapeClass = 'rounded-full';
      break;
    case 'rounded':
      shapeClass = 'rounded-2xl';
      break;
    case 'square':
      shapeClass = 'rounded-none';
      break;
    case 'oval':
      shapeClass = 'rounded-[50%/40%]';
      break;
    case 'hexagon':
      shapeClass = 'rounded-none';
      clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      break;
    case 'badge':
      shapeClass = 'rounded-none';
      clipPath = 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)';
      break;
    default:
      shapeClass = 'rounded-full';
  }

  // Determine border styles
  let borderClass = '';
  let borderStyle: React.CSSProperties = {};

  if (!clipPath) {
    switch (border) {
      case 'thin':
        borderClass = 'ring-2 ring-slate-300';
        break;
      case 'accent':
        borderClass = 'ring-4';
        borderStyle = { '--tw-ring-color': accentColor } as React.CSSProperties;
        break;
      case 'double':
        borderClass = 'ring-4 ring-white shadow-md outline outline-2';
        borderStyle = { outlineColor: accentColor };
        break;
      case 'none':
      default:
        borderClass = 'shadow-xs';
        break;
    }
  }

  return (
    <div className={`relative inline-block shrink-0 ${containerClassName}`}>
      <img
        src={photoUrl}
        alt={alt}
        className={`object-cover ${className} ${shapeClass} ${borderClass} transition-all duration-200`}
        style={{
          ...borderStyle,
          ...(clipPath ? { clipPath, WebkitClipPath: clipPath } : {})
        }}
      />
    </div>
  );
};
