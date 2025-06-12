import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";

import styles from "./AdminHeader.module.scss";

const cx = classNames.bind(styles);

export default function AdminHeader() {
  return (
    <div className={cx("container")}>
      <div className={cx("logo")}>Admin Dashboard</div>

      <div className={cx("user-section")}>
        <Space className={cx("user-info")}>
          <span className={cx("welcome-text")}>Chào mừng, Admin</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </div>
    </div>
  );
}
