import React, { Component } from "react";
import { Row, Col, Typography } from "antd";
import ProductBarcode from "./ProductBarcode";
import { QRCodeCanvas } from "qrcode.react";
// import { arabicToIndian } from "../../Functions/arabicToIndian";
// import { print, math } from "../../Functions/math";
import Vip from "../../assets/svg/vip";
export default class PriceLabel extends Component {
  render() {
    // const findDefaultBarcode = (barcodeList, baseUnit) => {
    //   const item = barcodeList?.find(
    //     (item) =>
    //       item?.default === true && item?.unit?.id === baseUnit?.unit?.id
    //   );
    //   if (item?.barcode) {
    //     return { barcode: item?.barcode, unitId: item?.unit?.id };
    //   } else {
    //     const item = barcodeList?.find((item) => item?.default === true);

    //     if (item?.barcode) {
    //       return { barcode: item?.barcode, unitId: item?.unit?.id };
    //     } else {
    //       const item = barcodeList?.find(
    //         (item) => item?.unit?.id === baseUnit?.unit?.id
    //       );
    //       return item?.barcode
    //         ? { barcode: item?.barcode, unitId: item?.unit?.id }
    //         : {
    //             barcode: barcodeList?.[0]?.barcode,
    //             unitId: barcodeList?.[0]?.barcode?.unit?.id,
    //           };
    //     }
    //   }
    // };
    const getPageMargins = () => {
      return `@page { margin: 5.1mm 0mm !important; }`;
    };
    return (
      <Row
        justify="space-between"
        // gutter={[0, 5]}
        gutter={[0, 13.5]}
        style={{ padding: "0px 70px" }}
      >
        <style>{getPageMargins()}</style>
        {/* gutter={[0, 33.2]} */}
        {this?.props?.products
          // ?.filter((item) => {
          //   // const baseUnit = item?.product_units?.find(
          //   //   (item) => item?.base_unit === true
          //   // );
          //   // const barcode = item?.product_barcode?.find(
          //   //   (item) => item?.unit?.id === baseUnit?.unit?.id
          //   // );
          //   if (item?.product_barcode?.length !== 0) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // })
          ?.map((item) => {
            // const baseUnit = item?.price?.find((item) =>
            //   item?.unit_pro_relation?.includes("base_unit")
            // );
            // const { barcode, unitId } = findDefaultBarcode(
            //   item?.product_barcode,
            //   baseUnit
            // );
            // const unit = item?.price?.find((item) => item?.unit === unitId);

            // const price = arabicToIndian(parseInt(unit?.sales_rate));

            // const vipPrice =
            //   unit?.sales_rate &&
            //   unit?.perches_rate &&
            //   this?.props?.vipPercent &&
            //   this?.props?.vipPercent > 0
            //     ? print(
            //         math.evaluate(
            //           `(${unit?.sales_rate}-${unit?.perches_rate})*${this?.props?.vipPercent}/100`
            //         )
            //       )
            //     : 0;
            // const vipPrice1 = unit?.sales_rate
            //   ? arabicToIndian(
            //       print(
            //         math.evaluate(
            //           `(${unit?.sales_rate}-${Math.floor(vipPrice)})`
            //         )
            //       )
            //     )
            //   : arabicToIndian(0);
            // // 
            // // 
            // // 

            return (
              <Col
                //   span={12}
                key={item?.id}
                style={
                  // item?.is_have_vip_price
                  //   ? {
                  //       width: "78.75mm",
                  //       height: "122px",
                  //       borderRadius: "15px",
                  //       background: "#E73243",
                  //     }
                  //   :
                  {
                    width: "78.75mm",
                    height: "122px",
                    border: "1px solid #cecccc",
                  }
                }
                className="price-label"
              >
                {!item?.is_have_vip_price ? (
                  <Row>
                    <Col
                      span={24}
                      style={{
                        height: "59px",
                      }}
                    >
                      <Row style={{ height: "100%" }}>
                        <Col span={17} style={{ backgroundColor: "#E73243" }}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            // justify={
                            //   item?.name?.length > 26 ? "center" : undefined
                            // }
                            justify="center"
                            align="middle"
                          >
                            <Col
                              style={
                                item?.name?.length > 26
                                  ? { textAlign: "center" }
                                  : {}
                              }
                            >
                               
                              <Typography.Paragraph
                                strong={true}
                                ellipsis={{ rows: 2 }}
                                style={{
                                  color: "white",
                                  margin: "0px",
                                  fontFamily: "IRANYekanExtraBold",
                                }}
                              >
                                {item?.name}
                              </Typography.Paragraph>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={7} style={{ backgroundColor: "#FFCC00" }}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            align="middle"
                            justify="center"
                          >
                            <Col>
                              <Typography.Title
                                level={
                                  item?.price?.toString()?.length > 3
                                    ? 4
                                    : item?.price?.toString()?.length > 2
                                    ? 3
                                    : 2
                                }
                                style={{
                                  // color: "white",
                                  fontFamily: "BTITR",
                                  marginBottom: "0px",
                                }}
                              >
                                {item?.price}
                                <span
                                  style={{
                                    fontFamily: "BTITR",
                                    fontSize: "16px",
                                  }}
                                >
                                  {" "}
                                  ؋
                                </span>
                              </Typography.Title>
                            </Col>
                          </Row>
                        </Col>
                      </Row>{" "}
                    </Col>
                    <Col span={24} style={{ height: "61px" }}>
                      <Row>
                        <Col span={17}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            // justify={
                            //   item?.name?.length > 26 ? "center" : undefined
                            // }
                            justify="center"
                            align="middle"
                          >
                            <Col
                              style={
                                item?.name?.length > 26
                                  ? { textAlign: "center" }
                                  : {}
                              }
                            >
                              <ProductBarcode
                                value={item?.barcode}
                                width={1}
                                height={30}
                                fontSize={10}
                                fontOptions="bold"
                                marginTop={3}
                                marginBottom={3}
                                marginRight={5}
                                marginLeft={5}
                                background="#fff"
                                lineColor="black"
                                displayValue={true}
                                // format="EAN13"
                                // flat={true}
                              />
                            </Col>
                          </Row>{" "}
                        </Col>
                        <Col span={7}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            // align="middle"
                            justify="center"
                          >
                            <Col>
                              <QRCodeCanvas 
                                style={{
                                  width: "47px",
                                  height: "47px",
                                  background: "white",
                                  padding: "4px",
                                  marginTop: "-15px",
                                }}
                                value={item?.barcode ? item?.barcode : "www"}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col
                      span={24}
                      style={{
                        height: "59px",
                      }}
                    >
                      <Row style={{ height: "100%" }}>
                        <Col span={17} style={{ backgroundColor: "#E73243" }}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            // justify={
                            //   item?.name?.length > 26 ? "center" : undefined
                            // }
                            justify="center"
                            align="middle"
                          >
                            <Col
                              style={
                                item?.name?.length > 26
                                  ? { textAlign: "center" }
                                  : {}
                              }
                            >
                              <Typography.Paragraph
                                strong={true}
                                ellipsis={{ rows: 2 }}
                                style={{
                                  color: "white",
                                  margin: "0px",
                                  fontFamily: "IRANYekanExtraBold",
                                }}
                              >
                                {item?.name}
                              </Typography.Paragraph>
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          span={7}
                          style={{ backgroundColor: "#FFF" }}
                          //  style={{ backgroundColor: "#FFCC00" }}
                        >
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            align="middle"
                            justify="center"
                          >
                            <Col>
                              <Typography.Title
                                level={
                                  item?.price?.toString()?.length > 3
                                    ? 4
                                    : item?.price?.toString()?.length > 2
                                    ? 3
                                    : 2
                                }
                                style={{
                                  // color: "white",
                                  fontFamily: "BTITR",
                                  marginBottom: "0px",
                                }}
                                // delete
                              >
                                {item?.price}
                                <span
                                  style={{
                                    fontFamily: "BTITR",
                                    fontSize: "16px",
                                  }}
                                >
                                  {" "}
                                  ؋
                                </span>
                              </Typography.Title>
                            </Col>
                          </Row>
                        </Col>
                      </Row>{" "}
                    </Col>
                    <Col span={24} style={{ height: "61px" }}>
                      <Row>
                        <Col span={12}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            // justify={
                            //   item?.name?.length > 26 ? "center" : undefined
                            // }
                            justify="center"
                            align="middle"
                          >
                            <Col
                              style={
                                item?.name?.length > 26
                                  ? { textAlign: "center" }
                                  : {}
                              }
                            >
                              <ProductBarcode
                                value={item?.barcode}
                                width={1}
                                height={30}
                                fontSize={10}
                                fontOptions="bold"
                                marginTop={3}
                                marginBottom={3}
                                marginRight={5}
                                marginLeft={5}
                                background="#fff"
                                lineColor="black"
                                displayValue={true}
                                // format="EAN13"
                                // flat={true}
                              />
                            </Col>
                          </Row>{" "}
                        </Col>
                        <Col span={5}>
                          <Row
                            style={{
                              height: "100%",
                              padding: "5px",
                            }}
                            // align="middle"
                            justify="center"
                          >
                            <Col>
                              <QRCodeCanvas 
                                style={{
                                  width: "47px",
                                  height: "47px",
                                  background: "white",
                                  padding: "4px",
                                  // marginTop: "-15px",
                                }}
                                value={item?.barcode ? item?.barcode : "www"}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          span={7}
                          style={{ backgroundColor: "#0D1D30" }}
                          //  style={{ backgroundColor: "#0D1D30" }}
                        >
                          <Row>
                            <Col
                              span={24}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "end",
                              }}
                            >
                              <Vip
                                style={{
                                  width: "45%",
                                  paddingInlineStart: "3px",
                                  paddingTop: "2px",
                                }}
                              />
                            </Col>
                            <Col span={24}>
                              <Row justify="center">
                                <Col>
                                  <Typography.Title
                                    level={
                                      item?.price?.toString()?.length > 3
                                        ? 4
                                        : 3
                                    }
                                    style={{
                                      color: "#FDBF3C",
                                      fontFamily: "BTITR",
                                      marginBottom: "0px",
                                    }}
                                  >
                                    {item?.vipPrice}
                                    <span
                                      style={{
                                        fontFamily: "AdobeArabicRegular",
                                      }}
                                    >
                                      {" "}
                                      ؋
                                    </span>
                                  </Typography.Title>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  // <Row style={{ height: "102%" }}>
                  //   <Col
                  //     span={17}
                  //     style={{
                  //       height: "59px",
                  //       paddingInlineStart: "12px",
                  //       paddingTop: "9px",
                  //       paddingBottom: "7px",
                  //     }}
                  //   >
                  //     <Row
                  //       style={{
                  //         height: "100%",
                  //       }}
                  //       justify={item?.name?.length > 26 ? "center" : undefined}
                  //       // align="middle"
                  //     >
                  //       <Col
                  //         style={
                  //           item?.name?.length > 26
                  //             ? { textAlign: "center" }
                  //             : {}
                  //         }
                  //       >
                  //         <Typography.Paragraph
                  //           strong={true}
                  //           ellipsis={{ rows: 2 }}
                  //           style={{
                  //             color: "white",
                  //             margin: "0px",
                  //             fontFamily: "IRANYekanExtraBold",
                  //           }}
                  //         >
                  //           {item?.name}
                  //         </Typography.Paragraph>
                  //       </Col>
                  //     </Row>
                  //   </Col>
                  //   <Col
                  //     span={7}
                  //     style={{
                  //       height: "59px",
                  //       padding: "4px",
                  //     }}
                  //   >
                  //     <Row
                  //       style={{
                  //         height: "100%",
                  //       }}
                  //       align="middle"
                  //       justify="center"
                  //     >
                  //       <Col>
                  //         <Typography.Title
                  //           level={
                  //             price?.toString()?.length > 3
                  //               ? 4
                  //               : price?.toString()?.length > 2
                  //               ? 3
                  //               : 2
                  //           }
                  //           style={{
                  //             color: "white",
                  //             fontFamily: "BTITR",
                  //           }}
                  //         >
                  //           {price}
                  //           <span style={{ fontFamily: "AdobeArabicRegular" }}>
                  //             {" "}
                  //             ؋
                  //           </span>
                  //         </Typography.Title>
                  //       </Col>
                  //     </Row>
                  //   </Col>
                  //   <Col
                  //     span={17}
                  //     style={{
                  //       height: "61px",
                  //       padding: "7px",
                  //       paddingInlineEnd: "4",
                  //     }}
                  //   >
                  //     {item?.is_have_vip_price ? (
                  //       <Row
                  //         style={{
                  //           height: "100%",
                  //         }}
                  //         align="bottom"
                  //         justify="space-between"
                  //       >
                  //         <Col style={{ paddingInlineStart: "3px" }} span={18}>
                  //           <ProductBarcode
                  //             value={barcode}
                  //             width={1}
                  //             height={30}
                  //             fontSize={10}
                  //             fontOptions="bold"
                  //             marginTop={3}
                  //             marginBottom={3}
                  //             marginRight={5}
                  //             marginLeft={5}
                  //             background="#fff"
                  //             lineColor="black"
                  //             displayValue={true}
                  //             // format="EAN13"
                  //             // flat={true}
                  //           />
                  //         </Col>
                  //         <Col span={6}>
                  //           {" "}
                  //           <{ QRCodeCanvas }
                  //             style={{
                  //               width: "47px",
                  //               height: "47px",
                  //               background: "white",
                  //               padding: "4px",
                  //             }}
                  //             value={barcode ? barcode : "www"}
                  //           />
                  //         </Col>
                  //       </Row>
                  //     ) : (
                  //       <Row
                  //         style={{
                  //           height: "100%",
                  //         }}
                  //         align="bottom"
                  //         justify="start"
                  //       >
                  //         <Col
                  //           style={{
                  //             height: "47px",
                  //             paddingInlineStart: "6px",
                  //           }}
                  //         >
                  //           <ProductBarcode
                  //             value={barcode}
                  //             width={1}
                  //             height={30}
                  //             fontSize={10}
                  //             fontOptions="bold"
                  //             marginTop={3}
                  //             marginBottom={3}
                  //             marginRight={5}
                  //             marginLeft={5}
                  //             background="#fff"
                  //             lineColor="black"
                  //             displayValue={true}
                  //             // format="EAN13"
                  //             // flat={true}
                  //           />
                  //         </Col>
                  //       </Row>
                  //     )}
                  //   </Col>
                  //   <Col
                  //     span={7}
                  //     style={
                  //       item?.is_have_vip_price
                  //         ? {
                  //             height: "61px",
                  //             padding: "5px",
                  //             backgroundColor: "#0D1D30",
                  //             borderRadius: "0px 15px",
                  //           }
                  //         : {
                  //             height: "61px",
                  //             padding: "5px",
                  //           }
                  //     }
                  //   >
                  //     <Row
                  //       style={{
                  //         height: "100%",
                  //       }}
                  //       align="bottom"
                  //       justify="center"
                  //     >
                  //       <Col>
                  //         {item?.is_have_vip_price ? (
                  //           // <img
                  //           //   src={require("../../assets/svg/vip.svg")}
                  //           //   alt="fldkksf"
                  //           //   width="80%"
                  //           //   height="20%"

                  //           // />

                  //           <Row>
                  //             <Col
                  //               span={24}
                  //               style={{
                  //                 display: "flex",
                  //                 flexDirection: "column",
                  //                 justifyContent: "end",
                  //               }}
                  //             >
                  //               <Vip
                  //                 style={{
                  //                   width: "45%",
                  //                   paddingInlineStart: "3px",
                  //                   paddingTop: "2px",
                  //                 }}
                  //               />
                  //             </Col>
                  //             <Col span={24}>
                  //               <Row justify="center">
                  //                 <Col>
                  //                   <Typography.Title
                  //                     level={
                  //                       price?.toString()?.length > 3 ? 4 : 3
                  //                     }
                  //                     style={{
                  //                       color: "#FDBF3C",
                  //                       fontFamily: "BTITR",
                  //                       marginBottom: "0px",
                  //                     }}
                  //                   >
                  //                     {vipPrice1}
                  //                     <span
                  //                       style={{
                  //                         fontFamily: "AdobeArabicRegular",
                  //                       }}
                  //                     >
                  //                       {" "}
                  //                       ؋
                  //                     </span>
                  //                   </Typography.Title>
                  //                 </Col>
                  //               </Row>
                  //             </Col>
                  //           </Row>
                  //         ) : (
                  //           <{ QRCodeCanvas }
                  //             style={{
                  //               width: "47px",
                  //               height: "47px",
                  //               background: "white",
                  //               padding: "4px",
                  //             }}
                  //             value={barcode ? barcode : "www"}
                  //           />
                  //         )}
                  //       </Col>
                  //     </Row>
                  //   </Col>
                  // </Row>
                )}
              </Col>
            );
          })}
      </Row>
    );
  }
}
