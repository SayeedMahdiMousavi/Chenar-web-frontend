import React, { Component } from 'react';
import { Row, Col, Typography } from 'antd';
import ProductBarcode from './ProductBarcode';
export default class ProductLabelPrint extends Component {
  render() {
    const getPageMargins = () => {
      return `@page { margin: 0mm 0mm !important; }`;
    };
    return (
      <Row
        //
        style={{
          paddingInlineEnd: '12px',
          paddingInlineStart: '14px',
          // width: "4in",
        }}
        // align="middle"
      >
        <style>{getPageMargins()}</style>
        {this?.props?.products?.map((item, index) => {
          return (
            <Col key={index}>
              <Row
                gutter={
                  this?.props?.type === '10'
                    ? [7, 10.86]
                    : this?.props?.type === '8'
                      ? [7, 7]
                      : [7, 10.86]
                }
              >
                {item?.map((item1) => (
                  <Col
                    span={12}
                    key={item1?.id}
                    style={
                      this?.props?.type === '10'
                        ? {
                            height: '0.77in',

                            // height: "0.991in",
                            width: '3.15in',
                            // paddingTop: "1px",
                          }
                        : this?.props?.type === '8'
                          ? {
                              height: '0.9454in',
                              width: '3.15in',
                              // paddingTop: "1px",
                            }
                          : {
                              height: '0.77in',

                              // height: "0.991in",
                              width: '3.15in',
                              // paddingTop: "1px",
                            }
                    }
                  >
                    {/* <Row style={{ height: "100%" }} align="middle">
              <Col span={24}> */}
                    <Row justify='center'>
                      <Col
                        style={
                          this?.props?.type === '10' && { paddingTop: '5px' }
                        }
                      >
                        <Typography.Title
                          level={5}
                          style={{
                            fontSize: '10px',
                            marginBottom: '1px',
                            color: 'black',
                          }}
                        >
                          ANAR SUPERMARKETS
                        </Typography.Title>
                      </Col>{' '}
                    </Row>
                    <Row justify='center'>
                      <Col style={{ textAlign: 'center' }}>
                        <Typography.Text
                          strong={true}
                          style={{
                            fontSize: '8px',
                            textAlign: 'center',
                            width: '130px',
                            color: 'black',
                          }}
                          ellipsis={{ rows: 2 }}
                        >
                          {item1?.name}
                        </Typography.Text>
                      </Col>{' '}
                    </Row>
                    <Row justify='center' className='num'>
                      <Col>
                        <ProductBarcode
                          value={item1?.barcode}
                          width={1}
                          height={19}
                          fontSize={11}
                          fontOptions='bold'
                          marginTop={3}
                          marginBottom={3}
                          background='white'
                          lineColor='black'
                          displayValue={true}
                        />
                      </Col>{' '}
                    </Row>
                    {/* </Col>{" "}
            </Row> */}
                  </Col>
                ))}
              </Row>
            </Col>
          );
        })}
      </Row>
    );
  }
}
