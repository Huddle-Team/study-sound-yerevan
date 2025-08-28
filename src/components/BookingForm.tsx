import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    interest: "",
    gear: "",
    agreedToTerms: false
  });
  const [date, setDate] = useState<Date>();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.agreedToTerms) {
      toast({
        title: "Please fill in required fields",
        description: "Name, phone, and terms agreement are required.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send to an API
    console.log("Booking submission:", { ...formData, preferredDate: date });
    
    setSubmitted(true);
    toast({
      title: "Booking submitted!",
      description: "We'll call you shortly to confirm your booking.",
    });
  };

  if (submitted) {
    return (
      <section id="booking" className="py-20 bg-background">
        <div className="max-w-2xl mx-auto px-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Thanks! We'll call you shortly to confirm.</h3>
              <p className="text-muted-foreground mb-6">
                Our team will contact you at {formData.phone} to confirm availability and arrange pickup or delivery.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="px-8"
              >
                Submit Another Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-secondary/20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Book a Call</h2>
          <p className="text-xl text-muted-foreground">Quick booking form — no payment required</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-primary">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields */}
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+374 XX XXX XXX or local format"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Interest (optional)</Label>
                  <Select onValueChange={(value) => setFormData({...formData, interest: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="not-sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Gear Type (optional)</Label>
                  <Select onValueChange={(value) => setFormData({...formData, gear: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select gear" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noise-cancelling">Noise-Cancelling Headphones</SelectItem>
                      <SelectItem value="studio">Studio Headphones</SelectItem>
                      <SelectItem value="usb-headset">USB Headset</SelectItem>
                      <SelectItem value="earbuds">Earbuds</SelectItem>
                      <SelectItem value="dslr-camera">DSLR Camera</SelectItem>
                      <SelectItem value="action-camera">Action Camera</SelectItem>
                      <SelectItem value="webcam">Webcam HD</SelectItem>
                      <SelectItem value="handheld-gps">Handheld GPS</SelectItem>
                      <SelectItem value="car-gps">Car GPS Navigator</SelectItem>
                      <SelectItem value="gps-watch">GPS Watch</SelectItem>
                      <SelectItem value="refurbished">Refurbished Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <Label className="text-sm font-medium">Preferred Date (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked as boolean})}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the Terms & Privacy Policy *
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Send Booking Request
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We use your phone only to confirm your booking. No spam, no marketing calls.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;