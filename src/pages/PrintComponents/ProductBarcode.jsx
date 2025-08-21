import React from "react";
import Barcode from "react-barcode";
const ProductBarcode = (props) => {
  return (
    <Barcode
      value={props?.value}
      width={props.width}
      height={props.height}
      fontSize={props.fontSize}
      fontOptions={props.fontOptions}
      marginTop={props.marginTop}
      marginBottom={props.marginBottom}
      format={props.format}
      background={props.background}
      lineColor={props.lineColor}
      displayValue={props.displayValue}
      marginRight={props.marginRight}
      marginLeft={props.marginLeft}
    />
  );
};

export default ProductBarcode;
