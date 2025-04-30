import React, { useState } from 'react';
import { Button, Modal, Tabs, message, Input, Upload, Card, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import type { TabsProps } from 'antd';
import { InboxOutlined, CopyOutlined } from '@ant-design/icons';
import DynamicForm from './DynamicForm';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface FieldSchema {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
  span?: number;
}

interface ImportJsonPageProps {
  onImport: (jsonData: Record<string, unknown>) => void;
}

const ImportJsonPage: React.FC<ImportJsonPageProps> = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formSchema, setFormSchema] = useState<FieldSchema[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [pendingSchema, setPendingSchema] = useState<FieldSchema[] | null>(null);
  const { control, handleSubmit, reset } = useForm<{ rawJson: string }>();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const validateSchema = (schema: unknown): schema is FieldSchema[] => {
    if (!Array.isArray(schema)) {
      setErrorMessages(['JSON ต้องเป็น Array เท่านั้น']);
      setErrorModalVisible(true);
      return false;
    }
    
    const errors: string[] = [];
    
    schema.forEach((field, index) => {
      if (typeof field !== 'object' || field === null) {
        errors.push(`ฟิลด์ที่ ${index + 1}: ต้องเป็น object`);
        return;
      }

      if (typeof field.type !== 'string') {
        errors.push(`ฟิลด์ที่ ${index + 1}: ต้องมี property 'type' เป็น string`);
      } else if (!['string', 'number', 'select', 'boolean', 'date'].includes(field.type)) {
        errors.push(`ฟิลด์ที่ ${index + 1}: type '${field.type}' ไม่ถูกต้อง (ต้องเป็น string, number, select, boolean, หรือ date)`);
      }

      if (typeof field.label !== 'string') {
        errors.push(`ฟิลด์ที่ ${index + 1}: ต้องมี property 'label' เป็น string`);
      }

      if (typeof field.name !== 'string') {
        errors.push(`ฟิลด์ที่ ${index + 1}: ต้องมี property 'name' เป็น string`);
      }

      if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
        errors.push(`ฟิลด์ที่ ${index + 1}: ต้องมี property 'options' เป็น array ที่มีข้อมูล`);
      }

      if (field.type === 'select' && field.options) {
        field.options.forEach((option: { label: string; value: string | number | boolean }, optIndex: number) => {
          if (typeof option !== 'object' || option === null) {
            errors.push(`ฟิลด์ที่ ${index + 1}, ตัวเลือกที่ ${optIndex + 1}: ต้องเป็น object`);
            return;
          }
          if (typeof option.label !== 'string') {
            errors.push(`ฟิลด์ที่ ${index + 1}, ตัวเลือกที่ ${optIndex + 1}: ต้องมี property 'label' เป็น string`);
          }
          if (typeof option.value !== 'string' && typeof option.value !== 'number' && typeof option.value !== 'boolean') {
            errors.push(`ฟิลด์ที่ ${index + 1}, ตัวเลือกที่ ${optIndex + 1}: ต้องมี property 'value' เป็น string, number, หรือ boolean`);
          }
        });
      }

      if (field.span !== undefined && (typeof field.span !== 'number' || field.span < 1 || field.span > 24)) {
        errors.push(`ฟิลด์ที่ ${index + 1}: span ต้องเป็นตัวเลขระหว่าง 1-24`);
      }
    });

    if (errors.length > 0) {
      setErrorMessages(errors);
      setErrorModalVisible(true);
      return false;
    }

    return true;
  };

  const processJsonSchema = (jsonData: unknown) => {
    try {
      const schema = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (!validateSchema(schema)) {
        return;
      }

      showConfirmModal(schema);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setErrorMessages([`รูปแบบ JSON ไม่ถูกต้อง: ${error.message}`]);
      } else {
        setErrorMessages(['เกิดข้อผิดพลาดในการประมวลผล JSON']);
      }
      setErrorModalVisible(true);
    }
  };

  const showConfirmModal = (schema: FieldSchema[]) => {
    setPendingSchema(schema);
    setConfirmModalVisible(true);
  };

  const handleConfirmOk = () => {
    if (pendingSchema) {
      setFormSchema(pendingSchema);
      handleClose();
      message.success('นำเข้า JSON Schema สำเร็จ');
      setConfirmModalVisible(false);
      setPendingSchema(null);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModalVisible(false);
    setPendingSchema(null);
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
    setErrorMessages([]);
  };

  const handleRawJsonSubmit = handleSubmit((data) => {
    processJsonSchema(data.rawJson);
  });

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processJsonSchema(content);
    };
    reader.readAsText(file);
    return false; // Prevent default upload behavior
  };

  const handleFormSubmit = (values: Record<string, unknown>) => {
    console.log('Form values:', values);
    message.success('บันทึกข้อมูลสำเร็จ');
    onImport(values);
  };

  const exampleJson = `[
  {
    "type": "string",
    "label": "ชื่อ",
    "name": "firstName",
    "required": true,
    "span": 12
  },
  {
    "type": "string",
    "label": "นามสกุล",
    "name": "lastName",
    "required": true,
    "span": 12
  },
  {
    "type": "select",
    "label": "เพศ",
    "name": "gender",
    "options": [
      { "label": "ชาย", "value": "male" },
      { "label": "หญิง", "value": "female" }
    ],
    "span": 12
  },
  {
    "type": "number",
    "label": "อายุ",
    "name": "age",
    "span": 12
  },
  {
    "type": "string",
    "label": "ที่อยู่",
    "name": "address",
    "span": 24
  }
]`;

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Raw JSON',
      children: (
        <div className="space-y-4">
          <Card>
            <Title level={5}>รูปแบบ JSON ที่รองรับ</Title>
            <Paragraph>
              <ul className="list-disc pl-4 space-y-2">
                <li>ต้องเป็น Array ของ field objects</li>
                <li>แต่ละ field ต้องมี properties: type, label, name</li>
                <li>type ที่รองรับ: string, number, select, boolean</li>
                <li>required เป็น optional boolean</li>
                <li>options ใช้กับ type select เท่านั้น</li>
                <li>span เป็น optional number ที่มีค่าระหว่าง 1-24</li>
              </ul>
            </Paragraph>
          </Card>
          <form onSubmit={handleRawJsonSubmit}>
            <Controller
              name="rawJson"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder={exampleJson}
                  rows={10}
                  style={{ marginBottom: '16px' }}
                />
              )}
            />
            <Button type="primary" htmlType="submit" block>
              นำเข้า JSON Schema
            </Button>
          </form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Import File',
      children: (
        <div className="space-y-4">
          <Card>
            <Title level={5}>อัพโหลดไฟล์ JSON</Title>
            <Paragraph>
              <ul className="list-disc pl-4 space-y-2">
                <li>รองรับไฟล์ .json เท่านั้น</li>
                <li>ไฟล์ต้องมีรูปแบบตามที่กำหนด</li>
                <li>ขนาดไฟล์ไม่เกิน 1MB</li>
              </ul>
            </Paragraph>
          </Card>
          <Dragger
            accept=".json"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">คลิกหรือลากไฟล์มาวางที่นี่</p>
            <p className="ant-upload-hint">
              รองรับไฟล์ .json เท่านั้น
            </p>
          </Dragger>
        </div>
      ),
    },
  ];

  const renderSchemaFields = () => {
    if (!pendingSchema) return null;
    
    return (
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Title level={5}>รายละเอียดฟิลด์</Title>
        <ul className="list-disc pl-4 space-y-2">
          {pendingSchema.map((field, index) => (
            <li key={index}>
              <Text strong>{field.label}</Text> ({field.name}): {field.type}
              {field.required && <Text type="danger"> *</Text>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const generateTSXCode = (schema: FieldSchema[]) => {
    const formFields = schema.map(field => {
      let fieldCode = '';
      switch (field.type) {
        case 'string':
          fieldCode = `<Form.Item
  label="${field.label}"
  name="${field.name}"
  rules={[{ required: ${field.required}, message: 'กรุณากรอก${field.label}' }]}
>
  <Input placeholder="กรุณากรอก${field.label}" />
</Form.Item>`;
          break;
        case 'number':
          fieldCode = `<Form.Item
  label="${field.label}"
  name="${field.name}"
  rules={[{ required: ${field.required}, message: 'กรุณากรอก${field.label}' }]}
>
  <InputNumber style={{ width: '100%' }} placeholder="กรุณากรอก${field.label}" />
</Form.Item>`;
          break;
        case 'select':
          const options = field.options?.map(opt => 
            `    <Select.Option key="${opt.value}" value="${opt.value}">${opt.label}</Select.Option>`
          ).join('\n') || '';
          fieldCode = `<Form.Item
  label="${field.label}"
  name="${field.name}"
  rules={[{ required: ${field.required}, message: 'กรุณาเลือก${field.label}' }]}
>
  <Select placeholder="กรุณาเลือก${field.label}">
${options}
  </Select>
</Form.Item>`;
          break;
        case 'boolean':
          fieldCode = `<Form.Item
  label="${field.label}"
  name="${field.name}"
  valuePropName="checked"
  rules={[{ required: ${field.required}, message: 'กรุณาเลือก${field.label}' }]}
>
  <Switch />
</Form.Item>`;
          break;
      }
      return fieldCode;
    }).join('\n\n');

    return `import { Form, Input, InputNumber, Select, Switch } from 'antd';

const DynamicForm = () => {
  return (
    <Form layout="vertical">
${formFields}
    </Form>
  );
};

export default DynamicForm;`;
  };

  const handleCopyTSX = () => {
    if (formSchema.length === 0) {
      message.warning('กรุณานำเข้า JSON Schema ก่อน');
      return;
    }
    const tsxCode = generateTSXCode(formSchema);
    navigator.clipboard.writeText(tsxCode);
    message.success('คัดลอกโค้ด TSX เรียบร้อยแล้ว');
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button type="primary" onClick={handleOpen}>
          นำเข้า JSON Schema
        </Button>
        <Button 
          icon={<CopyOutlined />} 
          onClick={handleCopyTSX}
          disabled={formSchema.length === 0}
        >
          คัดลอกโค้ด TSX
        </Button>
      </div>

      <Modal
        title="นำเข้า JSON Schema"
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <Tabs items={items} />
      </Modal>

      <Modal
        title="ยืนยันการสร้างแบบฟอร์ม"
        open={confirmModalVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <div className="space-y-4">
          <Paragraph>คุณต้องการสร้างแบบฟอร์มจาก JSON Schema นี้ใช่หรือไม่?</Paragraph>
          <Text>จำนวนฟิลด์ทั้งหมด: {pendingSchema?.length || 0}</Text>
          {renderSchemaFields()}
        </div>
      </Modal>

      <Modal
        title="พบข้อผิดพลาด"
        open={errorModalVisible}
        onOk={handleErrorModalClose}
        onCancel={handleErrorModalClose}
        okText="เข้าใจแล้ว"
        cancelText="ปิด"
      >
        <div className="space-y-4">
          <Paragraph>พบข้อผิดพลาดใน JSON Schema:</Paragraph>
          <ul className="list-disc pl-4 space-y-2">
            {errorMessages.map((error, index) => (
              <li key={index} className="text-red-500">{error}</li>
            ))}
          </ul>
        </div>
      </Modal>

      {formSchema.length > 0 && (
        <div className="mt-6">
          <Title level={4} className="mb-4">แบบฟอร์มที่สร้างจาก JSON Schema</Title>
          <DynamicForm schema={formSchema} onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
};

export default ImportJsonPage;