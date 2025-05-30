import classNames from "classnames/bind";

import styles from "./SellerHeader.module.scss";

const cx = classNames.bind(styles);

export default function SellerHeader() {
  return <div className={cx("container")}>Seller Header</div>;
}
