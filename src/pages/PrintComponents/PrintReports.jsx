/* eslint-disable react/display-name */
import React, { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import font from "../../fonts/IRANYekanRegular.ttf";
import {
  Document,
  Font,
  Page,
  Text,
  Image,
  StyleSheet,
  Canvas,
  View,

  //   Table,
} from "@react-pdf/renderer";

import { useTranslation } from "react-i18next";
import { Button, Modal } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import PDFTable from "./Table.js";

export default (props) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Register font
  Font.register({
    family: "IRAN_YEKAN_REGULAR",
    src: font,
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const tableContent = (
    <View style={styles.table}>
      {/* TableHeader */}
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Product</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Type</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Period</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Price</Text>
        </View>
      </View>
      {/* TableContent */}
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>ایه </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>3 User </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>
            {" "}
            گمان می‌رود که این مقاله ناقض حق تکثیر باشد، اما بدون داشتن منبع
            امکان تشخیص قطعی این موضوع وجود ندارد. اگر می‌توان نشان داد که این
            مقاله حق نشر را زیر پا گذاشته است، لطفاً مقاله را در
            ویکی‌پدیا:مشکلات حق تکثیر فهرست کنید. اگر مطمئنید که مقاله ناقض حق
            تکثیر نیست، شواهدی را در این زمینه در همین صفحهٔ بحث فراهم آورید.
            خواهشمندیم این برچسب را بدون گفتگو برندارید. (مه ۲۰۱۶)
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>5€</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Button
        onClick={showModal}
        type="link"
        size="middle"
        shape="round"
        // disabled={selectedRows?.length === 0}
        icon={
          <PrinterOutlined
          // disabled={selectedRows?.length === 0}
          />
        }
      />
      <Modal
        maskClosable={false}
        title={props.title}
        open={isModalVisible}
        onOk={handleOk}
        width={600}
        onCancel={handleCancel}
        bodyStyle={{ padding: "0px 10px", height: "500px" }}
      >
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page style={styles.body}>
              <Text style={styles.title} fixed>
                {props.title}
              </Text>
              {tableContent}
              <PDFTable
                columns={[
                  { title: "Name", dataIndex: "name" },
                  { title: "Age", dataIndex: "age" },
                  {
                    title: t("Form.Address"),
                    dataIndex: "address",
                  },
                ]}
                dataSource={[
                  { name: "massoud", age: "23", address: "shar now" },
                ]}
                // col={["20%", "60%", "20%"]}
                // children={[
                //   ["fasd", "afs", "fasd"],
                //   ["1", "2", "3"],
                //   ["4", "5", "6"],
                //   ["7", "8", "9"],
                // ]}
              />
              <Text style={styles.title}>شهر شیندند آدرس</Text>
              <Text style={styles.author}></Text>
              <Text style={styles.title}>
                {" "}
                گمان می‌رود که این مقاله ناقض حق تکثیر باشد، اما بدون داشتن منبع
                امکان تشخیص قطعی این موضوع وجود ندارد. اگر می‌توان نشان داد که
                این مقاله حق نشر را زیر پا گذاشته است، لطفاً مقاله را در
                ویکی‌پدیا:مشکلات حق تکثیر فهرست کنید. اگر مطمئنید که مقاله ناقض
                حق تکثیر نیست، شواهدی را در این زمینه در همین صفحهٔ بحث فراهم
                آورید. خواهشمندیم این برچسب را بدون گفتگو برندارید. (مه ۲۰۱۶)
              </Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.title}>Don Quijote de la Mancha</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text
                fixed
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} / ${totalPages}`
                }
              />
            </Page>
          </Document>
        </PDFViewer>
      </Modal>
    </>
  );
};

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  em: {
    fontStyle: "bold",
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  table: {
    width: "100%",
    borderWidth: 2,
    display: "flex",
    flexDirection: "column",
    marginVertical: 12,
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  cell: {
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    flexWrap: "wrap",
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  //   table: {
  //     display: "table",
  //     width: "auto",
  //     borderStyle: "solid",
  //     borderWidth: 1,
  //     borderRightWidth: 0,
  //     borderBottomWidth: 0,
  //   },
  //   tableRow: { margin: "auto", flexDirection: "row" },
  //   tableCol: {
  //     width: "25%",
  //     borderStyle: "solid",
  //     borderWidth: 1,
  //     borderLeftWidth: 0,
  //     borderTopWidth: 0,
  //   },
  //   tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  body: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 15,
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",

    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontFamily: "IRAN_YEKAN_REGULAR",
  },
});
