import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../../types/vehicle';

interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
}

const initialState: VehiclesState = {
  vehicles: [],
  loading: false,
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setVehicles, setLoading } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
