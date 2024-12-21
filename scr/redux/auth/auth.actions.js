import * as authTypes from './auth.types';

let savedNavigate, savedToastMsg;

const getHelpers = (navigate, toastMsg) => {
    if (toastMsg) savedToastMsg = toastMsg;
    if (navigate) savedNavigate = navigate;
    return {
        navigate: navigate || savedNavigate,
        toastMsg: toastMsg || savedToastMsg,
    };
};

const handleResponse = async (res, dispatch, navigate, toastMsg) => {
    const data = await res.json();

    if (res.status === 401) {
        dispatch({ type: authTypes.AUTH_LOGOUT });
        alert(
            `Session Expired! \n Please Login again.. ${
                navigate ? navigate('/signin') : window.location.replace('/signin')
            }`
        );
        return null;
    }

    return { data, success: res.ok };
};

export const signin = (cred, navigate, toastMsg) => async (dispatch) => {
    const { navigate: nav, toastMsg: toast } = getHelpers(navigate, toastMsg);

    if (!cred.email || !cred.password) {
        toast({ title: 'Email and password are required!', status: 'warning' });
        return;
    }

    dispatch({ type: authTypes.AUTH_LOADING });

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signin`, {
            method: 'POST',
            body: JSON.stringify(cred),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, nav, toast);
        if (!response) return;

        const { data, success } = response;

        if (success) {
            dispatch({ type: authTypes.AUTH_LOGIN_SUCCESS, payload: data.user });
            nav('/');
        } else {
            dispatch({ type: authTypes.AUTH_ERROR });
        }

        toast({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Signin error:', error);
        dispatch({ type: authTypes.AUTH_ERROR });
        toast({ title: error.message, status: 'error' });
    }
};

export const signup = (cred, navigate, toastMsg) => async (dispatch) => {
    const { navigate: nav, toastMsg: toast } = getHelpers(navigate, toastMsg);

    if (!cred.username || !cred.email || !cred.password) {
        toast({ title: 'All fields are required!', status: 'warning' });
        return;
    }

    if (!/\S+@\S+\.\S+/.test(cred.email)) {
        toast({ title: 'Enter a valid email address!', status: 'warning' });
        return;
    }

    if (cred.password.length <= 5) {
        toast({ title: 'Password must contain more than 5 characters!', status: 'warning' });
        return;
    }

    dispatch({ type: authTypes.AUTH_LOADING });

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signup`, {
            method: 'POST',
            body: JSON.stringify(cred),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, nav, toast);
        if (!response) return;

        const { data, success } = response;

        if (success) {
            nav('/signin');
        }
        dispatch({ type: success ? authTypes.AUTH_SUCCESS : authTypes.AUTH_ERROR });

        toast({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Signup error:', error);
        dispatch({ type: authTypes.AUTH_ERROR });
        toast({ title: error.message, status: 'error' });
    }
};
