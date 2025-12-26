declare namespace Api {
  namespace Auth {
    type LoginParams = {
      password: string;
      username: string;
    };
    type LoginResponse = LoginToken;
    interface LoginToken {
      code: number;
      msg: string;
      data: {
        token: string;
        refreshToken: string;
      };
    }
    interface UserInfoResponse {
      code: number;
      msg: string;
      data: {
        userId: string;
        username: string;
        name: string;
        buttons: string[];
        roles: string[];
      };
    }
  }
}
