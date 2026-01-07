import { FC, SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}
declare const Clipboard: FC<Props>;

export { Clipboard };
