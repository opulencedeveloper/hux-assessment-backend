import User from "../user/entity";
import { IUserInput } from "../user/interface";
import { hashPassword } from "../utils/auth";

class AuthService {
  public async createUser(input: IUserInput) {
    const { userName, password } = input;

    const hashedPassword = await hashPassword(password);

    const user = new User({
      userName,
      password: hashedPassword
    });

    const newUser = await user.save();

    return newUser;
  }
}

export const authService = new AuthService();
