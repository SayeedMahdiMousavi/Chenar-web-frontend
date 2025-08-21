import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetUserList } from "../../Hooks";
import { Colors } from "../colors";

export default function SidebarUserList({ collapsed }: { collapsed: boolean }) {
  const { data } = useGetUserList();

  return (
    <div style={styles.list}>
      {collapsed ? (
        <Avatar
          size={40}
          style={{ margin: "6px", backgroundColor: Colors.primaryColor }}
        >
          {data?.results?.length + 8}+
        </Avatar>
      ) : (
        <Avatar.Group maxCount={4} size={40} maxStyle={styles.maxStyle}>
          {data?.results?.map(
            (item: { id: number; photo: string; username: string }) => (
              <Avatar
                src={item?.photo}
                key={item?.id}
                style={styles.avatar}
                icon={<UserOutlined />}
              >
                {item?.username?.[0]?.toUpperCase()}
                {item?.username?.[1]}
              </Avatar>
            )
          )}
          <Avatar style={styles.avatar} icon={<UserOutlined />} />
          <Avatar
            src="https://joeschmoe.io/api/v1/random"
            style={styles.avatar}
          />
          <Avatar
            style={{ backgroundColor: "#1890ff", borderWidth: "2px" }}
            icon={<UserOutlined />}
          />
          <Avatar
            src="https://joeschmoe.io/api/v1/random"
            style={styles.avatar}
          />
          <Avatar
            style={{ backgroundColor: Colors.primaryColor }}
            icon={<UserOutlined />}
          />
          <Avatar
            style={{ backgroundColor: "#1890ff", borderWidth: "2px" }}
            icon={<UserOutlined />}
          />

          <Avatar
            style={{ backgroundColor: "#1890ff", borderWidth: "2px" }}
            icon={<UserOutlined />}
          />

          <Avatar
            src="https://joeschmoe.io/api/v1/random"
            style={styles.avatar}
          />
        </Avatar.Group>
      )}
    </div>
  );
}

interface IStyles {
  list: React.CSSProperties;
  maxStyle: React.CSSProperties;
  avatar: React.CSSProperties;
}

const styles: IStyles = {
  list: {
    paddingInlineStart: "8px",
    position: "fixed",
    bottom: "0px",
    paddingBottom: "7px",
  },
  maxStyle: {
    color: Colors.white,
    backgroundColor: Colors.primaryColor,
    fontSize: "13px",
    borderWidth: "2px",
  },
  avatar: { backgroundColor: Colors.primaryColor, borderWidth: "2px" },
};
