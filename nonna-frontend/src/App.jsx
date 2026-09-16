import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import BuildADish from "./pages/BuildADish";
import Order from "./pages/Order";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import PastOrders from "./pages/PastOrders";   
import Auth from "./pages/Auth";

import Header from "./components/template/Header";
import Footer from "./components/template/Footer";
import ScrollToTop from "./components/template/ScrollToTop";

import { DishBuilderProvider } from "./context/DishBuilderContext";

import "./App.css";

function RouteDebugger() {
  const location = useLocation();
  console.log("ROUTER SEES PATH:", location.pathname);
  return null;
}

export default function App() {

  const [token, setToken] = useState(null);

  return (
    <div className="app-shell">
      <DishBuilderProvider>
        <Header />
        <ScrollToTop />
        <RouteDebugger />

        <main className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buildadish" element={<BuildADish />} />
            <Route path="/cart" element={<Order token={token} />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<Favorites token={token} />} />
            <Route path="/orders" element={<PastOrders token={token} />} />
            <Route path="/auth" element={<Auth setToken={setToken} />} />
          </Routes>
        </main>

        <Footer />
      </DishBuilderProvider>
    </div>
  );
}
