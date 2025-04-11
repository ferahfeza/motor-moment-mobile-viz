
import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MotorParams {
  Rs: number;   // Stator resistance (ohm)
  Xs: number;   // Stator reactance (ohm)
  Xm: number;   // Magnetizing reactance (ohm)
  Rr: number;   // Rotor resistance (ohm)
  Xr: number;   // Rotor reactance (ohm)
  poles: number; // Number of poles
  voltage: number; // Voltage (V)
}

interface SlipTorqueGraphProps {
  params: MotorParams;
  currentSlip: number;
}

const SlipTorqueGraph = ({ params, currentSlip }: SlipTorqueGraphProps) => {
  const data = useMemo(() => {
    // Generate data points from 0 to 1 slip
    const dataPoints = [];
    const { Rs, Xs, Xm, Rr, Xr, voltage, poles } = params;
    const frequency = 50; // Hz (assuming 50Hz system)
    const syncSpeed = 120 * frequency / poles; // rpm
    
    // Calculate maximum torque and slip at maximum torque for reference
    const slipAtMaxTorque = Rr / Math.sqrt(Rs * Rs + Math.pow(Xs + Xr, 2));
    
    for (let slip = 0; slip <= 1; slip += 0.01) {
      // Simplified torque equation for induction motor
      // T = (3 * V^2 * Rr/s) / (2π * ωs * [(Rs + Rr/s)^2 + (Xs + Xr)^2])
      const slipValue = Math.max(slip, 0.001); // Avoid division by zero
      const numerator = 3 * Math.pow(voltage, 2) * (Rr / slipValue);
      const denominator = 2 * Math.PI * (syncSpeed / 60) * 
        (Math.pow(Rs + Rr/slipValue, 2) + Math.pow(Xs + Xr, 2));
      
      const torque = numerator / denominator;
      
      dataPoints.push({
        slip: slip,
        torque: torque,
        speed: syncSpeed * (1 - slip)
      });
    }
    
    return dataPoints;
  }, [params]);
  
  // Find maximum torque point
  const maxTorquePoint = useMemo(() => {
    return data.reduce((max, point) => point.torque > max.torque ? point : max, { torque: 0, slip: 0 });
  }, [data]);
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="text-sm">Slip: <span className="font-medium">{(payload[0].payload.slip * 100).toFixed(1)}%</span></p>
          <p className="text-sm">Torque: <span className="font-medium">{payload[0].value.toFixed(2)} Nm</span></p>
          <p className="text-sm">Speed: <span className="font-medium">{payload[0].payload.speed.toFixed(0)} rpm</span></p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Slip-Torque Curve</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="slip" 
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{ value: 'Slip (%)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Torque (Nm)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={customTooltip} />
            <Legend />
            <ReferenceLine 
              x={maxTorquePoint.slip} 
              stroke="#ff7300" 
              strokeDasharray="3 3" 
              label={{ value: 'Max Torque', position: 'top' }} 
            />
            <ReferenceLine 
              x={currentSlip} 
              stroke="#82ca9d" 
              strokeWidth={2}
              label={{ value: 'Current', position: 'top' }} 
            />
            <Line 
              type="monotone" 
              dataKey="torque" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SlipTorqueGraph;
