import React from 'react';
import { Form, Input, Select, Switch, InputNumber, Button } from 'antd';

interface FieldSchema {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
}

interface DynamicFormProps {
  schema: FieldSchema[];
  onSubmit: (values: Record<string, string | number | boolean>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const [form] = Form.useForm();

  const renderField = (field: FieldSchema) => {
    switch (field.type) {
      case 'string':
        return <Input placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
      case 'boolean':
        return <Switch />;
      case 'select':
        return (
          <Select placeholder={field.placeholder || `กรุณาเลือก${field.label}`}>
            {field.options?.map((option) => (
              <Select.Option key={String(option.value)} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
    }
  };

  const handleSubmit = (values: Record<string, string | number | boolean>) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      {schema.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={[
            {
              required: field.required,
              message: `กรุณากรอก${field.label}`,
            },
          ]}
        >
          {renderField(field)}
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          บันทึกข้อมูล
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm; 