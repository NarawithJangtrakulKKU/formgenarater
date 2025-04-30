'use client';

import React from 'react';
import { Form, ConfigProvider, Button } from 'antd';
import thTH from 'antd/locale/th_TH';
import { Card, Typography } from 'antd';
import PersonaForm from '@/components/PersonaForm';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;

interface FormValues {
  firstname: string;
  lastname: string;
  birthdate: Dayjs;
  address: string;
  alley?: string;
  postcode: string;
  province: string;
  district: string;
  subDistrict: string;
}

const PersonaPage = () => {
  const [form] = Form.useForm<FormValues>();

  const handleFinish = (values: FormValues) => {
    console.log('Form values:', values);
  };

  return (
    <ConfigProvider locale={thTH}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <Title level={2} className="mb-6">ข้อมูลส่วนตัว</Title>
            <Form 
              form={form} 
              onFinish={handleFinish}
              layout="vertical"
            >
              <PersonaForm form={form} />
              <div className="mt-6">
                <Button type="primary" htmlType="submit" block>
                  บันทึกข้อมูล
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PersonaPage; 