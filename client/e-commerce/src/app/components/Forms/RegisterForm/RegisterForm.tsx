"use client";

import { useRouter } from "next/navigation";

import { Button, Form, Input } from "antd";
import { RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";

import userApiRequest from "@/apiRequests/user";
import { HttpError } from "@/lib/http";
import { RegisterFormValues } from "@/types/types";
import { useState } from "react";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...apiValues } = values;
      await userApiRequest.createUser(apiValues);
      router.push("/login");
    } catch (error) {
      if (error instanceof HttpError) {
        switch (error.payload.message) {
          case "Username existed":
            form.setFields([
              { name: "username", errors: ["Tên đăng nhập đã tồn tại"] },
            ]);
            break;
          case "Email existed":
            form.setFields([{ name: "email", errors: ["Email đã tồn tại"] }]);
            break;
          case "Phone existed":
            form.setFields([
              { name: "phone", errors: ["Số điện thoại đã tồn tại"] },
            ]);
            break;
          default:
            console.log("Đăng ký thất bại");
        }
      } else {
        console.log("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: RuleObject, value: StoreValue) {
      if (!value || getFieldValue("password") === value)
        return Promise.resolve();
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      size="large"
      className="w-[600px]"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: "Please input your username!" },
          { min: 3, message: "Username must be at least 3 characters" },
        ]}
      >
        <Input autoComplete="username" />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[
          { required: true, message: "Please input your full name!" },
          { min: 3, message: "Full name must be at least 3 characters" },
        ]}
      >
        <Input autoComplete="email" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "The input is not valid E-mail!" },
          { required: true, message: "Please input your E-mail!" },
        ]}
      >
        <Input autoComplete="email" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          { required: true, message: "Please input your phone number!" },
          {
            pattern: /^\+?[0-9]{10,15}$/,
            message: "Phone number must be 10-15 digits, optional + at start",
          },
        ]}
      >
        <Input autoComplete="phone" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 8, message: "Password must be at least 8 characters" },
        ]}
        hasFeedback
      >
        <Input.Password autoComplete="password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password!" },
          validateConfirmPassword,
        ]}
      >
        <Input.Password autoComplete="password" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={isSubmitting}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
}
