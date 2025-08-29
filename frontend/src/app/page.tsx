import Header from '../components/Header';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chuyển đổi tiền tệ
            </h1>
            <p className="text-lg text-gray-600">
              Tỉ giá theo thời gian thực
            </p>
          </div>

          <div className="flex justify-center">
            <CurrencyConverter />
          </div>
        </div>
      </main>
    </>
  );
}
