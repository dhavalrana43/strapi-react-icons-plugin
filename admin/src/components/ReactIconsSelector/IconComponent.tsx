import React from 'react';
import { IconContext } from 'react-icons/lib';
import { useTheme } from 'styled-components';

import DynamicReactIcon from './DynamicReactIcon';

interface IIconComponent {
  icon: string;
  size?: number;
}

export const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  const theme = useTheme();

  if (undefined === icon) return <></>;

  return (
    <IconContext.Provider value={{ color: theme.colors.neutral800 }}>
      <DynamicReactIcon name={icon} size={size} />
    </IconContext.Provider>
  );
};
