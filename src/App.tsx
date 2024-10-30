import './App.scss';
import Menu from './components/Menu/Menu';
import MainPage from './components/MainPage/MainPage';
import BackdropImage from './assets/images/main-backdrop.webp';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Settings } from './Settings';
import Loading from './components/Loading/Loading';



function App() {

  const [isLoading, setIsLoading] = useState(true);
  const queryParams = new URLSearchParams(window.location.search);
  const init = async() => {

    try{
        const id = queryParams.get("id");
        const { data } = await axios.get(`${Settings.SERVERURL}restaurant/${id}`);
        localStorage.setItem("restaurantDetails", JSON.stringify({...data, id}));
        console.log("Hello")
        setIsLoading(false);
    }catch(error){
      alert("Something Went Wrong!")
    }
  } 

  useEffect(() => {
    init()
  },[])

  if(isLoading) {
    return <Loading />
  }


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