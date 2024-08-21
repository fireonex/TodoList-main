import { LoginParamsType } from "../../api/todolists-api";
import axios from "axios";


const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  ...settings,
});

export const authAPI = {
  login(data: LoginParamsType) {
    const promise = instance.post<ResponseType<{ userId?: number }>>(
      'auth/login',
      data,
    );
    return promise;
  },
  logout() {
    const promise =
      instance.delete<ResponseType<{ userId?: number }>>('auth/login');
    return promise;
  },
  me() {
    const promise =
      instance.get<
        ResponseType<{ id: number; email: string; login: string }>
      >('auth/me');
    return promise;
  },
};