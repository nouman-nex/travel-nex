import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import axios from "axios";

export const DESKTOP_API_BASE_URL = "http://localhost:8000/desktop/api";
// export const API_BASE_URL = "http://localhost:8000/user/api";
// export const MEDIA_BASE_URL = "http://localhost:8000/uploads";

export const API_BASE_URL = "http://localhost:8000/user/api";
export const MEDIA_BASE_URL = "http://localhost:8000/uploads";

// export const API_BASE_URL_Frontend = "http://localhost:3000/auth/signup";

function updateAuthorizationHeader() {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["authorization"] = "Bearer " + token;
}


export function postRequest(url, params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(API_BASE_URL + url, params)
    .then((response) => {
      if (callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}
export function postRequestDesktop(url, params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(DESKTOP_API_BASE_URL + url, params)
    .then((response) => {
      if (callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}
export function getCompanies(callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .get(API_BASE_URL + "/getAllCompanies")
    .then((response) => {
      if (callback) {
        callback(response.data.companies);
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, clientData);
    console.log("Client created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating client:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getClients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    console.log("API Response:", response.data);

    // Agar response.data ek array hai, to usko use karo
    const clientsArray = Array.isArray(response.data) ? response.data : [];

    return clientsArray.map(({ name, ...rest }) => ({
      ...rest,
      contact: name,
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const updateClient = async (_id, clientData) => {
  console.log("id", _id);
  const response = await axios.put(`${API_BASE_URL}/${_id}`, clientData);
  return response.data;
};
