import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch, InputNumber, Button, Row, Col, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';

// interface for field schema
interface FieldSchema {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
  span?: number;
  dependsOn?: {
    field: string;
    options: Record<string | number, { label: string; value: string | number | boolean }[]>;
  };
  reverseMapping?: { // เพิ่มโครงสร้างสำหรับการแมพย้อนกลับ
    targets: string[]; // ชื่อฟิลด์ที่จะกำหนดค่าเมื่อฟิลด์นี้เปลี่ยน
    values: Record<string | number, Record<string, string | number | boolean>>; // ค่าที่จะกำหนดให้ฟิลด์เป้าหมาย
  };
}

// interface for dynamic form props
interface DynamicFormProps {
  schema: FieldSchema[];
  onSubmit: (values: Record<string, string | number | boolean | Dayjs>) => void;
}

// DynamicForm component
const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const [form] = Form.useForm();
  const [dependentOptions, setDependentOptions] = useState<Record<string, { label: string; value: string | number | boolean }[]>>({});

  // useEffect for dependent options
  useEffect(() => {
    // Initialize dependent options
    const initialDependentOptions: Record<string, { label: string; value: string | number | boolean }[]> = {};
    schema.forEach((field) => {
      if (field.dependsOn) {
        initialDependentOptions[field.name] = [];
      }
    });
    setDependentOptions(initialDependentOptions);

    // get fields with reverse mapping
    const reverseMappingFields = schema.filter(field => field.reverseMapping);
    
    // if there are fields with reverse mapping, set the first field to empty
    if (reverseMappingFields.length > 0) {
      // get the first field with reverse mapping
      const field = reverseMappingFields[0];
      form.setFieldValue(field.name, '');
    }
  }, [form, schema]);

  // update dependent options for all fields
  const updateDependentOptionsForAllFields = (values: Record<string, string | number | boolean>) => {
    // process fields in order (e.g. province -> district -> subdistrict)
    const processedFields = new Set<string>();
    
    // process fields in order (e.g. province -> district -> subdistrict)
    let hasChanges = true;
    while (hasChanges) {
      hasChanges = false;
      
      schema.forEach(field => {
        // skip fields that don't have dependsOn or have already been processed
        if (!field.dependsOn || processedFields.has(field.name)) {
          return;
        }
        
        const dependOnField = field.dependsOn.field;
        const dependOnValue = values[dependOnField];
        
        // if the dependent field has a value and has options
        if (dependOnValue !== undefined && field.dependsOn.options[dependOnValue as string]) {
          setDependentOptions(prev => ({
            ...prev,
            [field.name]: field.dependsOn!.options[dependOnValue as string]
          }));
          
          // if the dependent field has a value, add it to the processed fields
          if (values[field.name]) {
            processedFields.add(field.name);
            hasChanges = true;
          }
        }
      });
    }
  };

  // handle reverse mapping change
  const handleReverseMappingChange = (fieldName: string, value: string | number | boolean) => {
    const field = schema.find(f => f.name === fieldName);
    
    // if the field has reverse mapping, set the value
    if (field?.reverseMapping && field.reverseMapping.targets.length > 0) {
      const targetValues = field.reverseMapping.values[value as string];
      
      if (targetValues) {
        // create an object with key as the field name and value as the value to set
        const valuesToSet = field.reverseMapping.targets.reduce((acc, target) => {
          if (targetValues[target] !== undefined) {
            acc[target] = targetValues[target];
          }
          return acc;
        }, {} as Record<string, string | number | boolean>);
        
        // set the values for the target fields
        form.setFieldsValue(valuesToSet);
        
        // update dependentOptions for the fields that have dependencies
        updateDependentOptionsForAllFields(valuesToSet);
      }
    }
  };

  // handle field change
  const handleFieldChange = (changedValues: Record<string, string | number | boolean>) => {
    const [fieldName, value] = Object.entries(changedValues)[0];
    
    // check and handle reverse mapping (e.g. postcode → province/district/subdistrict)
    handleReverseMappingChange(fieldName, value);
    
    // handle normal dependency (e.g. province → district)
    const dependentFields = schema.filter((field) => field.dependsOn?.field === fieldName);
    
    // update dependent options for the dependent fields
    dependentFields.forEach((field) => {
      if (field.dependsOn?.options[value as string]) {
        setDependentOptions((prev) => ({
          ...prev,
          [field.name]: field.dependsOn!.options[value as string],
        }));
      } else {
        setDependentOptions((prev) => ({
          ...prev,
          [field.name]: [],
        }));
      }
    });
  };

  // render field
  const renderField = (field: FieldSchema) => {
    switch (field.type) {
      case 'string':
        return <Input placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
      case 'boolean':
        return <Switch />;
      case 'select':
        let options = field.options || [];
        
        // if the field has dependsOn, use dependentOptions
        if (field.dependsOn) {
          const dependentOpts = dependentOptions[field.name];
          if (dependentOpts && dependentOpts.length > 0) {
            options = dependentOpts;
          }
        }
        
        return (
          <Select 
            placeholder={field.placeholder || `กรุณาเลือก${field.label}`}
            options={options}
          />
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} placeholder={field.placeholder || `กรุณาเลือก${field.label}`} />;
      default:
        return <Input placeholder={field.placeholder || `กรุณากรอก${field.label}`} />;
    }
  };

  // handle submit
  const handleSubmit = (values: Record<string, string | number | boolean | Dayjs>) => {
    onSubmit(values);
  };

  // group fields into rows
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

  // group fields into rows
  const fieldRows = groupFieldsIntoRows(schema);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 800, margin: '0 auto' }}
      onValuesChange={handleFieldChange}
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