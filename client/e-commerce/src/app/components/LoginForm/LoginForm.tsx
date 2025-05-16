"use client";

import { useRouter } from "next/navigation";

import { Button, Form, Input } from "antd";

import { useState } from "react";

import userApiRequest from "@/apiRequests/user";
import { HttpError } from "@/lib/http";
import { LoginValues, Role } from "@/types/types";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      const res = await userApiRequest.login(values);
      await userApiRequest.auth({ sessionToken: res.payload.result.token });
      const isAdmin = res.payload.result.roles.some(
        (role: Role) => role.name === "ADMIN"
      );
      isAdmin ? router.push("/admin") : router.push("/");
    } catch (error) {
      if (error instanceof HttpError) {
        form.setFields([
          {
            name: "username",
            errors: ["Tên đăng nhập hoặc mật khẩu không đúng"],
          },
          {
            name: "password",
            errors: ["Tên đăng nhập hoặc mật khẩu không đúng"],
          },
        ]);
      } else {
        console.log("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      size="large"
      className="w-[600px]"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input autoComplete="username" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input your password!" }]}
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
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
}
