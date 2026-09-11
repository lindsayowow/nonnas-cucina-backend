import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BuildADish from "./pages/BuildADish";
import Order from "./pages/Order";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";

import Header from "./components/template/Header";
import Footer from "./components/template/Footer";
import ScrollToTop from "./components/template/ScrollToTop";

import { DishBuilderProvider } from "./context/DishBuilderContext";

import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <DishBuilderProvider>
        <Header />
        <ScrollToTop />

        <main className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buildadish" element={<BuildADish />} />
            <Route path="/cart" element={<Order />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>

        <Footer />

      </DishBuilderProvider>
    </div>
  );
}
