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
  }
}
