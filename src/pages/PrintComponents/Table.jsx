// import React from "react";
// import { Text, StyleSheet, View } from "@react-pdf/renderer";
// const PDFTable = ({ children, col, columns }: any) => (
//   <View style={styles.tableContainer}>
//     <View style={styles.tableContent}>
//       <View style={styles.table}>
//         <View style={styles.tableRow}>
//           {columns.map((column: any) => (
//             <View style={styles.th}>
//               <Text>{column?.title}</Text>
//             </View>
//           ))}
//         </View>
//         {children.map((row: any, ind: any) => (
//           <View
//             key={ind}
//             style={[styles.tableRow, columns && ind === 0 ? styles.em : {}]}
//           >
//             {row.map((cell: any, j: any) => (
//               <View
//                 key={j}
//                 style={[styles.cell, { width: col[j], height: 40 }]}
//               >
//                 {typeof cell === "string" || typeof cell === "number" ? (
//                   <Text>{cell}</Text>
//                 ) : (
//                   cell
//                 )}
//               </View>
//             ))}
//           </View>
//         ))}
//       </View>
//     </View>
//   </View>
// );

// export default PDFTable;

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Page,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Td is expected to be used with Tr and Table to make a table like in HTML
const Td = ({ children, style }) => (
  <View style={style}>
    <Text>{children}</Text>
  </View>
);
Td.propTypes = {
  style: PropTypes.object, // Look here for supported css properties and values - https://react-pdf.org/styling#valid-css-properties
  children: PropTypes.node, // Only use these components - https://react-pdf.org/components - but except Document and Page.
};
const Tr = ({ children, style }) => <View style={style}>{children}</View>;
Tr.propTypes = {
  style: PropTypes.object, // Look here for supported css properties and values - https://react-pdf.org/styling#valid-css-properties
  children: PropTypes.arrayOf(PropTypes.element), // Use Tr as tr in html
};
const Table = ({
  dataSource,
  columns,
  headerRowStyle = {},
  tableStyle = {},
  cellStyle = styles.cell,
  headerCellStyle = styles.headerCell,
  rowStyle = {
    display: 'tableRow',
    verticalAlign: 'inherit',
    borderColor: 'inherit',
  },
  tableBorder = '1px solid #f0f0f0',
  tableHzMargin = 0,
  tableVtMargin = 0,
  tablePadding = 0,
  cellHzPadding = 10,
  cellVtPadding = 8,
  renderer: { onHeaderCell = null, onCell = null } = {},
}) => {
  if (!dataSource) return <View />;
  const cellWidth = `${100 / columns.length}%`;
  const tableStyles = StyleSheet.create({
    table: {
      ...tableStyle,
      marginHorizontal: tableHzMargin,
      marginVertical: tableVtMargin,
      fontSize: '12px',
      padding: tablePadding,
      border: tableBorder,
    },
    row: { ...rowStyle, flexDirection: 'row', borderBottom: tableBorder },
    lastRow: {
      borderBottom: 0,
    },
    col: {
      ...cellStyle,
      width: cellWidth,
      borderLeft: tableBorder,
      textAlign: 'justify',
      justifyContent: 'flex-start',
      paddingHorizontal: cellHzPadding,
      paddingVertical: cellVtPadding,
    },
    firstCol: {
      borderLeft: 0,
    },
    lastCol: {
      borderRight: 0,
    },
    headerRow: {
      fontWeight: 800,
      ...headerRowStyle,
    },
  });
  return (
    <View style={tableStyles.table}>
      <Tr
        style={{ ...tableStyles.headerRow, ...tableStyles.row }}
        key='header-row'
      >
        {columns.map((col, ind) => {
          let header = col['title'] || col['dataIndex'];
          return (
            <Td
              key={`header-cell-${header}`}
              style={{
                ...headerCellStyle,
                ...tableStyles.col,
                ...(ind === columns.length - 1
                  ? tableStyles.lastCol
                  : ind === 0
                    ? tableStyles.firstCol
                    : {}),
                ...(col['align'] ? { textAlign: col['align'] } : {}),
                ...(col['justifyContent']
                  ? { textAlign: col['justifyContent'] }
                  : {}),
              }}
            >
              {onHeaderCell ? onHeaderCell(col) : header}
            </Td>
          );
        })}
      </Tr>
      {dataSource?.map((rec, recInd) => {
        return (
          <Tr
            key={recInd}
            style={{
              ...tableStyles.row,
              ...(recInd === dataSource.length - 1 ? tableStyles.lastRow : {}),
            }}
          >
            {columns?.map((col, ind) => {
              let dataIndex = col['dataIndex'];
              return (
                <Td
                  key={`row-cell-${dataIndex}`}
                  style={{
                    ...tableStyles.col,
                    ...(ind === columns.length - 1
                      ? tableStyles.lastCol
                      : ind === 0
                        ? tableStyles.firstCol
                        : {}),
                    ...(col['align'] ? { textAlign: col['align'] } : {}),
                  }}
                >
                  {onCell ? onCell(rec) : rec[dataIndex]}
                </Td>
              );
            })}
          </Tr>
        );
      })}
    </View>
  );
};

