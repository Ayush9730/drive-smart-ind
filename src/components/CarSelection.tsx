import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car } from '../types/rental';
import { cars } from '../data/carData';

interface CarSelectionProps {
  onSelect: (car: Car) => void;
  onBack: () => void;
  selectedCarId?: string;
}

export const CarSelection = ({ onSelect, onBack, selectedCarId }: CarSelectionProps) => {
  const getCategoryLabel = (category: Car['category']) => {
    const labels = {
      hatchback: 'Hatchback',
      sedan: 'Sedan',
      xl: 'XL',
      luxury: 'Luxury'
    };
    return labels[category];
  };

  const getCategoryColor = (category: Car['category']) => {
    const colors = {
      hatchback: 'bg-blue-100 text-blue-800',
      sedan: 'bg-green-100 text-green-800',
      xl: 'bg-yellow-100 text-yellow-800',
      luxury: 'bg-purple-100 text-purple-800'
    };
    return colors[category];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Registration
        </Button>
        <h2 className="text-2xl font-bold text-primary">Select Your Car</h2>
        <div />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car) => (
          <Card 
            key={car.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCarId === car.id ? 'ring-2 ring-primary' : ''
            } ${!car.available ? 'opacity-50' : ''}`}
            onClick={() => car.available && onSelect(car)}
          >
            <CardHeader className="p-4">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                {!car.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">Not Available</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{car.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <Badge className={getCategoryColor(car.category)}>
                  {getCategoryLabel(car.category)}
                </Badge>
                
                <div className="text-sm text-muted-foreground">
                  <p>👥 {car.passengers} passengers</p>
                  <p>💰 ₹{car.basePrice}/day</p>
                  <p>🛣️ ₹{car.pricePerKm}/km</p>
                </div>
                
                {car.available && (
                  <Button 
                    className="w-full mt-3"
                    variant={selectedCarId === car.id ? "default" : "outline"}
                  >
                    {selectedCarId === car.id ? 'Selected' : 'Select Car'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Card className="max-w-md mx-auto bg-muted/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Car Availability Status</h3>
            <div className="space-y-1 text-sm">
              {cars.map((car) => (
                <div key={car.id} className="flex justify-between">
                  <span>{car.name}</span>
                  <Badge variant={car.available ? "default" : "destructive"}>
                    {car.available ? "Available" : "Booked"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};