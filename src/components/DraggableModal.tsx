import React, { ReactNode, useState } from "react";
import { Modal, ModalProps } from "antd";
import { ModalDragTitle } from "../pages/SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { useMediaQuery } from "../pages/MediaQurey";
import { Styles } from "../pages/styles";

interface IProps extends ModalProps {
  children: ReactNode;
}

export function DraggableModal({
  title,
  children,
  style,
  bodyStyle,
  ...rest
}: IProps) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");

  return (
    <Modal
      maskClosable={false}
      title={
        <ModalDragTitle
          disabled={disabled}
          setDisabled={setDisabled}
          title={title}
        />
      }
      modalRender={(modal) => (
        <Draggable disabled={disabled}>{modal}</Draggable>
      )}
      style={{ ...Styles.modal(isMobile), ...style }}
      bodyStyle={{
        ...Styles.modalBody(isMobile, isSubBase, isMiniTablet),
        ...bodyStyle,
      }}
      destroyOnClose
      centered
      {...rest}
    >
      {children}
    </Modal>
  );
}
