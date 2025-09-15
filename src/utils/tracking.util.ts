export const generateTrackingId = (): string => {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
  const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `TRK-${datePart}-${randomPart}`;
};
