import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 2️⃣ Request Interceptor: Attach the Access Token
api.interceptors.request.use(
    (config) => {
        // Look for the access token in local storage
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 3️⃣ Response Interceptor: The "Silent Refresh" Magic - to get access token when it expires
api.interceptors.response.use(
    (response) => {
        return reponse;
    },
    async (error) => {
        // Store the original request that failed
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) AND we haven't already retried this request
        if (error.response?.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refereshToken = localStorage.getItem("refres_token");

            if (refereshToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/v1/users/login/refresh/`,
                        {
                            referesh: refereshToken,
                        },
                    );

                    const newAccessToken = response.data.access;
                    localStorage.setItem("access_token", newAccessToken);

                    // Update the failed request with the new token and try again!
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refereshToken) {
                    // If the refresh token is ALSO expired, the user needs to log in again.
                    localStorage.removeItem("access_Token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("user");
                    window.location.href = "/login"; // Force redirect to login
                }
            } else {
                // No refresh token exists, force logout
                window.location.href("/login");
            }
        }
        // Return the error so our React components can handle it (e.g., showing a validation e
        //error)
        return Promise.reject(error);
    },
);

export default api;
