import { OrderbookVisualizer } from "@/components/OrderBookVisualizer";

export default function Home() {
  return (
    <main className="w-full h-screen bg-gray-900 overflow-hidden">
      <OrderbookVisualizer />
    </main>
  );
}
