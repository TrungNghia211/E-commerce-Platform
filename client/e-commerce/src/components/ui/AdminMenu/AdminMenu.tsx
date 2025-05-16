"use client";

import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "category",
    label: "Quản lý danh mục",
  },
  {
    key: "product",
    label: "Quản lý sản phẩm",
    children: [
      { key: "addProduct", label: "Thêm sản phẩm" },
      { key: "productList", label: "Danh sách sản phẩm" },
    ],
  },
];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

export default function AdminMenu() {
  const router = useRouter();

  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "23"]);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "category":
        router.push("/admin/category");
        break;
      case "addProduct":
        router.push("/");
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["category"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
          height: "100%",
        }}
        items={items}
        onClick={onClick}
      />
    </div>
  );
}
