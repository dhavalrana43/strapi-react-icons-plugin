import React from 'react';
import { IconContext } from 'react-icons/lib';

import DynamicReactIcon from './DynamicReactIcon';

interface IIconComponent {
  icon: string;
  size?: number;
}

const strapiTheme = window.localStorage.STRAPI_THEME;

export const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  if (undefined === icon) return <></>;

  return (
    <IconContext.Provider value={{ color: strapiTheme === 'light' ? '#212134' : '#a5a5ba' }}>
      <DynamicReactIcon name={icon} size={size} />
    </IconContext.Provider>
  );
};
