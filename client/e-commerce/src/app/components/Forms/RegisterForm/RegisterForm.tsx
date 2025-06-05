"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Card, Typography, Space, Divider } from "antd";
import { RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserAddOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

import userApiRequest from "@/apiRequests/user";
import { HttpError } from "@/lib/http";
import { RegisterFormValues } from "@/types/types";

const { Title, Text } = Typography;

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
      return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
    },
  });

  return (
    <div className="flex items-center justify-center sm:px-6 lg:px-8 mt-[10px]">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-2xl overflow-hidden">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl m-1">
          <div className="text-center mb-[10px]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-[10px]">
              <UserAddOutlined className="text-white text-2xl" />
            </div>
            <Title level={2} className="text-gray-800 mb-[10px]">
              Tạo tài khoản mới
            </Title>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            size="large"
            className="space-y-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="username"
                label={
                  <span className="text-gray-700 font-medium">
                    Tên đăng nhập
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập tên đăng nhập"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="fullName"
                label={
                  <span className="text-gray-700 font-medium">Họ và tên</span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                  { min: 3, message: "Họ và tên phải có ít nhất 3 ký tự" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập họ và tên"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  autoComplete="name"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium">Email</span>}
                rules={[
                  { type: "email", message: "Email không hợp lệ!" },
                  { required: true, message: "Vui lòng nhập email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="example@gmail.com"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={
                  <span className="text-gray-700 font-medium">
                    Số điện thoại
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^\+?[0-9]{10,15}$/,
                    message: "Số điện thoại phải có 10-15 chữ số",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Nhập số điện thoại"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  autoComplete="phone"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="password"
              label={
                <span className="text-gray-700 font-medium">Mật khẩu</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span className="text-gray-700 font-medium">
                  Xác nhận mật khẩu
                </span>
              }
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                validateConfirmPassword,
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập lại mật khẩu"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item className="mt-[10px]">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                loading={isSubmitting}
                icon={<UserAddOutlined />}
              >
                {isSubmitting ? "Đang đăng ký..." : "Tạo tài khoản"}
              </Button>
            </Form.Item>

            <Divider className="my-0.5">
              <Text className="text-gray-500">Hoặc</Text>
            </Divider>

            <div className="text-center">
              <Text className="text-gray-600">
                Đã có tài khoản?{" "}
                <Button
                  type="link"
                  className="p-0 font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => router.push("/login")}
                >
                  Đăng nhập ngay
                </Button>
              </Text>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
