const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://192.168.0.10:5001',
    ENDPOINTS: {
        FORMULATION_DATA: '/api/formulation_data',
        INITIAL_STATE: '/api/initial_state'
    }
};

export default API_CONFIG; 