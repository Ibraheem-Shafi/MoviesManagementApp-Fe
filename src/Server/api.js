import axios from "axios";
import { BACKEND_URL } from "./helper";

const getAuthToken = () => {
    return localStorage.getItem("token");
}

//Users
export const registerUser = async (data) => {
    return await axios.post(`${BACKEND_URL}users/register`, data, {
        headers: {
            'Content-Type': 'multipart/form-data', // content type for file uploads
        },
    });
};

export const verifyUser = async (data) => {
    return await axios.post(`${BACKEND_URL}user/verify`, data);
};

export const forgotPassword = async (data) => {
    return await axios.post(`${BACKEND_URL}user/forgot-password`, data);
};

export const resetPassword = async (data, token) => {
    return await axios.post(`${BACKEND_URL}user/reset-password/${token}`, data);
};

export const getAllUsers = async () => {
    return await axios.get(`${BACKEND_URL}users`);
};

export const userLogin = async (data) => {
    return await axios.post(`${BACKEND_URL}user/login`, data);
}

export const getUserById = async (id) => {
    return await axios.get(`${BACKEND_URL}user/${id}`);
}

export const updateProfile = async (data) => {
    const token = getAuthToken();
    return await axios.post(`${BACKEND_URL}user/updateProfile`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const userLogout = async () => {
    return await axios.post(`${BACKEND_URL}users/logout`); // Add endpoint for logging out
};

// Movies

export const fetchMovies = async (params) => {
    return await axios.get(`${BACKEND_URL}movies`, {
        params
    });
};

export const addMovieToFavorites = async (userId, movieData) => {
    const token = getAuthToken();
    return await axios.post(
        `${BACKEND_URL}movie/add-to-favorites/${userId}`,
        { movieData },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const getFavoriteMovies = async (userId) => {
    const token = getAuthToken();
    return await axios.get(`${BACKEND_URL}movies/get-favorite-movies/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const removeMovieFromFavorite = async (userId, movieId) => {
    const token = getAuthToken();
    return await axios.put(
        `${BACKEND_URL}movie/remove-from-favorites/${userId}`,
        { movieId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};