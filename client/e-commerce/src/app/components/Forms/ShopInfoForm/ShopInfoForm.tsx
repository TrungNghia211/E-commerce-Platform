import { Form, FormInstance, Input, Select, Space } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useContext, useEffect, useState } from "react";

import { maxShopNameLength } from "@/app/constants/constants";
import { District, Province, Ward } from "@/types/address/types";
import { getDistricts, getProvinces, getWards } from "@/app/utils/address";
import { AddressContext } from "@/app/store/AddressContext";

const { Option } = Select;

export default function ShopInfoForm({ form }: { form: FormInstance }) {
  const [shopNameCount, setShopNameCount] = useState(0);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const context = useContext(AddressContext);

  useEffect(() => {
    async function fetchProvinces() {
      const provinceList = await getProvinces();
      setProvinces(provinceList);
    }
    fetchProvinces();
  }, []);

  const onProvinceChange = async (provinceId: number) => {
    const districtList = await getDistricts(provinceId);
    setDistricts(districtList);
  };

  const onDistrictChange = async (districtId: number) => {
    const wardList = await getWards(districtId);
    setWards(wardList);
  };

  return (
    <div className="flex justify-center">
      <Form form={form} style={{ width: "50%" }} layout="vertical" size="small">
        <Form.Item
          label={
            <Space>
              <span>Tên Shop *</span>
              <span>
                {shopNameCount}/{maxShopNameLength}
              </span>
            </Space>
          }
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên shop" },
            {
              max: maxShopNameLength,
              message: `Tối đa ${maxShopNameLength} ký tự`,
            },
          ]}
          style={{
            marginBottom: 15,
          }}
        >
          <Input
            maxLength={maxShopNameLength}
            onChange={(e) => setShopNameCount(e.target.value.length)}
            placeholder="Nhập tên shop"
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ lấy hàng"
          name="addressLine"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ lấy hàng" },
          ]}
          style={{
            marginBottom: 15,
          }}
        >
          <Input placeholder="Nhập địa chỉ lấy hàng" />
        </Form.Item>

        <Form.Item
          label="Tỉnh/Thành"
          name="provinceName"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Select
            placeholder="Chọn Tỉnh/Thành"
            onChange={(value: string, option?: DefaultOptionType) => {
              if (!option || !option.key) return;

              form.setFieldsValue({
                provinceName: value,
              });

              onProvinceChange(Number(option.key));

              context.setProvince({
                ProvinceID: option.key,
                ProvinceName: value,
              });
            }}
          >
            {provinces.map((p) => (
              <Option key={p.ProvinceID} value={p.ProvinceName}>
                {p.ProvinceName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quận/Huyện"
          name="districtName"
          rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Select
            placeholder="Chọn Quận/Huyện"
            onChange={(value: string, option?: DefaultOptionType) => {
              if (!option || !option.key) return;

              form.setFieldsValue({
                districtName: value,
              });

              onDistrictChange(Number(option.key));

              context.setDistrict({
                DistrictID: option.key,
                DistrictName: value,
              });
            }}
          >
            {districts.map((d) => (
              <Option key={d.DistrictID} value={d.DistrictName}>
                {d.DistrictName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Phường/Xã"
          name="wardName"
          rules={[{ required: true, message: "Vui lòng chọn Phường/Xã" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Select
            placeholder="Chọn Phường/Xã"
            onChange={(value: string, option?: DefaultOptionType) => {
              if (!option || !option.key) return;
              context.setWard({
                WardCode: option.key,
                WardName: value,
              });
            }}
          >
            {wards.map((w) => (
              <Option key={w.WardCode} value={w.WardName}>
                {w.WardName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}
