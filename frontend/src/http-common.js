import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhose:5000/api/v1/restaurants',
    headers: {
        'Content-type': 'applications/json'
    }
});