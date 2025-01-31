import { useState, useEffect } from 'react';
import type { IconType } from 'react-icons';

interface IDynamicReactIcon {
  name: string;
  size?: number;
}

const DynamicReactIcon = ({ name, size = 24 }: IDynamicReactIcon) => {
  const [IconComponent, setIconComponent] = useState<IconType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const libAbbrev = name.substring(0, 2).toLowerCase();
        const iconModule = await import(`react-icons/${libAbbrev}`);
        const Component = iconModule[name];

        if (!Component) throw new Error(`Icon ${name} not found`);

        setIconComponent(() => Component);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Icon load failed'));
        setIconComponent(null);
      }
    };

    name && loadIcon();
  }, [name]);

  if (error) {
    console.error(`Icon Error: ${error.message}`);
    return null;
  }

  return IconComponent ? <IconComponent size={size} /> : null;
};

export default DynamicReactIcon;
