import classNames from "classnames/bind";

import styles from "./AdminHeader.module.scss";

const cx = classNames.bind(styles);

export default function AdminHeader() {
  return <div className={cx("container")}>Admin Header</div>;
}
