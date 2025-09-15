declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: "admin" | "sender" | "receiver";
        email?: string;
      };
    }
  }
}

// Make sure this file is treated as a module
export {};
