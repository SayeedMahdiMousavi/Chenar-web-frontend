import React from 'react';
import { Empty, Typography } from 'antd';
import { Colors } from '../../../colors';

const EmptyFile = (props) => {
  return (
    <Empty
      className={props.class}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Typography.Text style={styles.empty}>No Data</Typography.Text>
      }
    />
  );
};
const styles = {
  empty: { color: Colors.textColor },
};
export default EmptyFile;