Table.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired, // One object represent one record with property-name defined by columns prop
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      align: PropTypes.string, // see css align property
      justifyContent: PropTypes.string, // see css justify-content property
    }),
  ).isRequired,
  // restricted styling of various inner children of the table
  headerRowStyle: PropTypes.object,
  tableStyle: PropTypes.object,
  cellStyle: PropTypes.object,
  headerCellStyle: PropTypes.object,
  rowStyle: PropTypes.object,
  // collective styling of the table
  tableBorder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tableHzMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tableVtMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tablePadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cellHzPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cellVtPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // for facilitating an element inside and header-cell or row-cell
  renderer: PropTypes.shape({
    onCell: PropTypes.func, // for row-cell
    onHeaderCell: PropTypes.func, // for header-cell
  }),
};
export const PagedTable = ({
  tableProps: { dataSource = [], columns, ...restTableProps },
  style = {},
  perPage = 20,
  footerStyle,
  ...rest
}) => {
  let pages = [];
  for (let i = 0; i < dataSource.length; i += perPage) {
    pages.push(
      <Page key={i} {...rest}>
        <Table
          dataSource={dataSource.slice(i, i + perPage)}
          columns={columns}
          style={style}
          {...restTableProps}
        />
        <Text
          style={footerStyle}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>,
    );
  }
  return pages;
};
PagedTable.propTypes = {
  tableProps: PropTypes.object.isRequired, // various table props
  style: PropTypes.object, // style properties
  perPage: PropTypes.number, // defines record in each page; optimised
  footerStyle: PropTypes.object, // style property for the page-footer showing page numbers
};
export const ExportPDF = ({
  loader,
  style = {},
  document,
  fileName = 'reports.pdf',
  errorTitle,
  loading,
  title,
}) => {
  if (loading) return loader || null;
  return (
    <PDFDownloadLink style={style} document={document} fileName={fileName}>
      {({
        // blob, url,
        loading,
        error,
      }) => {
        if (error) {
          return errorTitle || 'Error!';
        }
        return loading
          ? loader || 'Loading document...'
          : title || 'Download now!';
      }}
    </PDFDownloadLink>
  );
};
ExportPDF.propTypes = {
  loader: PropTypes.node, // a spinner like element
  loading: PropTypes.bool, // shows if the async action is being completed
  document: PropTypes.element, // A Document from @react-pdf/renderer
  errorTile: PropTypes.string, // string indicating error
  title: PropTypes.string, // string that shows when pdf is ready to be downloaded
};

const styles = StyleSheet.create({
  tableContainer: {
    border: '1px solid #f0f0f0',
    borderRight: 0,
    borderBottom: 0,
  },
  tableContent: {
    overflow: 'hidden',
  },
  th: {
    padding: '12px 8px',
    background: '#FAFAFA',
    position: 'relative',
    color: '#000000d9',
    fontWeight: 500,
    textAlign: 'left',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background .3s ease',
  },
  thRow: {
    display: 'flex',
    verticalAlign: 'inherit',
    borderColor: 'inherit',
  },
  em: {
    fontStyle: 'bold',
  },
  table: {
    // clear: "both",
    maxWidth: '100%',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    // marginVertical: 12,
    fontSize: '14px',
    margin: 0,
    padding: 0,
    color: `rgba(0, 0, 0, 0.85)`,
    fontVariant: 'tabularNums',
    lineHeight: 1.5715,
    listStyle: 'none',
    webkitFontFeatureSettings: 'tnum',
    fontFeatureSettings: 'tnum',
    position: 'relative',
    background: '#fff',
    borderRadius: '2px',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerCell: {
    position: 'relative',
    color: '#000000d9',
    fontWeight: 'bold',
    transition: 'background .3s ease',
    flexWrap: 'wrap',
  },
  cell: {
    position: 'relative',
    color: '#000000d9',
    transition: 'background .3s ease',
    flexWrap: 'wrap',
  },
});
export default Table;
