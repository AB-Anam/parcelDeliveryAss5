import User from "../models/user.model";

export const listUsers = async () => {
  return await User.find().select("-password");
};

export const toggleUserBlock = async (id: string, blocked: boolean) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.blocked = blocked;
  await user.save();
  return { id: user._id, blocked: user.blocked };
};
