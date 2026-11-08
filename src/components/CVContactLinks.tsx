import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { PersonalInfo } from '../types/cv';
import { formatLocation } from '../templates/templateUtils';

interface CVContactLinksProps {
  personal: PersonalInfo;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  showIcons?: boolean;
}

export const CVContactLinks: React.FC<CVContactLinksProps> = ({
  personal,
  className = 'flex flex-wrap items-center gap-3 text-xs',
  itemClassName = 'inline-flex items-center gap-1.5 hover:underline text-inherit',
  iconClassName = 'w-3.5 h-3.5 text-current opacity-80',
  showIcons = true
}) => {
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className={className}>
      {personal.email && (
        <a
          href={`mailto:${personal.email}`}
          className={itemClassName}
          title="Email"
        >
          {showIcons && <Mail className={iconClassName} />}
          <span>{personal.email}</span>
        </a>
      )}

      {personal.phone && (
        <a
          href={`tel:${personal.phone.replace(/[^\d+]/g, '')}`}
          className={itemClassName}
          title="Phone"
        >
          {showIcons && <Phone className={iconClassName} />}
          <span>{personal.phone}</span>
        </a>
      )}

      {location && (
        <span className={itemClassName}>
          {showIcons && <MapPin className={iconClassName} />}
          <span>{location}</span>
        </span>
      )}

      {personal.linkedin && (
        <a
          href={
            personal.linkedin.startsWith('http')
              ? personal.linkedin
              : `https://${personal.linkedin}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className={itemClassName}
          title="LinkedIn Profile"
        >
          {showIcons && <Linkedin className={iconClassName} />}
          <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
        </a>
      )}

      {personal.website && (
        <a
          href={
            personal.website.startsWith('http')
              ? personal.website
              : `https://${personal.website}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className={itemClassName}
          title="Portfolio / Website"
        >
          {showIcons && <Globe className={iconClassName} />}
          <span>{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
        </a>
      )}
    </div>
  );
};
