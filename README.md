# 📝 Form Generator (Next.js)

โปรเจกต์นี้เป็น Form Generator ที่ใช้ [Next.js](https://nextjs.org/) และ [Ant Design](https://ant.design/) สำหรับสร้างแบบฟอร์มแบบไดนามิกจาก JSON Schema โดยมีฟีเจอร์ในการนำเข้า JSON Schema สร้างแบบฟอร์ม และคัดลอกโค้ด TSX

## 🚀 Features

- นำเข้า JSON Schema ผ่านการพิมพ์หรืออัพโหลดไฟล์
- สร้างแบบฟอร์มแบบไดนามิกจาก JSON Schema
- รองรับฟิลด์หลากหลายประเภท (ข้อความ, ตัวเลข, ตัวเลือก, สวิตช์)
- ตรวจสอบความถูกต้องของข้อมูลอัตโนมัติ
- คัดลอกโค้ด TSX สำหรับใช้ในโปรเจกต์อื่น
- ตัวอย่าง JSON Schema สำหรับการใช้งาน

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
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

## 📋 ตัวอย่าง JSON Schema

```json
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
]
```

---

## 👨‍💻 ผู้พัฒนา

โปรเจ็คนี้พัฒนาโดย นราวิชญ์ จังตระกูล 

หากมีข้อเสนอแนะ หรือต้องการพูดคุยเกี่ยวกับโปรเจกต์นี้ สามารถติดต่อมาได้เลยครับ 🙌
