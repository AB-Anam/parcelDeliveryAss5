import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES = "7d";

export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already in use");
  const user = await User.create({ name, email, password, role });
  return { id: user._id, email: user.email, role: user.role };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  if (user.blocked) throw new Error("User is blocked");
  const matched = await user.comparePassword(password);
  if (!matched) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, user: { id: user._id, email: user.email, role: user.role } };
};

export const getUserById = async (id: string) => {
  return await User.findById(id).select("-password");
};
