
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface MotorParams {
  Rs: number;   // Stator resistance (ohm)
  Xs: number;   // Stator reactance (ohm)
  Xm: number;   // Magnetizing reactance (ohm)
  Rr: number;   // Rotor resistance (ohm)
  Xr: number;   // Rotor reactance (ohm)
  poles: number; // Number of poles
  voltage: number; // Voltage (V)
}

interface ParamInputProps {
  params: MotorParams;
  setParams: (params: MotorParams) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

const ParamInput = ({ params, setParams, isRunning, setIsRunning }: ParamInputProps) => {
  const [advanced, setAdvanced] = useState(false);
  
  const handleChange = (name: keyof MotorParams, value: number) => {
    setParams({ ...params, [name]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Motor Parameters</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="advanced" className="text-sm">Gelişmiş Ayarlama</Label>
          <Switch 
            id="advanced" 
            checked={advanced}
            onCheckedChange={setAdvanced}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voltage">Nominal Gerilim (V)</Label>
          <Input
            id="voltage"
            type="number"
            value={params.voltage}
            onChange={(e) => handleChange('voltage', parseFloat(e.target.value))}
            min={100}
            max={1000}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="poles">Kutup Sayısı</Label>
          <Input
            id="poles"
            type="number"
            value={params.poles}
            onChange={(e) => handleChange('poles', parseInt(e.target.value))}
            min={2}
            max={12}
            step={2}
          />
        </div>
        
        {advanced && (
          <>
            <div className="space-y-2">
              <Label htmlFor="Rs">Stator Direnci (Ω)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="Rs"
                  value={[params.Rs]}
                  onValueChange={(value) => handleChange('Rs', value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                />
                <span className="w-10 text-right">{params.Rs}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="Rr">Rotor Direnci (Ω)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="Rr"
                  value={[params.Rr]}
                  onValueChange={(value) => handleChange('Rr', value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                />
                <span className="w-10 text-right">{params.Rr}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="Xs">Stator Reaktansı (Ω)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="Xs"
                  value={[params.Xs]}
                  onValueChange={(value) => handleChange('Xs', value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                />
                <span className="w-10 text-right">{params.Xs}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="Xr">Rotor Reaktansı (Ω)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="Xr"
                  value={[params.Xr]}
                  onValueChange={(value) => handleChange('Xr', value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                />
                <span className="w-10 text-right">{params.Xr}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="Xm">Mıknatıslama Reaktansı (Ω)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="Xm"
                  value={[params.Xm]}
                  onValueChange={(value) => handleChange('Xm', value[0])}
                  min={1}
                  max={50}
                  step={1}
                />
                <span className="w-10 text-right">{params.Xm}</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <Label htmlFor="running" className="text-sm font-medium">Motor Durumu</Label>
        <div className="flex items-center space-x-2">
          <span className={isRunning ? "text-muted-foreground" : "text-primary"}>Off</span>
          <Switch 
            id="running" 
            checked={isRunning}
            onCheckedChange={setIsRunning}
          />
          <span className={!isRunning ? "text-muted-foreground" : "text-primary"}>On</span>
        </div>
      </div>
    </div>
  );
};

export default ParamInput;
