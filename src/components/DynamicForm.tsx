import React from 'react';
import { Form, Input, Select, Switch, InputNumber, Button, Row, Col, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';

interface FieldSchema {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
  span?: number;
}

interface DynamicFormProps {
  schema: FieldSchema[];
  onSubmit: (values: Record<string, string | number | boolean | Dayjs>) => void;
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
            {field.options?.map((option, index) => (
              <Select.Option key={`${option.value}-${index}`} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} placeholder={field.placeholder || `กรุณาเลือก${field.label}`} />;
      default:
        return <Input placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
    }
  };

  const handleSubmit = (values: Record<string, string | number | boolean | Dayjs>) => {
    onSubmit(values);
  };

  const groupFieldsIntoRows = (fields: FieldSchema[]) => {
    const rows: FieldSchema[][] = [];
    let currentRow: FieldSchema[] = [];
    let currentRowSpan = 0;

    fields.forEach((field) => {
      const span = field.span || 24;
      
      if (currentRowSpan + span > 24) {
        rows.push(currentRow);
        currentRow = [field];
        currentRowSpan = span;
      } else {
        currentRow.push(field);
        currentRowSpan += span;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const fieldRows = groupFieldsIntoRows(schema);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 800, margin: '0 auto' }}
    >
      {fieldRows.map((row, rowIndex) => (
        <Row key={rowIndex} gutter={16}>
          {row.map((field) => (
            <Col key={field.name} span={field.span || 24}>
              <Form.Item
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
            </Col>
          ))}
        </Row>
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