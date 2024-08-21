import User from "./entity";

class UserService {
  public async findUserByUserName(userName: string) {
    
    const user = await User.findOne({
      userName: userName,
    });

    return user;
  }

  public async findUserById(id: string) {
    const user = await User.findById(id);

    return user;
  }
}

export const userService = new UserService();
