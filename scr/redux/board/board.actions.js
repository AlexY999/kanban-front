import * as boardTypes from './board.types';
import { AUTH_LOGOUT } from '../auth/auth.types';
import { DELETE_TASKS } from '../tasks/tasks.types';

let savedNavigate;

const fetchWithAuth = async (url, options = {}) => {
    const token = sessionStorage.getItem('TOKEN');
    const headers = { 'authorization': token, ...options.headers };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    return { response, data };
};

const handleError = (response, dispatch, navigate) => {
    if (response.status === 401) {
        dispatch({ type: AUTH_LOGOUT });
        alert(`Session Expired! \nPlease Login again.`);
        if (navigate) navigate('/signin');
        else window.location.replace('/signin');
        return true;
    }
    return false;
};

export const getBoards = (navigate) => async (dispatch) => {
    savedNavigate = navigate;

    dispatch({ type: boardTypes.BOARD_LOADING });

    try {
        const { response, data } = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/board`);

        if (handleError(response, dispatch, savedNavigate)) return;

        if (response.ok) {
            dispatch({ type: boardTypes.GET_BOARD_SUCCESS, payload: data });
        } else {
            dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message });
        }
    } catch (error) {
        console.error('Get Boards Error:', error);
        dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message });
    }
};

export const createBoard = (boardName) => async (dispatch) => {
    if (!boardName) return;

    dispatch({ type: boardTypes.BOARD_LOADING });

    try {
        const { response, data } = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/board`, {
            method: 'POST',
            body: JSON.stringify({ name: boardName }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (handleError(response, dispatch, savedNavigate)) return;

        if (response.ok) {
            dispatch(getBoards());
        } else {
            dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message });
        }
    } catch (error) {
        console.error('Create Board Error:', error);
        dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message });
    }
};

export const editBoard = (boardId, boardName) => async (dispatch) => {
    if (!boardId || !boardName) return;

    dispatch({ type: boardTypes.BOARD_LOADING });

    try {
        const { response, data } = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/board/${boardId}`, {
            method: 'PATCH',
            body: JSON.stringify({ name: boardName }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (handleError(response, dispatch, savedNavigate)) return;

        if (response.ok) {
            dispatch(getBoards());
        } else {
            dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message });
        }
    } catch (error) {
        console.error('Edit Board Error:', error);
        dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message });
    }
};

export const deleteBoard = (boardId) => async (dispatch) => {
    if (!boardId) return;

    dispatch({ type: boardTypes.BOARD_LOADING });

    try {
        const { response, data } = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/board/${boardId}`, {
            method: 'DELETE',
        });

        if (handleError(response, dispatch, savedNavigate)) return;

        if (response.ok) {
            dispatch({ type: DELETE_TASKS });
            dispatch(getBoards());
        } else {
            dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message });
        }
    } catch (error) {
        console.error('Delete Board Error:', error);
        dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message });
    }
};
