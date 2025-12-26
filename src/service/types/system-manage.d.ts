declare namespace Api {
  namespace SystemManage {
    /**
     * 用户性别
     *
     * - "1": 男
     * - "2": 女
     */
    type UserGender = import("../enums").UserGenderValue;
    type UserStatus = import("../enums").UserStatus;

    type User = Common.CommonRecord<{
      username: string;
      nickname: string;
      gender: UserGender | null;
      phone: string;
      email: string;
      status: UserStatus | null;
    }>;
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User> & CommonSearchParams
    >;

    type SystemUserResponse = Common.PaginatingQueryRecord<User>;
  }
}
