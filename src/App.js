import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";

import BlogList from "./components/Blog/BlogList";
import BlogPost from "./components/Blog/BlogPost";
import TagList from "./components/Blog/TagList";
import TagPage from "./components/Blog/TagPage";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Talks from "./components/Talks/Talks";

function App() {
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => updateLoad(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />

      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />
        {/* MAIN CONTENT */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />

            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />

            <Route path="/tags" element={<TagList />} />
            <Route path="/tags/:tag" element={<TagPage />} />

            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/talks" element={<Talks />} />
          </Routes>
        </main>

        <Footer />
        <Analytics /> {/* <--- Add this component at the bottom */}
        <SpeedInsights /> {/* <--- Add this component at the bottom */}
        
      </div>
    </Router>
  );
}


export default App;
