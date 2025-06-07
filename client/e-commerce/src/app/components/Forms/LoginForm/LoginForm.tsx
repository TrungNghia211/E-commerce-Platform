// "use client";

// import { useRouter } from "next/navigation";

// import { Button, Form, Input } from "antd";

// import { useState } from "react";

// import userApiRequest from "@/apiRequests/user";
// import { clientSessionToken, HttpError } from "@/lib/http";
// import { LoginValues, Role } from "@/types/types";

// export default function LoginForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();
//   const [form] = Form.useForm();

//   const onFinish = async (values: LoginValues) => {
//     setIsSubmitting(true);
//     try {
//       const res = await userApiRequest.login(values);
//       await userApiRequest.auth({ sessionToken: res.payload.result.token });
//       clientSessionToken.value = res.payload.result.token;
//       const isAdmin = res.payload.result.roles.some(
//         (role: Role) => role.name === "ADMIN"
//       );
//       isAdmin ? router.push("/admin/category") : router.push("/");
//     } catch (error) {
//       if (error instanceof HttpError) {
//         form.setFields([
//           {
//             name: "username",
//             errors: ["Tên đăng nhập hoặc mật khẩu không đúng"],
//           },
//           {
//             name: "password",
//             errors: ["Tên đăng nhập hoặc mật khẩu không đúng"],
//           },
//         ]);
//       } else {
//         console.log("Có lỗi xảy ra, vui lòng thử lại.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Form
//       form={form}
//       name="login"
//       onFinish={onFinish}
//       layout="vertical"
//       scrollToFirstError
//       size="large"
//       className="w-[600px]"
//     >
//       <Form.Item
//         name="username"
//         label="Username"
//         rules={[{ required: true, message: "Please input your username!" }]}
//       >
//         <Input autoComplete="username" />
//       </Form.Item>

//       <Form.Item
//         name="password"
//         label="Password"
//         rules={[{ required: true, message: "Please input your password!" }]}
//       >
//         <Input.Password autoComplete="password" />
//       </Form.Item>

//       <Form.Item>
//         <Button
//           type="primary"
//           htmlType="submit"
//           className="w-full"
//           loading={isSubmitting}
//         >
//           Đăng nhập
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  Space,
  Divider,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import userApiRequest from "@/apiRequests/user";
import { clientSessionToken, HttpError } from "@/lib/http";
import { LoginValues, Role } from "@/types/types";

const { Title, Text } = Typography;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      const res = await userApiRequest.login(values);
      await userApiRequest.auth({ sessionToken: res.payload.result.token });
      clientSessionToken.value = res.payload.result.token;
      window.dispatchEvent(new Event("login")); // Thêm dispatch event
      window.dispatchEvent(new Event("cartUpdated")); // Cập nhật giỏ hàng
      const isAdmin = res.payload.result.roles.some(
        (role: Role) => role.name === "ADMIN"
      );
      isAdmin ? router.push("/admin/category") : router.push("/");
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
    <div className="flex items-center justify-center sm:px-6 lg:px-8 mt-[10px]">
      <Card
        className="w-full max-w-md shadow-2xl border-0 rounded-2xl overflow-hidden"
        // style={{
        //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        //   padding: 0,
        // }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 m-1">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <ShoppingOutlined className="text-white text-2xl" />
            </div>
            <Title level={2} className="text-gray-800 mb-[10px]">
              Chào mừng trở lại!
            </Title>
            <Text className="text-gray-600 text-base">
              Đăng nhập để tiếp tục mua sắm
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="username"
              label={
                <span className="text-gray-700 font-medium">Tên đăng nhập</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập tên đăng nhập"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors h-12"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-gray-700 font-medium">Mật khẩu</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors h-12"
                autoComplete="current-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>

              <Button
                type="link"
                className="p-0 text-blue-600 hover:text-blue-700 font-medium"
              >
                Quên mật khẩu?
              </Button>
            </div>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                loading={isSubmitting}
                icon={<LoginOutlined />}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>

            <Divider className="my-6">
              <Text className="text-gray-500">Hoặc</Text>
            </Divider>

            <div className="text-center mt-[10px]">
              <Text className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Button
                  type="link"
                  className="p-0 font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => router.push("/register")}
                >
                  Đăng ký ngay
                </Button>
              </Text>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
