import React, { useEffect } from "react";
import "./App.css";
import Header from "./Components/Shared/Header/Header";
import Routing from "./Features/Routing/Routing";
import req from "./Hooks/req";
import useUtils from "./Utils/useUtils";
import { shallowEqual, useSelector } from "react-redux";

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
