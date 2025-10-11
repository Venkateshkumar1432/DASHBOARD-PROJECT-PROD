// src/utils/envCheck.ts

export const checkApiConfiguration = () => {
  const env = import.meta.env.MODE;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const vehicleServiceUrl = import.meta.env.VITE_VEHICLE_API_URL || "http://localhost:4004";
  const riderServiceUrl = import.meta.env.VITE_RIDER_API_URL || "http://localhost:4005";

  console.log("🧩 Environment:", env);
  console.log("🌐 API URL:", apiUrl);
  console.log("🚗 Vehicle Service URL:", vehicleServiceUrl);
  console.log("🏍️ Rider Service URL:", riderServiceUrl);

  return {
    env,
    apiUrl,
    vehicleServiceUrl,
    riderServiceUrl,
  };
};