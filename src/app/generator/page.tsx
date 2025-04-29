'use client';

import ImportJsonPage from '@/components/ImportJsonPage';
import { ConfigProvider, Typography, Button } from 'antd';
import thTH from 'antd/locale/th_TH';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function GeneratorPage() {
  const router = useRouter();

  const handleImport = (jsonData: Record<string, unknown>) => {
    console.log('Imported JSON:', jsonData);
    // Handle the imported JSON data here
  };

  return (
    <ConfigProvider locale={thTH}>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <Title level={2}>Form Generator</Title>
            <Button onClick={() => router.push('/')}>
              กลับหน้าหลัก
            </Button>
          </div>
          <ImportJsonPage onImport={handleImport} />
        </div>
      </main>
    </ConfigProvider>
  );
} 