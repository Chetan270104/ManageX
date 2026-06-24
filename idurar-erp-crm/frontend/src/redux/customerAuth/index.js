export const CUSTOMER_AUTH_TYPES = {
  LOADING: 'CUSTOMER_AUTH/LOADING',
  LOGIN_SUCCESS: 'CUSTOMER_AUTH/LOGIN_SUCCESS',
  REGISTER_SUCCESS: 'CUSTOMER_AUTH/REGISTER_SUCCESS',
  LOGOUT: 'CUSTOMER_AUTH/LOGOUT',
  ERROR: 'CUSTOMER_AUTH/ERROR',
};

const getInitialState = () => {
  try {
    const token = localStorage.getItem('customerToken');
    const customer = JSON.parse(localStorage.getItem('customerInfo') || 'null');
    if (token && customer) return { isLoggedIn: true, token, customer, isLoading: false, error: null };
  } catch (_) {}
  return { isLoggedIn: false, token: null, customer: null, isLoading: false, error: null };
};

export function customerAuthReducer(state = getInitialState(), action) {
  switch (action.type) {
    case CUSTOMER_AUTH_TYPES.LOADING:
      return { ...state, isLoading: true, error: null };
    case CUSTOMER_AUTH_TYPES.LOGIN_SUCCESS:
    case CUSTOMER_AUTH_TYPES.REGISTER_SUCCESS:
      localStorage.setItem('customerToken', action.payload.token);
      localStorage.setItem('customerInfo', JSON.stringify(action.payload.customer));
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        token: action.payload.token,
        customer: action.payload.customer,
        error: null,
      };
    case CUSTOMER_AUTH_TYPES.LOGOUT:
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerInfo');
      return { isLoggedIn: false, token: null, customer: null, isLoading: false, error: null };
    case CUSTOMER_AUTH_TYPES.ERROR:
      return { ...state, isLoading: false, error: action.payload || 'Something went wrong' };
    default:
      return state;
  }
}

const API_BASE = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:8888';

const customerAuthRequest = async (path, body) => {
  const res = await fetch(`${API_BASE}/api/customer/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const customerLogin = (email, password) => async (dispatch) => {
  dispatch({ type: CUSTOMER_AUTH_TYPES.LOADING });
  try {
    const data = await customerAuthRequest('login', { email, password });
    if (data.success) {
      dispatch({ type: CUSTOMER_AUTH_TYPES.LOGIN_SUCCESS, payload: data.result });
    } else {
      dispatch({ type: CUSTOMER_AUTH_TYPES.ERROR, payload: data.message });
    }
  } catch {
    dispatch({ type: CUSTOMER_AUTH_TYPES.ERROR, payload: 'Unable to connect to the server' });
  }
};

export const customerRegister = (name, email, password) => async (dispatch) => {
  dispatch({ type: CUSTOMER_AUTH_TYPES.LOADING });
  try {
    const data = await customerAuthRequest('register', { name, email, password });
    if (data.success) {
      dispatch({ type: CUSTOMER_AUTH_TYPES.REGISTER_SUCCESS, payload: data.result });
    } else {
      dispatch({ type: CUSTOMER_AUTH_TYPES.ERROR, payload: data.message });
    }
  } catch {
    dispatch({ type: CUSTOMER_AUTH_TYPES.ERROR, payload: 'Unable to connect to the server' });
  }
};

export const customerLogout = () => ({ type: CUSTOMER_AUTH_TYPES.LOGOUT });

export const selectCustomerAuth = (state) => state.customerAuth;
