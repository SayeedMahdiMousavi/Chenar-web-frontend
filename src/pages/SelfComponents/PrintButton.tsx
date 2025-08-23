import React, { useRef } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
//@ts-ignore
import { Previewer } from 'pagedjs';
import PrintTable from '../PrintComponents/PrintTable';
import { ReactNode } from 'react';
export const pageStyle = `
// @page { 
//   size: auto;  margin: 0mm 5mm 5mm 5mm; } @media print { body { -webkit-print-color-adjust: exact; } }
// .page-footer, .page-footer-space {
//   height: 50px;

// }

// .page-footer {
//   position: fixed;
//   bottom: 0;
//   width: 100%;
//   border-top: 1px solid black; /* for demo */
//   // background: yellow; /* for demo */
// }

// .page-header {
//   position: fixed;
//   top: 0mm;
//   width: 100%;
//   border-bottom: 1px solid black; /* for demo */
//   // background: yellow; /* for demo */
// }

// .page {
//   page-break-after: always;
// }

 @page {
  // margin: 5mm 5mm 5mm 5mm;
  // margin: 4mm 7mm;
};

// @media print {

//    tfoot {display: table-footer-group;}
   
//    button {display: none;}
   
//    body {margin: 0;}
// }
// @media screen {
//   div.page-footer {
//     display: none;
//   }
// }
// @media print {
//   div.page-footer {
//   position: fixed;
//   bottom:0mm;

//   width: 100%;
//   height: 50px;
//   font-size: 6pt;
//   color: #777;
//   /* For testing */
//   background: red; 
//   opacity: 0.5;
//   page-break-after: always;
//   }
//   // .page-number:before {
//   //   /* counter-increment: page; */
//   //   content: "Pagina "counter(page);
//   // }

// }
// div.body-page {
//   margin-bottom: 50px;
// }
`;

interface IProps {
  disabled: boolean;
  selectResult?: boolean;
  printRef?: any;
  domColumns?: ReactNode;
  columns?: ReactNode;
  title?: string;
  dataSource?: any[];
  filters?: ReactNode;
  resultDataSource?: any[];
  resultDomColumns?: ReactNode;
}

export default function PrintButton(props: IProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const effectiveRef = (props?.printRef ??
    printRef) as React.RefObject<HTMLElement>;

  const handlePrint = useReactToPrint({
    contentRef: effectiveRef,
    pageStyle: pageStyle,
  });

  // function PrintPanel() {

  //   var panel: any = document.getElementById("content");
  //   var printWindow: any = window.open("", "", "height=400,width=800");
  //   printWindow.document.write("<html><head><title></title>");
  //   printWindow.document.write("</head><body >");
  //   printWindow.document.write(panel.innerHTML);
  //   printWindow.document.write("</body></html>");
  //   printWindow.document.close();
  //   setTimeout(function () {
  //     printWindow.print();
  //     printWindow.close();
  //   }, 500);
  //   return false;
  // }

  // const handlePrint = () => {
  //   let paged = new Previewer();
  //   let flowText = document.querySelector(".article");
  //   // window.PagedConfig = {
  //   //   auto: false,
  //   //   after: (flow) => {
  //   //
  //   //   },
  //   // };
  //   paged.preview(flowText).then((flow: any) => {
  //     let editable = document.querySelectorAll(
  //       ".pagedjs_page .pagedjs_area > div"
  //     );
  //     for (let i = 0; i < editable.length; i++) {
  //       //@ts-ignore
  //       editable[i].setAttribute("contenteditable", false);
  //     }
  //   });
  //   //@ts-ignore
  //   window.PagedPolyfill.preview();
  // };

  return (
    <React.Fragment>
      <Button
        onClick={() => handlePrint()}
        type='link'
        style={styles.button}
        shape='circle'
        disabled={props.disabled}
        icon={<PrinterOutlined disabled={props.disabled} />}
      />
      <div className='hide-print-component' ref={printRef}>
        <PrintTable
          //@ts-ignore
          printRef={printRef}
          domColumns={props.domColumns}
          columns={props.columns}
          title={props.title}
          dataSource={props.dataSource}
          filters={props.filters}
          selectResult={props.selectResult}
          resultDataSource={props.resultDataSource}
          resultDomColumns={props.resultDomColumns}
        />
      </div>
    </React.Fragment>
  );
}

const styles = { button: { width: '26px', minWidth: '25px' } };
