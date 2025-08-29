import Header from '@/src/components/Header';
import UnitConverter from '@/src/components/UnitConverter';

export default function DoiDonViPage() {
  return (
    <>
      <Header />
      {/* 👇 Sửa ở dòng dưới đây */}
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Đổi đơn vị</h1>
          <p className="text-lg text-gray-600">Chiều dài, khối lượng, nhiệt độ</p>
        </div>

        <div className="w-full max-w-2xl">
          <UnitConverter />
        </div>
      </main>
    </>
  );
}