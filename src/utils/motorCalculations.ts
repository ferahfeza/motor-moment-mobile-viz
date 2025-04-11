
interface MotorParams {
  Rs: number;   // Stator resistance (ohm)
  Xs: number;   // Stator reactance (ohm)
  Xm: number;   // Magnetizing reactance (ohm)
  Rr: number;   // Rotor resistance (ohm)
  Xr: number;   // Rotor reactance (ohm)
  poles: number; // Number of poles
  voltage: number; // Voltage (V)
}

// Calculate synchronous speed
export const calculateSyncSpeed = (poles: number, frequency = 50): number => {
  return (120 * frequency) / poles;
};

// Calculate slip based on actual and synchronous speed
export const calculateSlip = (actualSpeed: number, syncSpeed: number): number => {
  return (syncSpeed - actualSpeed) / syncSpeed;
};

// Calculate torque at a specific slip
export const calculateTorque = (slip: number, params: MotorParams): number => {
  const { Rs, Xs, Xm, Rr, Xr, voltage, poles } = params;
  const frequency = 50; // Hz (assuming 50Hz system)
  const syncSpeed = calculateSyncSpeed(poles, frequency);
  
  // Simplified torque equation for induction motor
  // T = (3 * V^2 * Rr/s) / (2π * ωs * [(Rs + Rr/s)^2 + (Xs + Xr)^2])
  const slipValue = Math.max(slip, 0.001); // Avoid division by zero
  const numerator = 3 * Math.pow(voltage, 2) * (Rr / slipValue);
  const denominator = 2 * Math.PI * (syncSpeed / 60) * 
    (Math.pow(Rs + Rr/slipValue, 2) + Math.pow(Xs + Xr, 2));
  
  return numerator / denominator;
};

// Calculate slip at which maximum torque occurs
export const calculateSlipAtMaxTorque = (params: MotorParams): number => {
  const { Rs, Xs, Xm, Rr, Xr } = params;
  return Rr / Math.sqrt(Rs * Rs + Math.pow(Xs + Xr, 2));
};

// Calculate starting torque (slip = 1)
export const calculateStartingTorque = (params: MotorParams): number => {
  return calculateTorque(1, params);
};

// Calculate maximum torque
export const calculateMaxTorque = (params: MotorParams): number => {
  const slipAtMax = calculateSlipAtMaxTorque(params);
  return calculateTorque(slipAtMax, params);
};
