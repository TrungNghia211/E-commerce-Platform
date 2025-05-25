import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function CompletionForm() {
  return (
    <div className="text-center">
      <Title level={3}>Hoàn tất đăng ký shop</Title>
      <Paragraph>
        Cảm ơn bạn đã đăng ký shop trên hệ thống của chúng tôi.
      </Paragraph>
    </div>
  );
}
