import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../dominio/entities/user.entity";
import AppActions from "../actions";

export interface AuthPayload {
  accessToken?: string;
  user?: User;
}

export interface AuthState {
  user?: User;
  accessToken?: string;
}

export default function authReducer(state: AuthState = {}, action: PayloadAction<AuthPayload>) {
  switch (action.type) {
    case AppActions.LOGIN: {
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    }
    case AppActions.LOGOUT: {
      return {
        ...state,
        user: null,
        accessToken: null,
      }
    }
    case AppActions.SIGNUP: {
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      }
    }
    default: return state;
  }
}

