import * as taskTypes from './tasks.types';
import { AUTH_LOGOUT } from '../auth/auth.types';

let abortController;
let savedNavigate, savedToastMsg;

const fetchWithAuth = async (url, options = {}) => {
    const token = sessionStorage.getItem('TOKEN');
    const headers = { authorization: token, ...options.headers };

    abortController?.abort();
    abortController = new AbortController();

    return await fetch(url, { ...options, headers, signal: abortController.signal });
};

const handleResponse = async (res, dispatch, navigate, toastMsg) => {
    const data = await res.json();

    if (res.status === 401) {
        dispatch({ type: AUTH_LOGOUT });
        alert(`Session Expired! \nPlease Login again.`);
        navigate ? navigate('/signin') : window.location.replace('/signin');
        return null;
    }

    return { success: res.ok, data };
};

export const getTasks = (boardId, navigate) => async (dispatch) => {
    if (!boardId) return;

    savedNavigate = navigate;

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/board/${boardId}`);
        const response = await handleResponse(res, dispatch, navigate);

        if (!response) return;

        const { success, data } = response;
        if (success) {
            dispatch({ type: taskTypes.GET_TASKS_SUCCESS, payload: data });
        } else {
            dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message });
        }
    } catch (error) {
        console.error('Get Tasks Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
    }
};

export const postTask = (boardId, task, toastMsg) => async (dispatch) => {
    savedToastMsg = toastMsg || savedToastMsg;

    if (!boardId || !task) {
        savedToastMsg?.({
            title: "Can't create Task!",
            description: 'Select a board to create a task inside it.',
            status: 'warning',
        });
        return;
    }

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/task/${boardId}`, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, savedNavigate, savedToastMsg);

        if (!response) return;

        const { success, data } = response;
        if (success) dispatch(getTasks(boardId));

        savedToastMsg?.({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Post Task Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
        savedToastMsg?.({ title: error.message, status: 'error' });
    }
};

export const updateTask = (taskId, boardId, updates, toastMsg) => async (dispatch) => {
    savedToastMsg = toastMsg || savedToastMsg;

    if (!taskId || !boardId || !updates) return;

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/task/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, savedNavigate, savedToastMsg);

        if (!response) return;

        const { success, data } = response;
        if (success) dispatch(getTasks(boardId));

        savedToastMsg?.({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Update Task Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
        savedToastMsg?.({ title: error.message, status: 'error' });
    }
};

export const deleteTask = (taskId, boardId, toastMsg) => async (dispatch) => {
    savedToastMsg = toastMsg || savedToastMsg;

    if (!taskId || !boardId) return;

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/task/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, savedNavigate, savedToastMsg);

        if (!response) return;

        const { success, data } = response;
        if (success) dispatch(getTasks(boardId));

        savedToastMsg?.({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Delete Task Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
        savedToastMsg?.({ title: error.message, status: 'error' });
    }
};

export const postSubTask = (taskId, boardId, subTasks, toastMsg) => async (dispatch) => {
    savedToastMsg = toastMsg || savedToastMsg;

    if (!taskId || !boardId || !subTasks?.length) return;

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/subtask/${taskId}`, {
            method: 'POST',
            body: JSON.stringify(subTasks),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, savedNavigate, savedToastMsg);
        if (!response) return;

        const { success, data } = response;
        if (success) dispatch(getTasks(boardId));

        savedToastMsg?.({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Post SubTask Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
        savedToastMsg?.({ title: error.message, status: 'error' });
    }
};

export const updateSubTask = (subTaskId, boardId, updates, toastMsg) => async (dispatch) => {
    savedToastMsg = toastMsg || savedToastMsg;

    if (!subTaskId || !boardId || !updates) return;

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/subtask/${subTaskId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, savedNavigate, savedToastMsg);
        if (!response) return;

        const { success, data } = response;
        if (success) dispatch(getTasks(boardId));

        savedToastMsg?.({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Update SubTask Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
        savedToastMsg?.({ title: error.message, status: 'error' });
    }
};

export const deleteSubTask = (subTaskId, taskId, boardId, toastMsg) => async (dispatch) => {
    savedToastMsg = toastMsg || savedToastMsg;

    if (!subTaskId || !taskId || !boardId) return;

    dispatch({ type: taskTypes.TASKS_LOADING });

    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_BASE_URL}/subtask/${subTaskId}`, {
            method: 'DELETE',
            body: JSON.stringify({ taskId }),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await handleResponse(res, dispatch, savedNavigate, savedToastMsg);
        if (!response) return;

        const { success, data } = response;
        if (success) dispatch(getTasks(boardId));

        savedToastMsg?.({
            title: data.message,
            status: success ? 'success' : 'warning',
        });
    } catch (error) {
        console.error('Delete SubTask Error:', error);
        dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message });
        savedToastMsg?.({ title: error.message, status: 'error' });
    }
};