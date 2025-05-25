import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Upload } from "antd";

export default function IdentificationForm({ form }: { form: FormInstance }) {
  return (
    <div className="flex justify-center">
      <Form form={form} style={{ width: "50%" }} layout="vertical" size="small">
        <Form.Item
          label="Ngân hàng"
          name="bankName"
          rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Input placeholder="Nhập tên ngân hàng" />
        </Form.Item>

        <Form.Item
          label="Số tài khoản"
          name="bankAccountNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số tài khoản ngân hàng" },
          ]}
          style={{
            marginBottom: 15,
          }}
        >
          <Input placeholder="Nhập số tài khoản ngân hàng" />
        </Form.Item>

        <Form.Item
          label="Chủ tài khoản"
          name="bankAccountHolderName"
          rules={[
            { required: true, message: "Vui lòng nhập tên chủ tài khoản" },
          ]}
          style={{
            marginBottom: 15,
          }}
        >
          <Input placeholder="Nhập tên chủ tài khoản" />
        </Form.Item>

        <Form.Item
          label="Ảnh mặt trước căn cước công dân"
          name="citizenIdFrontImage"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Vui lòng upload ảnh mặt trước" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Ảnh mặt sau căn cước công dân"
          name="citizenIdBackImage"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Vui lòng upload ảnh mặt sau" }]}
          style={{
            marginBottom: 15,
          }}
        >
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </div>
  );
}
