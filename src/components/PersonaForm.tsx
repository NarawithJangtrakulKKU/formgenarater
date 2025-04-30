import React from 'react';
import { Form, Input, DatePicker, Select, Row, Col } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { Dayjs } from 'dayjs';

interface FormData {
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

interface PersonaFormProps {
  form: FormInstance<FormData>;
}

const PersonaForm: React.FC<PersonaFormProps> = ({ form }) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstname"
            label="Firstname"
            rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
          >
            <Input placeholder="Firstname" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastname"
            label="Lastname"
            rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
          >
            <Input placeholder="Lastname" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="birthdate"
        label="Birthdate"
        rules={[{ required: true, message: 'กรุณาเลือกวันเกิด' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="เลือกวันที่"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="alley"
            label="Alley"
          >
            <Input placeholder="Alley" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="postcode"
            label="Postcode"
            rules={[
              { required: true, message: 'กรุณากรอกรหัสไปรษณีย์' },
              {
                pattern: /^\d{5}$/,
                message: 'กรุณากรอกรหัสไปรษณีย์ 5 หลัก'
              }
            ]}
          >
            <Input placeholder="Postcode" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="province"
            label="Province"
            rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
          >
            <Select placeholder="Select Province">
              {/* Add provinces here */}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="district"
            label="District"
            rules={[{ required: true, message: 'กรุณาเลือกเขต/อำเภอ' }]}
          >
            <Select placeholder="Select District">
              {/* Add districts here */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="subDistrict"
            label="Sub-district"
            rules={[{ required: true, message: 'กรุณาเลือกแขวง/ตำบล' }]}
          >
            <Select placeholder="Select Sub-district">
              {/* Add sub-districts here */}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default PersonaForm;
