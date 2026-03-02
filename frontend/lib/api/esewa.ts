import axios from "./axios";

export const initiateEsewaV2Payment = async (amount: number, bookingId: string) => {
  const response = await axios.post("/api/payment/esewa/initiate", { amount, bookingId });
  return response.data;
};
