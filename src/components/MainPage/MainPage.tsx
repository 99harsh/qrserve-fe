import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Style.scss";
import axios from "axios";
import { Settings } from "../../Settings";
import Loading from "../Loading/Loading";
import { useLocation } from 'react-router-dom';


const MainPage = (props: any, route: any) => {

    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState<any>({});
    const [restaurantId, setRestaurantId] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {

        const id = queryParams.get('id');
        if (id) {
            setRestaurantId(id);
            init(id);
        } else {
            alert("ID IS MISSING!")
        }
    }, [])

    const init = async (id:string) => {
        try {
            const { data } = await axios.get(`${Settings.SERVERURL}restaurant/${id}`);
            setRestaurant(data);
            setLoading(false);

        } catch (error) {
            alert("Something Went Wrong!")
        }
    }

    const navigationHandler = () => {
        navigate(`/menu-details?id=${restaurantId}`);
    }


    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <div className="menu-mainpage-container">
            <div className="menu-heading-wrapper">
                <div className="menu-content-container">
                    <div className="menu-heading-container">
                        <div>
                            <span className="menu-heading">{restaurant.name}</span>
                        </div>
                        <div>
                            <span className="menu-address">{restaurant.address}</span>
                        </div>
                        <div>
                            <span className="menu-by">MENU BY</span>
                        </div>
                        <div>
                            <span className="menu-ui">U4R.in</span>
                        </div>
                        <div className="menu-ui-button-container">
                            <button className="menu-ui-button"
                                onClick={() => {
                                    navigationHandler()
                                }}>Explore Menu
                                <svg fill="#fff" height="15px" width="15px" version="1.1" id="Layer_1"
                                    viewBox="0 0 330 330">
                                    <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
	C255,161.018,253.42,157.202,250.606,154.389z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="menu-footer-container">
                <span>+91 7987343242 | +91 9685172952 | U4R.in</span>
            </div>
        </div>
    )
};

export default MainPage;
