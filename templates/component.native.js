const template = ({ imports, interfaces, componentName, props, jsx, exports }, { tpl }) => {
    const cleanComponentName = componentName.replace("Svg", "");

    return tpl`${imports};
import type { FC } from 'react';

interface Props extends SvgProps {
    color?: string;
    size?: number;
}
${interfaces};

export const ${cleanComponentName}:FC<Props> = ({size=24,color='currentColor',...props}) => (
    ${jsx}
);
${cleanComponentName}.displayName = '${cleanComponentName}';`;
};

module.exports = template;
