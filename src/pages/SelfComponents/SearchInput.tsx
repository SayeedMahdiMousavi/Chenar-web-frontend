import React, { ReactNode } from "react";
import { Input } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "throttle-debounce";
interface IProps {
  placeholder: string | undefined;
  setSearch: (value: string) => void;
  setPage: (value: number) => void;
  suffix?: ReactNode;
  style?: React.CSSProperties;
}

export const SearchInput: React.FC<IProps> = (props) => {
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFunc(e.target.value);
  };

  const debounceFunc = debounce(800, async (value: string) => {
    props.setSearch(value);
    props.setPage(1);
  });

  return (
    <Input
      placeholder={props.placeholder}
      suffix={props.suffix}
      // suffix={<SearchOutlined className="search_icon_color" />}
      onChange={onSearch}
      className="table__searchInput"
      style={props?.style ? props?.style : {}}
    />
  );
};
