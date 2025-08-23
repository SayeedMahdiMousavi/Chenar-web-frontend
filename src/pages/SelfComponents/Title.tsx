import React, { useState } from 'react';
import { Typography, Affix } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { checkPermissions } from '../../Functions';

interface IProps {
  value: string;
  model?: string;
}

export const Title: React.FC<IProps> = ({ value, model }) => {
  const [mode] = useDarkMode();
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniTablet1 = useMediaQuery('(max-width:576px)');
  const [isAffix, setIsAffix] = useState(false);

  const handleChangeAffix = (value: any) => {
    setIsAffix(value);
  };

  return Boolean(model) && !checkPermissions(`view_${model}`) ? null : (
    <Affix
      offsetTop={-53}
      target={() => document.getElementById('mainComponent')}
      onChange={handleChangeAffix}
    >
      <div>
        <Typography.Title
          level={isAffix ? 5 : isMobile ? 5 : isMiniTablet1 ? 4 : 3}
          style={styles.title(isAffix, mode)}
        >
          {startCase(value)}
        </Typography.Title>
      </div>
    </Affix>
  );
};
const styles = {
  title: (isAffix: boolean, mode: 'dark' | 'light') => ({
    marginBottom: '5px',
    marginInlineStart: isAffix ? '10px' : '',
    backgroundColor: isAffix ? (mode === 'dark' ? '#001529' : 'white') : '',
    padding: isAffix ? '7px ' : '',
    width: isAffix ? '350px ' : '',
    color: mode === 'dark' ? 'white' : '#001529',
  }),
};

function startCase(str: string) {
  return str
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
