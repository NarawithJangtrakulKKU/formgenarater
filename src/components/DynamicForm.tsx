import React, { useState, useEffect } from 'react';
import { Input, Select, Switch, InputNumber, Button, Row, Col, DatePicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
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
  reverseMapping?: {
    targets: string[];
    values: Record<string | number, Record<string, string | number | boolean>>;
  };
}

// interface for dynamic form props
interface DynamicFormProps {
  schema: FieldSchema[];
  onSubmit: (values: Record<string, string | number | boolean | Dayjs>) => void;
}

// DynamicForm component
const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const { control, handleSubmit, setValue } = useForm();
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
      const field = reverseMappingFields[0];
      setValue(field.name, '');
    }
  }, [schema, setValue]);

  // update dependent options for all fields
  const updateDependentOptionsForAllFields = (values: Record<string, string | number | boolean>) => {
    const processedFields = new Set<string>();
    let hasChanges = true;
    
    while (hasChanges) {
      hasChanges = false;
      
      schema.forEach(field => {
        if (!field.dependsOn || processedFields.has(field.name)) {
          return;
        }
        
        const dependOnField = field.dependsOn.field;
        const dependOnValue = values[dependOnField];
        
        if (dependOnValue !== undefined && field.dependsOn.options[dependOnValue as string]) {
          setDependentOptions(prev => ({
            ...prev,
            [field.name]: field.dependsOn!.options[dependOnValue as string]
          }));
          
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
    
    if (field?.reverseMapping && field.reverseMapping.targets.length > 0) {
      const targetValues = field.reverseMapping.values[value as string];
      
      if (targetValues) {
        const valuesToSet = field.reverseMapping.targets.reduce((acc, target) => {
          if (targetValues[target] !== undefined) {
            acc[target] = targetValues[target];
          }
          return acc;
        }, {} as Record<string, string | number | boolean>);
        
        Object.entries(valuesToSet).forEach(([key, value]) => {
          setValue(key, value);
        });
        
        updateDependentOptionsForAllFields(valuesToSet);
      }
    }
  };

  // handle field change
  const handleFieldChange = (fieldName: string, value: string | number | boolean) => {
    handleReverseMappingChange(fieldName, value);
    
    const dependentFields = schema.filter((field) => field.dependsOn?.field === fieldName);
    
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
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <Input
                  placeholder={field.placeholder || `กรุณากรอก${field.label}`}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange(field.name, e.target.value);
                  }}
                />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
        );
      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder={field.placeholder || `กรุณากรอก${field.label}`}
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                    handleFieldChange(field.name, value);
                  }}
                />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
        );
      case 'boolean':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <Switch
                  checked={value}
                  onChange={(checked) => {
                    onChange(checked);
                    handleFieldChange(field.name, checked);
                  }}
                />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
        );
      case 'select':
        let options = field.options || [];
        
        if (field.dependsOn) {
          const dependentOpts = dependentOptions[field.name];
          if (dependentOpts && dependentOpts.length > 0) {
            options = dependentOpts;
          }
        }
        
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <Select
                  placeholder={field.placeholder || `กรุณาเลือก${field.label}`}
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                    handleFieldChange(field.name, value);
                  }}
                  options={options}
                />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
        );
      case 'date':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={field.placeholder || `กรุณาเลือก${field.label}`}
                  value={value}
                  onChange={(date) => {
                    onChange(date);
                    handleFieldChange(field.name, date);
                  }}
                />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
        );
      default:
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <Input
                  placeholder={field.placeholder || `กรุณากรอก${field.label}`}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange(field.name, e.target.value);
                  }}
                />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
        );
    }
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

  const fieldRows = groupFieldsIntoRows(schema);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      {fieldRows.map((row, rowIndex) => (
        <Row key={rowIndex} gutter={16}>
          {row.map((field) => (
            <Col key={field.name} span={field.span || 24}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            </Col>
          ))}
        </Row>
      ))}
      <div className="mt-6">
        <Button type="primary" htmlType="submit" block>
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;