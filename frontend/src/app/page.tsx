import Header from '../components/Header';
import CurrencyConverter from '../components/CurrencyConverter';
import ExchangeRateChart from '../components/HistoricalRates';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Send money internationally
            </h1>
            <p className="text-lg text-gray-600">
              Get the real exchange rate with no hidden fees
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <ExchangeRateChart />
            </div>
            <div className="order-1 lg:order-2">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
