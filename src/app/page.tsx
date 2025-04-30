'use client';

import { ConfigProvider, Typography, Card, Row, Col, Steps, Button } from 'antd';
import thTH from 'antd/locale/th_TH';
import { FileTextOutlined, FormOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
      title: 'รองรับ JSON Schema',
      description: 'สร้างแบบฟอร์มจาก JSON Schema ที่คุณกำหนดเองได้อย่างยืดหยุ่น'
    },
    {
      icon: <FormOutlined style={{ fontSize: '24px' }} />,
      title: 'ฟิลด์หลากหลายประเภท',
      description: 'รองรับฟิลด์ประเภทต่างๆ เช่น ข้อความ, ตัวเลข, ตัวเลือก, และสวิตช์'
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '24px' }} />,
      title: 'ตรวจสอบความถูกต้อง',
      description: 'ระบบตรวจสอบข้อมูลอัตโนมัติเพื่อความถูกต้องของข้อมูล'
    }
  ];

  const steps = [
    {
      title: 'สร้าง JSON Schema',
      description: 'กำหนดโครงสร้างแบบฟอร์มด้วย JSON Schema'
    },
    {
      title: 'นำเข้า Schema',
      description: 'นำเข้า JSON Schema ผ่านการพิมพ์หรืออัพโหลดไฟล์'
    },
    {
      title: 'สร้างแบบฟอร์ม',
      description: 'ระบบจะสร้างแบบฟอร์มตาม Schema ที่กำหนด'
    }
  ];

  return (
    <ConfigProvider locale={thTH}>
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <Title level={1} className="mb-4">Form Generator</Title>
            <Paragraph className="text-lg text-gray-600 mb-8">
              สร้างแบบฟอร์มแบบไดนามิกด้วย JSON Schema ของคุณเอง
              ง่าย รวดเร็ว และยืดหยุ่น
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => router.push('/generator')}
              className="px-8"
            >
              เริ่มใช้งาน
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-8">
            <Title level={2} className="text-center mb-12">คุณสมบัติเด่น</Title>
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card className="h-full text-center">
                    <div className="mb-4 text-blue-500">{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph className="text-gray-600">{feature.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-8">
            <Title level={2} className="text-center mb-12">วิธีการใช้งาน</Title>
            <Steps
              items={steps.map(step => ({
                title: step.title,
                description: step.description
              }))}
            />
          </div>
        </div>

        {/* Example Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-8">
            <Title level={2} className="text-center mb-8">ตัวอย่าง JSON Schema</Title>
            <Card className="mb-8">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {`[
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
]`}
              </pre>
            </Card>
          </div>
        </div>
      </main>
    </ConfigProvider>
  );
}
