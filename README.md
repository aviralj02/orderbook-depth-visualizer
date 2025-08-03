## Orderbook Depth 3D Visualizer

A real-time 3D visualization tool for analyzing cryptocurrency orderbook depth and pressure zones. This project helps traders and analysts spot liquidity clusters, support/resistance zones, and market pressure using an interactive 3D interface.

### ⚒️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Three.js](https://threejs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)

### 🧮 Pressure Zone Algorithm

- Clusters levels using a sliding window of 3 price levels

- Calculates intensity based on normalized volume

- Classifies zones as high, medium, or low pressure

- Positions zones in 3D space with varying size and color

## 🔩 Local Setup

```bash
git clone https://github.com/aviralj02/orderbook-depth-visualizer

cd orderbook-depth-visualizer

yarn install
yarn dev
```
