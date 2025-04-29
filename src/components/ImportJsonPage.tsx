import React, { useState } from 'react';
import { Button, Modal, Tabs, message, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import type { TabsProps } from 'antd';
import DynamicForm from './DynamicForm';

const { TextArea } = Input;

interface FieldSchema {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
}

interface ImportJsonPageProps {
  onImport: (jsonData: Record<string, unknown>) => void;
}

const ImportJsonPage: React.FC<ImportJsonPageProps> = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formSchema, setFormSchema] = useState<FieldSchema[]>([]);
  const { control, handleSubmit, reset } = useForm<{ rawJson: string }>();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const validateSchema = (schema: unknown): schema is FieldSchema[] => {
    if (!Array.isArray(schema)) return false;
    
    return schema.every(field => 
      typeof field === 'object' &&
      typeof field.type === 'string' &&
      typeof field.label === 'string' &&
      typeof field.name === 'string'
    );
  };

  const processJsonSchema = (jsonData: unknown) => {
    try {
      const schema = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (!validateSchema(schema)) {
        message.error('JSON ไม่ถูกต้องตามรูปแบบที่กำหนด');
        return;
      }

      setFormSchema(schema);
      handleClose();
      message.success('นำเข้า JSON Schema สำเร็จ');
    } catch {
      message.error('รูปแบบ JSON ไม่ถูกต้อง');
    }
  };

  const handleRawJsonSubmit = handleSubmit((data) => {
    processJsonSchema(data.rawJson);
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processJsonSchema(content);
      };
      reader.readAsText(file);
    }
  };

  const handleFormSubmit = (values: Record<string, unknown>) => {
    console.log('Form values:', values);
    message.success('บันทึกข้อมูลสำเร็จ');
    onImport(values);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Raw JSON',
      children: (
        <form onSubmit={handleRawJsonSubmit}>
          <Controller
            name="rawJson"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder={`ตัวอย่าง JSON Schema:
[
  {
    "type": "string",
    "label": "ชื่อ",
    "name": "firstName",
    "required": true
  },
  {
    "type": "select",
    "label": "เพศ",
    "name": "gender",
    "options": [
      { "label": "ชาย", "value": "male" },
      { "label": "หญิง", "value": "female" }
    ]
  }
]`}
                rows={10}
                style={{ marginBottom: '16px' }}
              />
            )}
          />
          <Button type="primary" htmlType="submit" block>
            นำเข้า JSON Schema
          </Button>
        </form>
      ),
    },
    {
      key: '2',
      label: 'Import File',
      children: (
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{
            padding: '10px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            width: '100%',
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleOpen}>
        นำเข้า JSON Schema
      </Button>

      <Modal
        title="นำเข้า JSON Schema"
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <Tabs items={items} />
      </Modal>

      {formSchema.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>แบบฟอร์มที่สร้างจาก JSON Schema</h2>
          <DynamicForm schema={formSchema} onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
};

export default ImportJsonPage;
