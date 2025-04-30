import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Row, Col } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { Dayjs } from 'dayjs';
import { 
  getUniqueProvinces, 
  getDistrictsByProvince, 
  getSubDistrictsByDistrict, 
  getAddressByPostcode,
  getPostcodeByAddress
} from '@/utils/addressHelpers';
import { AddressOption } from '@/utils/types';

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
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [districts, setDistricts] = useState<AddressOption[]>([]);
  const [subDistricts, setSubDistricts] = useState<AddressOption[]>([]);

  // Load provinces on component mount
  useEffect(() => {
    const availableProvinces = getUniqueProvinces();
    setProvinces(availableProvinces);
  }, []);

  // Handle postcode input
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const postcode = e.target.value;
    
    // Only process if postcode is 5 digits
    if (postcode && postcode.length === 5 && /^\d{5}$/.test(postcode)) {
      const matchingAddresses = getAddressByPostcode(postcode);
      
      if (matchingAddresses.length > 0) {
        // If there's only one match, autofill all fields
        if (matchingAddresses.length === 1) {
          const addr = matchingAddresses[0];
          form.setFieldsValue({
            province: addr.province,
            district: addr.district,
            subDistrict: addr.subDistrict,
          });
          
          // Update district and subdistrict dropdowns
          handleProvinceChange(addr.province);
          handleDistrictChange(addr.province, addr.district);
        } 
        // If multiple matches, autofill province and provide options for district
        else {
          const uniqueProvinces = Array.from(new Set(matchingAddresses.map(addr => addr.province)));
          
          if (uniqueProvinces.length === 1) {
            const province = uniqueProvinces[0];
            form.setFieldsValue({ province });
            handleProvinceChange(province);
            
            // Create dropdown options for the available districts
            const uniqueDistricts = Array.from(new Set(
              matchingAddresses
                .filter(addr => addr.province === province)
                .map(addr => addr.district)
            ));
            
            if (uniqueDistricts.length === 1) {
              const district = uniqueDistricts[0];
              form.setFieldsValue({ district });
              handleDistrictChange(province, district);
            }
          }
        }
      } else {
        // Reset fields if no matching address found
        form.setFieldsValue({
          province: undefined,
          district: undefined,
          subDistrict: undefined
        });
        setDistricts([]);
        setSubDistricts([]);
      }
    }
  };

  // Handle province selection
  const handleProvinceChange = (provinceValue: string) => {
    if (!provinceValue) {
      setDistricts([]);
      setSubDistricts([]);
      return;
    }
    
    const availableDistricts = getDistrictsByProvince(provinceValue);
    setDistricts(availableDistricts);
    
    // Reset district and sub-district in form
    form.setFieldsValue({
      district: undefined,
      subDistrict: undefined
    });
  };

  // Handle district selection
  const handleDistrictChange = (provinceValue: string, districtValue: string) => {
    if (!provinceValue || !districtValue) {
      setSubDistricts([]);
      return;
    }
    
    const availableSubDistricts = getSubDistrictsByDistrict(provinceValue, districtValue);
    setSubDistricts(availableSubDistricts);
    
    // Reset sub-district in form
    form.setFieldsValue({
      subDistrict: undefined
    });
  };

  // Handle sub-district selection - autofill postcode
  const handleSubDistrictChange = (value: string) => {
    const province = form.getFieldValue('province');
    const district = form.getFieldValue('district');
    
    if (province && district && value) {
      const postcode = getPostcodeByAddress(province, district, value);
      if (postcode) {
        form.setFieldsValue({ postcode });
      }
    }
  };

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
            <Input 
              placeholder="Postcode" 
              onChange={handlePostcodeChange} 
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="province"
            label="Province"
            rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
          >
            <Select 
              placeholder="Select Province"
              options={provinces}
              onChange={handleProvinceChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
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
            <Select 
              placeholder="Select District"
              options={districts}
              onChange={(value) => handleDistrictChange(form.getFieldValue('province'), value)}
              disabled={!form.getFieldValue('province')}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="subDistrict"
            label="Sub-district"
            rules={[{ required: true, message: 'กรุณาเลือกแขวง/ตำบล' }]}
          >
            <Select 
              placeholder="Select Sub-district"
              options={subDistricts}
              onChange={handleSubDistrictChange}
              disabled={!form.getFieldValue('district')}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default PersonaForm;