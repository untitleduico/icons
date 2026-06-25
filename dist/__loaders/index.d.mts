import { FC, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}
type IconLoader = () => Promise<{
    default: FC<IconProps>;
}>;
declare const loadIcon: (name: string) => IconLoader;

export { type IconLoader, loadIcon };
