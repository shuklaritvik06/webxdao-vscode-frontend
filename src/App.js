import React from "react";
import "./style.css";

function App() {
  return (
    <div>
      <h1 className="text-4xl">Welcome to React</h1>
      <button
        type="button"
        class="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Get Started
      </button>
    </div>
  );
}

export default App;
