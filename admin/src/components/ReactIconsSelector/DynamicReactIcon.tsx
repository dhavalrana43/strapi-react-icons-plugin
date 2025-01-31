import { DOMAttributes } from 'react';
import { IconType } from 'react-icons';
import * as React from 'react';

export type IReactIcon = string;

interface IDynamicReactIcon extends DOMAttributes<SVGElement> {
  name: IReactIcon;
  size?: number;
}

const DynamicReactIcon: React.FC<IDynamicReactIcon> = ({
  name,
  size,
  ...rest
}: IDynamicReactIcon) => {
  const [icon, setIcon] = React.useState<IconType | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadIcon = async () => {
      try {
        const lib = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ')[0];
        const iconModule = await import(`react-icons/${lib.toLowerCase()}`);
        const IconComponent = iconModule[name] as IconType;
        setIcon(() => IconComponent);
        setError(null);
      } catch (e) {
        setError(new Error(`Icon ${name} not found`));
        setIcon(null);
      }
    };
    loadIcon();
  }, [name]);

  if (error) {
    console.error(error);
    return null; // or a placeholder
  }
  if (!icon) return null;

  return <>{React.createElement(icon, { ...rest, size })}</>;
};

export default DynamicReactIcon;
