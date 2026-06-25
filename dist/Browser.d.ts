import { FC, SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}
declare const Browser: FC<Props>;

export { Browser };
