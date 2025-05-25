"use client";

import { useContext, useState, useEffect } from "react";
import { Button, Form, Steps, message } from "antd";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";

import styles from "./CreateShop.module.scss";
import { steps } from "@/app/constants/constants";
import ShopInfoForm from "@/app/components/Forms/ShopInfoForm/ShopInfoForm";
import IdentificationForm from "@/app/components/Forms/IdentificationForm/IdentificationForm";
import CompletionForm from "@/app/components/Forms/CompletionForm/CompletionForm";
import { AddressContext } from "@/app/store/AddressContext";
import shopApiRequest from "@/apiRequests/shop";
import { HttpError } from "@/lib/http";
import { StoreCreationRequestType } from "@/types/address/types";
import { createShopGHN } from "@/app/utils/address";

const cx = classNames.bind(styles);

export default function CreateShopPage() {
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageState, setMessageState] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);
  const router = useRouter();

  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (messageState) {
      messageApi.open({
        type: messageState.type,
        content: messageState.content,
      });
      setMessageState(null);
    }
  }, [messageState, messageApi]);

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const onClickNext = async () => {
    try {
      if (current === 0) await formStep1.validateFields();
      else if (current === 1) await formStep2.validateFields();
      next();
    } catch (error) {}
  };

  const onFinish = async () => {
    try {
      setIsSubmitting(true);
      const shopInfo = formStep1.getFieldsValue();
      const identificationInfo = formStep2.getFieldsValue();

      const citizenIdFrontImage =
        identificationInfo.citizenIdFrontImage?.[0]?.originFileObj;
      const citizenIdBackImage =
        identificationInfo.citizenIdBackImage?.[0]?.originFileObj;

      const requestGHN: StoreCreationRequestType = {
        district_id: Number(context.district?.DistrictID),
        ward_code: context.ward?.WardCode.toString(),
        name: shopInfo.name,
        phone: shopInfo.phone,
        address: shopInfo.addressLine,
      };

      const shopId = await createShopGHN(requestGHN);

      const request = {
        id: shopId,
        ...shopInfo,
        ...identificationInfo,
        provinceId: context.province?.ProvinceID,
        districtId: context.district?.DistrictID,
        wardId: context.ward?.WardCode,
        citizenIdFrontImage,
        citizenIdBackImage,
      };

      await shopApiRequest.createShop(request);

      router.push("/");
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.payload.code === 1014) {
          formStep1.setFields([
            {
              name: "name",
              errors: ["Tên shop đã tồn tại"],
            },
          ]);
          setCurrent(0);
        }
      } else
        setMessageState({
          type: "error",
          content: "Có lỗi xảy ra, vui lòng thử lại!",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const context = useContext(AddressContext);

  return (
    <div className={cx("container")}>
      {contextHolder}
      <Steps current={current} items={items} />

      <div className={cx("content")}>
        <div style={{ display: current === 0 ? "block" : "none" }}>
          <ShopInfoForm form={formStep1} />
        </div>

        <div style={{ display: current === 1 ? "block" : "none" }}>
          <IdentificationForm form={formStep2} />
        </div>

        <div style={{ display: current === 2 ? "block" : "none" }}>
          <CompletionForm />
        </div>
      </div>

      <div className={cx("button-container")}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={onClickNext}>
            Tiếp theo
          </Button>
        )}

        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={prev}>
            Quay lại
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button type="primary" onClick={onFinish} loading={isSubmitting}>
            Hoàn tất
          </Button>
        )}
      </div>
    </div>
  );
}
