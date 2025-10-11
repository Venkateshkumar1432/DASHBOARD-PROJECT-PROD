export interface Vehicle {
  id: string;
  registrationNumber?: string;
  vehicleNumber?: string;
  name?: string;
  mileage?: number;
  model?: any;
  make?: string;
  year?: number;
  vin?: string;
  [key: string]: any;
}