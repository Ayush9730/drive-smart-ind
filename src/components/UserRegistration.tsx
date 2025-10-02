import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '../types/rental';

interface UserRegistrationProps {
  onComplete: (user: User) => void;
  initialData?: User;
}

export const UserRegistration = ({ onComplete, initialData }: UserRegistrationProps) => {
  const [formData, setFormData] = useState<User>(
    initialData || {
      name: '',
      phone: '',
      email: '',
      drivingLicense: '',
    }
  );

  const [errors, setErrors] = useState<Partial<User>>({});

  const validateForm = () => {
    const newErrors: Partial<User> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+\d{1,3}\d{6,14}$/.test(formData.phone.trim())) 
      newErrors.phone = 'Enter valid phone number in E.164 format (e.g., +919876543210)';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) 
      newErrors.email = 'Enter valid email address';
    if (!formData.drivingLicense.trim()) 
      newErrors.drivingLicense = 'Driving license ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary">User Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number (E.164 format)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+919876543210"
              className={errors.phone ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +91 for India)</p>
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="license">Driving License ID</Label>
            <Input
              id="license"
              value={formData.drivingLicense}
              onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
              placeholder="Enter driving license number"
              className={errors.drivingLicense ? 'border-destructive' : ''}
            />
            {errors.drivingLicense && <p className="text-sm text-destructive mt-1">{errors.drivingLicense}</p>}
          </div>

          <Button type="submit" className="w-full">
            Continue to Car Selection
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};