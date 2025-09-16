import User from "../models/user.model";

export const listUsers = async () => {
  return await User.find().select("-password");
};

export const listReceivers = async () => {
  return await User.find({ role: "receiver" }).select("-password");
};

export const listSenders = async () => {
  return await User.find({ role: "sender" }).select("-password");
};

export const toggleUserBlock = async (id: string, blocked: boolean) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.blocked = blocked;
  await user.save();
  return { id: user._id, blocked: user.blocked };
};

export const listBlockedUsers = async () => {
  return await User.find({ blocked: true }).select("-password");
};
