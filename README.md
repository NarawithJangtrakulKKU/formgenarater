# 📝 Form Generator (Next.js)

โปรเจกต์นี้เป็น Form Generator ที่ใช้ [Next.js](https://nextjs.org/) และ [Ant Design](https://ant.design/) สำหรับสร้างแบบฟอร์มแบบไดนามิกจาก JSON Schema โดยมีฟีเจอร์ในการนำเข้า JSON Schema สร้างแบบฟอร์ม และคัดลอกโค้ด TSX

## 🚀 Features

- นำเข้า JSON Schema ผ่านการพิมพ์หรืออัพโหลดไฟล์
- สร้างแบบฟอร์มแบบไดนามิกจาก JSON Schema
- รองรับฟิลด์หลากหลายประเภท:
  - ข้อความ (string)
  - ตัวเลข (number)
  - ตัวเลือก (select)
  - สวิตช์ (boolean)
  - วันที่ (date)
- ตรวจสอบความถูกต้องของข้อมูลอัตโนมัติ
- คัดลอกโค้ด TSX สำหรับใช้ในโปรเจกต์อื่น
- รองรับการกำหนด layout ด้วย span (1-24)
- แสดงข้อความแจ้งเตือนที่ชัดเจนเมื่อ JSON ไม่ถูกต้อง
- ตัวอย่าง JSON Schema สำหรับการใช้งาน
- รองรับการเชื่อมโยงระหว่างฟิลด์ (Dependent Fields)
- รองรับการแมพย้อนกลับ (Reverse Mapping)

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)

---

## 📦 การติดตั้งและรันโปรเจกต์

1. **Clone โปรเจกต์นี้ลงเครื่อง**

```bash
git clone https://github.com/NarawithJangtrakulKKU/formgenerator.git
cd formgenerator
```

2. **ติดตั้ง dependencies**

```bash
npm install 
```

3. **run project** 

```bash
npm run dev 
```

4. **เปิด Browser**
```bash
http://localhost:3000
```

---

## 📝 รูปแบบ JSON Schema

แต่ละ field ต้องมี properties ดังนี้:
- `type`: ประเภทของฟิลด์ (string, number, select, boolean, date)
- `label`: ข้อความที่แสดงในฟอร์ม
- `name`: ชื่อของฟิลด์ (ใช้ในการส่งข้อมูล)
- `required`: กำหนดว่าฟิลด์นี้จำเป็นต้องกรอกหรือไม่ (optional)
- `span`: ความกว้างของฟิลด์ (1-24) (optional)
- `options`: ตัวเลือกสำหรับฟิลด์ประเภท select (required สำหรับ type select)
- `placeholder`: ข้อความ placeholder (optional)
- `dependsOn`: กำหนดการเชื่อมโยงกับฟิลด์อื่น (optional)
  - `field`: ชื่อฟิลด์ที่เชื่อมโยง
  - `options`: ตัวเลือกที่เปลี่ยนแปลงตามค่าของฟิลด์ที่เชื่อมโยง
- `reverseMapping`: กำหนดการแมพย้อนกลับ (optional)
  - `targets`: รายชื่อฟิลด์ที่จะถูกกำหนดค่า
  - `values`: ค่าที่จะกำหนดให้ฟิลด์เป้าหมาย

### ตัวอย่างฟิลด์ที่มีการเชื่อมโยง
```json
{
  "type": "select",
  "label": "อำเภอ/เขต",
  "name": "district",
  "required": true,
  "span": 12,
  "dependsOn": {
    "field": "province",
    "options": {
      "bangkok": [
        { "label": "คลองเตย", "value": "khlongtoei" },
        { "label": "วัฒนา", "value": "watthana" }
      ],
      "chiangmai": [
        { "label": "เมืองเชียงใหม่", "value": "muang" },
        { "label": "สันทราย", "value": "sansai" }
      ]
    }
  }
}
```

### ตัวอย่างฟิลด์ที่มีการแมพย้อนกลับ
```json
{
  "type": "select",
  "label": "รหัสไปรษณีย์",
  "name": "postcode",
  "required": true,
  "span": 12,
  "options": [
    { "label": "10200", "value": "10200" },
    { "label": "10300", "value": "10300" }
  ],
  "reverseMapping": {
    "targets": ["province", "district", "subdistrict"],
    "values": {
      "10200": {
        "province": "กรุงเทพมหานคร",
        "district": "พระนคร",
        "subdistrict": "พระบรมมหาราชวัง"
      },
      "10300": {
        "province": "กรุงเทพมหานคร",
        "district": "วัฒนา",
        "subdistrict": "คลองเตย"
      }
    }
  }
}
```

---

## 📋 ตัวอย่าง JSON Schema

### 1. ตัวอย่างพื้นฐาน
```json
[
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
  }
]
```

### 2. ตัวอย่างฟอร์มที่อยู่ที่มีการเชื่อมโยง
```json
[
  {
    "type": "string",
    "label": "บ้านเลขที่",
    "name": "houseNumber",
    "required": true,
    "span": 12
  },
  {
    "type": "string",
    "label": "หมู่ที่",
    "name": "moo",
    "span": 12
  },
  {
    "type": "select",
    "label": "จังหวัด",
    "name": "province",
    "required": true,
    "options": [
      { "label": "กรุงเทพมหานคร", "value": "bangkok" },
      { "label": "เชียงใหม่", "value": "chiangmai" }
    ],
    "span": 12
  },
  {
    "type": "select",
    "label": "อำเภอ/เขต",
    "name": "district",
    "required": true,
    "span": 12,
    "dependsOn": {
      "field": "province",
      "options": {
        "bangkok": [
          { "label": "คลองเตย", "value": "khlongtoei" },
          { "label": "วัฒนา", "value": "watthana" }
        ],
        "chiangmai": [
          { "label": "เมืองเชียงใหม่", "value": "muang" },
          { "label": "สันทราย", "value": "sansai" }
        ]
      }
    }
  }
]
```

### 3. ตัวอย่างฟอร์มข้อมูลการติดต่อ
```json
[
  {
    "type": "string",
    "label": "อีเมล",
    "name": "email",
    "required": true,
    "span": 12
  },
  {
    "type": "string",
    "label": "เบอร์โทรศัพท์",
    "name": "phone",
    "required": true,
    "span": 12
  },
  {
    "type": "select",
    "label": "ประเภทการติดต่อ",
    "name": "contactType",
    "required": true,
    "options": [
      { "label": "อีเมล", "value": "email" },
      { "label": "โทรศัพท์", "value": "phone" },
      { "label": "ไลน์", "value": "line" }
    ],
    "span": 12
  },
  {
    "type": "boolean",
    "label": "ยินยอมรับข่าวสาร",
    "name": "acceptNewsletter",
    "span": 12
  }
]
```

---

## 👨‍💻 ผู้พัฒนา

โปรเจ็คนี้พัฒนาโดย นราวิชญ์ จังตระกูล 

หากมีข้อเสนอแนะ หรือต้องการพูดคุยเกี่ยวกับโปรเจกต์นี้ สามารถติดต่อมาได้เลยครับ 🙌
