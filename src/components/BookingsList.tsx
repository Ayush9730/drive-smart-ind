import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Car, Calendar, MapPin, User, CreditCard, ArrowLeft } from 'lucide-react';
import { Booking } from '../types/rental';

interface BookingsListProps {
  bookings: Booking[];
  onBack: () => void;
}

export const BookingsList = ({ bookings, onBack }: BookingsListProps) => {
  const getStatusBadge = (status: Booking['status']) => {
    const statusConfig = {
      confirmed: { variant: 'default' as const, label: 'Confirmed' },
      pending: { variant: 'secondary' as const, label: 'Pending' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <h2 className="text-3xl font-bold text-primary">All Bookings Dashboard</h2>
        <div className="text-sm text-muted-foreground">
          Total Bookings: {bookings.length}
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground">Make your first booking to see it here!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cars Rented</p>
                    <p className="text-2xl font-bold">
                      {bookings.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="text-2xl font-bold">
                      {bookings.reduce((sum, b) => sum + b.distance, 0).toLocaleString()} km
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deposit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booked On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">
                          {booking.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.user.phone}</p>
                            <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={booking.car.image} 
                              alt={booking.car.name}
                              className="w-12 h-8 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{booking.car.name}</p>
                              <p className="text-sm text-muted-foreground">{booking.car.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{booking.fromCity} → {booking.toCity}</p>
                            <p className="text-sm text-muted-foreground">{booking.distance} km</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{booking.startDate}</p>
                            <p className="text-sm">to {booking.endDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.duration} days</TableCell>
                        <TableCell>
                          {booking.needDriver ? (
                            <Badge variant="secondary">With Driver</Badge>
                          ) : (
                            <Badge variant="outline">Self Drive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{booking.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹{booking.deposit.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{booking.bookingDate}</p>
                            <p className="text-sm text-muted-foreground">{booking.bookingTime}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};