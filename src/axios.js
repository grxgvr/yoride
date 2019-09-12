import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://trip-3b743.firebaseio.com/'
});

export default instance;