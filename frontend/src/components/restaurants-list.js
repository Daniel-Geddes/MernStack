import React, { useState } from 'react';
import RestaurantDataService from '../services/restaurant';
import { Link } from 'react-router-dom';

const RestaurantsList = props => {

    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisines, setSearchCuisines] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);

    return (
        <div>
            
        </div>
    )
}

export default RestaurantsList;
