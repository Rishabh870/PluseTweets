// requestMethod.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Replace this with your API base URL

const token = localStorage.getItem("token");

const requestMethod = async (method, url, data, headers = {}) => {
  try {
    const token = localStorage.getItem("token");

    // If a token exists, add it to the headers
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    // You can handle error responses here or rethrow the error for the calling component to handle
    throw error;
  }
};

export default requestMethod;
