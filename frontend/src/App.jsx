import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {EventsOn} from "../wailsjs/runtime/runtime.js"
import { useEffect } from 'react';

import Home from "./pages/Home.jsx";
import About from './pages/About.jsx';
import Configuration from './pages/Configuration.jsx';
import Connect from './pages/Connect.jsx';
import Monitor from './pages/Monitor.jsx';
import ConsoleWindow from './pages/ConsoleWindow.jsx'
function App() {
    return (
    <Router>
      <AppWithNavigation />
    </Router>
    )
}

function AppWithNavigation() {
  const navigate = useNavigate();
  useEffect(()=>{
    EventsOn('navigate', (path) => {
      navigate(path);
    });
  },[navigate])
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/monitor/console/:deviceId" element={<ConsoleWindow />} />
      </Routes>
    );
}


export default App
