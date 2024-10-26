import './App.scss';
import Menu from './components/Menu/Menu';
import MainPage from './components/MainPage/MainPage';
import BackdropImage from './assets/images/main-backdrop.webp';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="menu-ui-container">
      <div className="menu-ui-backdrop">
        <img src={BackdropImage} alt="Backdrop" />
      </div>
      <div className="menu-ui-component">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/menu-details" element={<Menu />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;