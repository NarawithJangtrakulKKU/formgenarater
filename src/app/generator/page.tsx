'use client';

import ImportJsonPage from '@/components/ImportJsonPage';
import { ConfigProvider, Typography, Button, Card, message } from 'antd';
import thTH from 'antd/locale/th_TH';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CopyOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface FormField {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

export default function GeneratorPage() {
  const router = useRouter();
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const handleImport = (jsonData: Record<string, unknown>) => {
    console.log('Imported JSON:', jsonData);
    const code = generateFormCode(Array.isArray(jsonData) ? jsonData as FormField[] : []);
    setGeneratedCode(code);
  };

  const generateFormCode = (fields: FormField[]) => {
    const formFields = fields.map(field => {
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    message.success('คัดลอกโค้ด TSX เรียบร้อยแล้ว');
  };

  return (
    <ConfigProvider locale={thTH}>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2}>Form Generator</Title>
              <Text type="secondary">สร้างและคัดลอกโค้ดแบบฟอร์มได้ทันที</Text>
            </div>
            <Button 
              icon={<HomeOutlined />} 
              onClick={() => router.push('/')}
            >
              กลับหน้าหลัก
            </Button>
          </div>
          
          <Card>
            <div className="space-y-4">
              <ImportJsonPage onImport={handleImport} />
              {generatedCode && (
                <>
                  <div className="flex justify-end">
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={handleCopyCode}
                    >
                      คัดลอกโค้ด
                    </Button>
                  </div>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{generatedCode}</code>
                  </pre>
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
    </ConfigProvider>
  );
} 