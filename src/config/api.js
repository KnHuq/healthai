const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://10.225.209.27:5001',
    ENDPOINTS: {
        FORMULATION_DATA: '/api/formulation_data',
        INITIAL_STATE: '/api/initial_state'
    }
};

export default API_CONFIG; 