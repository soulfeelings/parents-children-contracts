import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/auth";
import { LoginRequest, RegisterRequest } from "../../api/types";
import {
  setUser,
  setToken,
  setLoading,
  setError,
  logout,
} from "../slices/authSlice";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      debugger;

      const response = await authApi.login(data);

      dispatch(setUser(response.user));
      dispatch(setToken(response.token));

      localStorage.setItem("token", response.token);

      return response;
    } catch (error: any) {
      debugger;
      const errorMessage =
        error.response?.data?.message || "Ошибка при входе в систему";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authApi.register(data);

      dispatch(setUser(response.user));
      dispatch(setToken(response.token));

      localStorage.setItem("token", response.token);

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Ошибка при регистрации";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));

      authApi.logout();
      dispatch(logout());

      localStorage.removeItem("token");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Ошибка при выходе из системы";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
