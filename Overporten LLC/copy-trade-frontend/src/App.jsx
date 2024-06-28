import React from "react";
import "./App.css";
import Header from "./Components/Shared/Header/Header";
import Routing from "./Features/Routing/Routing";

function App() {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Routing />
      </main>
    </div>
  );
}

export default App;
