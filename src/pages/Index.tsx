import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateSyncSpeed, calculateTorque } from "@/utils/motorCalculations";
import MotorAnimation from "@/components/MotorAnimation";
import ParamInput from "@/components/ParamInput";
import SlipTorqueGraph from "@/components/SlipTorqueGraph";
import { ChevronUp } from "lucide-react";

interface MotorParams {
  Rs: number;   // Stator resistance (ohm)
  Xs: number;   // Stator reactance (ohm)
  Xm: number;   // Magnetizing reactance (ohm)
  Rr: number;   // Rotor resistance (ohm)
  Xr: number;   // Rotor reactance (ohm)
  poles: number; // Number of poles
  voltage: number; // Voltage (V)
}

const Index = () => {
  // Default parameters for a typical 3-phase induction motor
  const [params, setParams] = useState<MotorParams>({
    Rs: 0.5,    // Stator resistance
    Xs: 1.5,    // Stator reactance
    Xm: 30,     // Magnetizing reactance
    Rr: 0.6,    // Rotor resistance
    Xr: 1.5,    // Rotor reactance
    poles: 4,   // 4-pole motor (common)
    voltage: 400 // 400V (common for 3-phase)
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentSlip, setCurrentSlip] = useState(0.03); // Initial slip value
  const [activeTab, setActiveTab] = useState("visualization");
  const [showInfo, setShowInfo] = useState(false);

  // Calculate important values
  const syncSpeed = calculateSyncSpeed(params.poles);
  const currentTorque = calculateTorque(currentSlip, params);
  const actualSpeed = syncSpeed * (1 - currentSlip);

  // Motorun durma ve çalışma durumlarında kayma değerini kontrol eden useEffect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      // Motor çalışırken kayma değerini 0'a doğru azaltma
      timer = setInterval(() => {
        setCurrentSlip(prevSlip => {
          const newSlip = prevSlip > 0.03 ? prevSlip - 0.01 : 0.03;
          return newSlip;
        });
      }, 100);
    } else {
      // Motor durdurulduğunda kayma değerini 100%'e doğru arttırma
      timer = setInterval(() => {
        setCurrentSlip(prevSlip => {
          const newSlip = Math.min(prevSlip + 0.01, 1);
          return newSlip;
        });
      }, 100);
    }
    
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-center">Asenkron Motor Analizi</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visualization">Görselleştirme</TabsTrigger>
            <TabsTrigger value="parameters">Parametreler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4 flex flex-col items-center">
                <MotorAnimation isRunning={isRunning} slip={currentSlip} />
                
                <div className="w-full mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Senkron Hız</p>
                    <p className="text-lg font-semibold">{syncSpeed.toFixed(0)} dev/dk</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gerçek Hız</p>
                    <p className="text-lg font-semibold">{actualSpeed.toFixed(0)} dev/dk</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kayma</p>
                    <p className="text-lg font-semibold">{(currentSlip * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Moment</p>
                    <p className="text-lg font-semibold">{currentTorque.toFixed(1)} Nm</p>
                  </div>
                </div>
              </Card>
              
              <SlipTorqueGraph params={params} currentSlip={currentSlip} />
            </div>
          </TabsContent>
          
          <TabsContent value="parameters">
            <ParamInput 
              params={params} 
              setParams={setParams}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </TabsContent>
        </Tabs>
        
        {/* Information section */}
        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center py-2"
            onClick={() => setShowInfo(!showInfo)}
          >
            <span className="font-medium">Asenkron Motor Hakkında Bilgi</span>
            <ChevronUp className={`w-5 h-5 transform transition-transform ${showInfo ? '' : 'rotate-180'}`} />
          </Button>
          
          {showInfo && (
            <div className="mt-2 p-4 bg-card rounded-lg text-sm">
              <p className="mb-3">
                Üç fazlı asenkron motorlar, endüstriyel uygulamalarda yaygın olarak kullanılan elektrik motorlarıdır. 
                Bu motorlar, döner bir manyetik alan ile çalışırlar.
              </p>
              <p className="mb-3">
                <strong>Kayma (Slip):</strong> Rotorun senkron hızdan ne kadar yavaş döndüğünün bir ölçüsüdür. 
                Kayma = (Senkron Hız - Rotor Hızı) / Senkron Hız formülü ile hesaplanır.
              </p>
              <p className="mb-3">
                <strong>Moment-Kayma Eğrisi:</strong> Bu grafik, motorun farklı kayma değerlerinde ürettiği momenti gösterir.
                Motorun başlangıç, maksimum ve nominal moment değerleri bu eğriden okunabilir.
              </p>
              <p>
                <strong>Parametre Değişikliği:</strong> Motor parametrelerini değiştirerek, moment-kayma
                eğrisinin nasıl değiştiğini gözlemleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-card py-3 text-center text-sm text-muted-foreground">
        <p>© 2025 Asenkron Motor Analiz Uygulaması</p>
      </div>
    </div>
  );
};

export default Index;
