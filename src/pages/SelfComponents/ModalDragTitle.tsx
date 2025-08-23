import React, { ReactNode } from 'react';
interface IProps {
  title: ReactNode;
  disabled: boolean;
  setDisabled: (value: boolean) => void;
}

export const ModalDragTitle: React.FC<IProps> = (props) => {
  const handelOnMouseOver = () => {
    if (props.disabled) {
      props.setDisabled(false);
    }
  };
  const handelOnMouseOut = () => {
    props.setDisabled(true);
  };
  return (
    <div
      className='drag_modal'
      onMouseOver={handelOnMouseOver}
      onMouseOut={handelOnMouseOut}
      onFocus={() => {}}
      onBlur={() => {}}
    >
      {props.title}
    </div>
  );
};
