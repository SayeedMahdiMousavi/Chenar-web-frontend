import React from 'react';

import PropTypes from 'prop-types';

const PrivateComponent = React.memo(
  (props) => {
    return <props.Component {...props.props} />;
  },
  (prevProps, nextProps) => prevProps.collapsed !== nextProps.collapsed,
);

PrivateComponent.displayName = 'PrivateComponent';

PrivateComponent.propTypes = {
  Component: PropTypes.elementType.isRequired,
  props: PropTypes.object,
  collapsed: PropTypes.bool,
};

export default PrivateComponent;
