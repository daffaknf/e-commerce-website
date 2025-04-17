import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="font-sans">
      <Navbar />
      <HeroSection />
    </div>
  );
}

export default App;
