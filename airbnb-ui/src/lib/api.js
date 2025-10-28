export const API_BASE_URL = 'http://localhost:3001/api';
// Base host used for serving uploaded files (strip the /api suffix)
export const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Normalize image/file URLs returned from the backend. If the path is a
// relative upload path (e.g. "/uploads/xyz.jpg"), prefix it with the
// backend host so the browser can fetch it (http://localhost:3001/uploads/...).
export function resolveImageUrl(path) {
    const fallback = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600';
    if (!path) return fallback;
    try {
        if (typeof path !== 'string') return fallback;
        const trimmed = path.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
        if (trimmed.startsWith('/')) return `${FILE_BASE_URL}${trimmed}`;
        // otherwise treat as relative and prefix
        return `${FILE_BASE_URL}/${trimmed}`;
    } catch (e) {
        return fallback;
    }
}

// Utility function for API calls
async function fetchApi(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Important for session handling
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || response.statusText);
    }

    return response.json();
}

// Authentication API
export const authApi = {
    signup: (userData) => fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    login: (credentials) => fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    logout: () => fetchApi('/auth/logout', { method: 'POST' }),

    getCurrentUser: () => fetchApi('/auth/me'),
};

// Properties API
export const propertiesApi = {
    getAll: (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        return fetchApi(`/properties${queryString ? `?${queryString}` : ''}`);
    },

    search: (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        return fetchApi(`/properties/search${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => fetchApi(`/properties/${id}`),
};

// Traveler API
export const travelerApi = {
    getProfile: () => fetchApi('/traveler/profile'),

    updateProfile: (profileData) => fetchApi('/traveler/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    }),

    getFavorites: () => fetchApi('/traveler/favorites'),

    addFavorite: (propertyId) => fetchApi(`/traveler/favorites/${propertyId}`, {
        method: 'POST',
    }),

    removeFavorite: (propertyId) => fetchApi(`/traveler/favorites/${propertyId}`, {
        method: 'DELETE',
    }),

    getHistory: () => fetchApi('/traveler/history'),
};

// Owner API
export const ownerApi = {
    getProfile: () => fetchApi('/owner/profile'),

    updateProfile: (profileData) => fetchApi('/owner/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    }),

    getProperties: () => fetchApi('/owner/properties'),

    createProperty: (propertyData) => fetchApi('/owner/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
    }),

    updateProperty: (propertyId, propertyData) => fetchApi(`/owner/properties/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
    }),

    deleteProperty: (propertyId) => fetchApi(`/owner/properties/${propertyId}`, {
        method: 'DELETE',
    }),

    getDashboard: () => fetchApi('/owner/dashboard'),
};

// Bookings API
export const bookingsApi = {
    create: (bookingData) => fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    }),

    getAll: () => fetchApi('/bookings'),

    getById: (bookingId) => fetchApi(`/bookings/${bookingId}`),

    accept: (bookingId) => fetchApi(`/bookings/${bookingId}/accept`, {
        method: 'PUT',
    }),

    cancel: (bookingId) => fetchApi(`/bookings/${bookingId}/cancel`, {
        method: 'PUT',
    }),
};

// Upload API
export const uploadApi = {
    propertyPhoto: async (propertyId, file) => {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch(`${API_BASE_URL}/upload/property/${propertyId}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },

    profilePicture: async (file) => {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch(`${API_BASE_URL}/upload/profile`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Upload failed';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        return response.json();
    },
};
