import React, { useState } from 'react'
import {Row,Col,Checkbox,Button} from 'antd'
import { useTranslation } from "react-i18next";
import {UpOutlined,DownOutlined} from '@ant-design/icons'
interface VisibilityFilters {
    barcode:boolean, units:boolean, date:boolean, available:boolean, currency:boolean
}
interface Props {
setColumns:(prev:VisibilityFilters) => void
column:{
  onChangeSalary:()=>void
  onChangePhone:()=>void
  onChangeAddress:()=>void
  onChangeEmail:()=>void
  onChangeAttachment:()=>void
  onChangePhoto:()=>void
  onChangeNationalId:()=>void
  onChangeBirthDate:()=>void
  onChangeNotes:()=>void
  onChangeHireDate:()=>void
  onChangeReleased:()=>void
  onChangeGender:()=>void

}
}

 const Settings:React.FC<Props>=(props)=> {
    const { t } = useTranslation();
const [visible,setVisible]=useState(false)

  const handelVisibility=()=>{
    setVisible(!visible)
  }
    
    return (
        <div className='table__header2-setting'>
        {/* <Col span={24}> */}
        <Checkbox.Group defaultValue={["B", "A","C"]}>
        <Row className='table__header2-setting-group' gutter={[0, 10]}>
          <Col span={20} offset={2}>
            <h4>{t("Sales.Product_and_services.Columns")}</h4>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='A'
              onChange={props.column.onChangeSalary}
              className='table__header2-setting-column'
            >
             
              {t("Employees.Salary")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              name='phone'
    
              value='B'
              onChange={props.column.onChangePhone}
              className='table__header2-setting-column'
            >
              {t("Form.Phone")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='C'
              name='address'
              onChange={props.column.onChangeAddress}
              className='table__header2-setting-column'
            >
              {t("Form.Address")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='D'
              name='email'
              onChange={props.column.onChangeEmail}
              className='table__header2-setting-column'
            >
              {t("Form.Email")}
            </Checkbox>
          </Col>
       
          <Col span={20} offset={2}>
            <Checkbox
              value='E'
              onChange={props.column.onChangePhoto}
              className='table__header2-setting-column'
            >
              {t("Form.Photo")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              name='phone'
              value='F'
              onChange={props.column.onChangeNationalId}
              className='table__header2-setting-column'
            >
              {t("Sales.Customers.Form.National_id_number1")}
            </Checkbox>
          </Col>
          
     
       
      
          {/* <Col span={20} offset={2}>
            <Checkbox
              value='I'
              onChange={props.column.onChangeHireDate}
              className='table__header2-setting-column'
            >
             {t("Form.Notes")}
            </Checkbox>
          </Col> */}
          
        <Col span={24} style={styles.padding}>
          {visible && (
            <Row className="num" gutter={[0, 10]}>
              <Col span={20} offset={2}>
            <Checkbox
              value='G'
              name='address'
              onChange={props.column.onChangeBirthDate}
              className='table__header2-setting-column'
            >
              {t("Employees.BirthDate")}
            </Checkbox>
          </Col>
              <Col span={20} offset={2}>
            <Checkbox
              value='J'
              onChange={props.column.onChangeReleased}
              className='table__header2-setting-column'
            >
             {t("Employees.Released")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='K'
              onChange={props.column.onChangeGender}
              className='table__header2-setting-column'
            >
           {t("Employees.Gender")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='I'
              onChange={props.column.onChangeNotes}
              className='table__header2-setting-column'
            >
             {t("Form.Notes")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='H'
              name='email'
              onChange={props.column.onChangeAttachment}
              className='table__header2-setting-column'
            >
             {t("Form.Attachments")}
            </Checkbox>
          </Col>
            </Row>
          )}
          </Col>
          <Col span={15} offset={9} style={styles.padding}>
            <span onClick={handelVisibility}>
              {visible ? (
                  <Button type="link" icon={ <UpOutlined />} className='table__header2-setting-showMore'>{t("Sales.Product_and_services.Show_less")}</Button>
                // <span className='table__header2-setting-showMore'>
                //   <UpOutlined />
                //   {t("Sales.Product_and_services.Show_less")}
                // </span>
              
              ) : (
                <Button type="link" icon={ <DownOutlined />} className='table__header2-setting-showMore'>{t("Sales.Product_and_services.Show_More")}</Button>
                // <span className='table__header2-setting-showMore'>
                //   <DownOutlined />
                //   {t("Sales.Product_and_services.Show_More")}
                // </span>

              )}
            </span>
          </Col>
        </Row>
      </Checkbox.Group>
      {/* <Row>
        <Col offset={2} span={22}>
          <label htmlFor='status'>{t("Sales.Product_and_services.Rows")}</label>
        </Col>
        <Col offset={2} span={10}>
          <Select
            showSearch
            defaultValue={count}
            optionFilterProp='children'
            onChange={onChangeNumber}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={30}>30</Option>
            <Option value={20}>20</Option>
            <Option value={10}>10</Option>
          </Select>
        </Col>
      </Row> */}
      </div>
    )
}
const styles={
  padding:{padding:"0px"}
}
export default Settings