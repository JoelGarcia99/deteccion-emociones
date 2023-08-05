import { User } from "../../../dominio/entities/user.entity";
import AppActions from "../actions";
import { AppDispatch } from "../store"

export default class UserController {
  public update(user: User) {
    return async (dispatch: AppDispatch) => {

      const host = process.env.REACT_APP_API_HOST;
      const uri = `${host}/api/user/${user.id}`;

      const response = await fetch(uri, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: user.nombre,
          emailRecuperacion: user.emailRecuperacion,
          password: user.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      // Updating the user on local storage
      localStorage.setItem("de-user", JSON.stringify(user));
      dispatch({
        type: AppActions.UPDATE_USER,
        payload: {
          user,
        }
      });
      alert('Usuario actualizado');
    }
  }

  public logout() {
    localStorage.removeItem("de-token");
    localStorage.removeItem("de-user");

    return {
      type: AppActions.LOGOUT,
    }
  }

  public signup(user: User, password: string) {
    return async (dispatch: AppDispatch) => {
      const host = process.env.REACT_APP_API_HOST;
      const uri = `${host}/api/auth/signup`;

      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user.email,
          nombre: user.nombre,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          return alert(data.message[0]);
        }
        return alert(data.error);
      }

      // guardando en local storage
      localStorage.setItem("de-token", data.token);
      localStorage.setItem("de-user", JSON.stringify(data.user));

      dispatch({
        type: AppActions.SIGNUP,
        payload: {
          user: data.user,
          accessToken: data.token,
        }
      });
    }
  }
}

