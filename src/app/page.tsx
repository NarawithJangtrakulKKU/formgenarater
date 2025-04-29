'use client';

import ImportJsonPage from '@/components/ImportJsonPage';
import { ConfigProvider } from 'antd';
import thTH from 'antd/locale/th_TH';

export default function Home() {
  const handleImport = (jsonData: Record<string, unknown>) => {
    console.log('Imported JSON:', jsonData);
    // Handle the imported JSON data here
  };

  return (
    <ConfigProvider locale={thTH}>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">JSON Importer</h1>
          <ImportJsonPage onImport={handleImport} />
        </div>
      </main>
    </ConfigProvider>
  );
}
