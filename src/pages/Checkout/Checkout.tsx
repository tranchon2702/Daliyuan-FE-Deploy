import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  initialShippingInfo,
  initialOtherShippingInfo,
  formatPrice,
  handleInputChange as handleInputChangeUtil,
  handleOtherInputChange as handleOtherInputChangeUtil,
  saveShippingInfo,
  initializeCheckoutData,
  handleSubmitOrder,
  calculateOrderTotals,
  getProvinces,
  getDistricts,
  getWards,
  DELIVERY_TIMES,
  HOTLINE,
  initializeCheckoutSession,
  processShippingInfo,
  exportAllLoggedData,
  getCurrentCheckoutState
} from "./Checkout.script.js";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [shippingInfo, setShippingInfo] = useState(initialShippingInfo);
  const [otherShippingInfo, setOtherShippingInfo] = useState(initialOtherShippingInfo);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveInfo, setSaveInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  // Location data states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [otherDistricts, setOtherDistricts] = useState([]);
  const [otherWards, setOtherWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { items, savedShippingInfo } = initializeCheckoutData();
        setCartItems(items);
        setShippingInfo(savedShippingInfo);
        
        // Load provinces
        const provincesData = await getProvinces();
        setProvinces(provincesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistrictsData = async () => {
      if (shippingInfo.city) {
        try {
          const districtsData = await getDistricts(shippingInfo.city);
          setDistricts(districtsData);
          setWards([]); // Reset wards when province changes
        } catch (error) {
          console.error('Error loading districts:', error);
          setDistricts([]);
        }
      } else {
        setDistricts([]);
        setWards([]);
      }
    };
    
    loadDistrictsData();
  }, [shippingInfo.city]);

  // Load wards when district changes
  useEffect(() => {
    const loadWardsData = async () => {
      if (shippingInfo.district) {
        try {
          const wardsData = await getWards(shippingInfo.district);
          setWards(wardsData);
        } catch (error) {
          console.error('Error loading wards:', error);
          setWards([]);
        }
      } else {
        setWards([]);
      }
    };
    
    loadWardsData();
  }, [shippingInfo.district]);

  // Load other districts when other province changes
  useEffect(() => {
    const loadOtherDistrictsData = async () => {
      if (otherShippingInfo.city) {
        try {
          const districtsData = await getDistricts(otherShippingInfo.city);
          setOtherDistricts(districtsData);
          setOtherWards([]); // Reset other wards when other province changes
        } catch (error) {
          console.error('Error loading other districts:', error);
          setOtherDistricts([]);
        }
      } else {
        setOtherDistricts([]);
        setOtherWards([]);
      }
    };
    
    loadOtherDistrictsData();
  }, [otherShippingInfo.city]);

  // Load other wards when other district changes
  useEffect(() => {
    const loadOtherWardsData = async () => {
      if (otherShippingInfo.district) {
        try {
          const wardsData = await getWards(otherShippingInfo.district);
          setOtherWards(wardsData);
        } catch (error)
        {
          console.error('Error loading other wards:', error);
          setOtherWards([]);
        }
      } else {
        setOtherWards([]);
      }
    };
    
    loadOtherWardsData();
  }, [otherShippingInfo.district]);

  // Save shipping info when it changes
  useEffect(() => {
    if (saveInfo) {
      saveShippingInfo(shippingInfo);
    }
  }, [shippingInfo, saveInfo]);

  const handleInputChange = (field, value) => {
    handleInputChangeUtil(shippingInfo, setShippingInfo, field, value);
  };

  const handleOtherInputChange = (field, value) => {
    handleOtherInputChangeUtil(otherShippingInfo, setOtherShippingInfo, field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await handleSubmitOrder(shippingInfo, otherShippingInfo, cartItems, paymentMethod, agreeTerms, toast, navigate);
    
    if (result) {
      console.log('🎉 Form Submitted Successfully');
    } else {
      console.log('❌ Form Submission Failed');
    }
  };

  // Calculate order totals
  const { subtotal, shipping, tax, total } = calculateOrderTotals(cartItems);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dessert-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('checkout_page.loading')}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-dessert-primary hover:text-dessert-warm transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-bold">{t('checkout_page.title')}</h1>
              <p className="text-muted-foreground">{t('checkout_page.subtitle')}</p>
            </div>
          </div> 
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {t('checkout_page.shipping_info.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('checkout_page.shipping_info.full_name_label')}</Label>
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder={t('checkout_page.shipping_info.full_name_placeholder')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('checkout_page.shipping_info.email_label')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('checkout_page.shipping_info.email_placeholder')}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('checkout_page.shipping_info.phone_label')}</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('checkout_page.shipping_info.phone_placeholder')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('checkout_page.shipping_info.city_label')}</Label>
                      <select
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                        required
                      >
                        <option value="">{t('checkout_page.shipping_info.city_placeholder')}</option>
                        {provinces.map(province => (
                          <option key={province.code} value={province.code}>{province.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">{t('checkout_page.shipping_info.district_label')}</Label>
                      <select
                        id="district"
                        value={shippingInfo.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                        required
                        disabled={!shippingInfo.city}
                      >
                        <option value="">{t('checkout_page.shipping_info.district_placeholder')}</option>
                        {districts.map(district => (
                          <option key={district.code} value={district.code}>{district.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward">{t('checkout_page.shipping_info.ward_label')}</Label>
                      <select
                        id="ward"
                        value={shippingInfo.ward}
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                        className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                        required
                        disabled={!shippingInfo.district}
                      >
                        <option value="">{t('checkout_page.shipping_info.ward_placeholder')}</option>
                        {wards.map(ward => (
                          <option key={ward.code} value={ward.code}>{ward.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t('checkout_page.shipping_info.address_label')}</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder={t('checkout_page.shipping_info.address_placeholder')}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">{t('checkout_page.shipping_info.delivery_date_label')}</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={shippingInfo.deliveryDate || ''}
                        onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">{t('checkout_page.shipping_info.delivery_time_label')}</Label>
                      <select
                        id="deliveryTime"
                        value={shippingInfo.deliveryTime || ''}
                        onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                        className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                        required
                      >
                        <option value="">{t('checkout_page.shipping_info.delivery_time_placeholder')}</option>
                        {DELIVERY_TIMES.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin giao hàng bổ sung */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout_page.other_shipping_info.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="otherAddress"
                      checked={shippingInfo.otherAddress === 'true'}
                      onCheckedChange={(checked) => handleInputChange('otherAddress', checked ? 'true' : '')}
                    />
                    <Label htmlFor="otherAddress">{t('checkout_page.other_shipping_info.other_address_checkbox')}</Label>
                  </div>
                  {shippingInfo.otherAddress === 'true' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="otherFullName">{t('checkout_page.other_shipping_info.full_name_label')}</Label>
                        <Input
                          id="otherFullName"
                          value={otherShippingInfo.fullName}
                          onChange={(e) => handleOtherInputChange('fullName', e.target.value)}
                          placeholder={t('checkout_page.other_shipping_info.full_name_placeholder')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otherPhone">{t('checkout_page.other_shipping_info.phone_label')}</Label>
                        <Input
                          id="otherPhone"
                          value={otherShippingInfo.phone}
                          onChange={(e) => handleOtherInputChange('phone', e.target.value)}
                          placeholder={t('checkout_page.other_shipping_info.phone_placeholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otherCity">{t('checkout_page.other_shipping_info.city_label')}</Label>
                        <select
                          id="otherCity"
                          value={otherShippingInfo.city}
                          onChange={(e) => handleOtherInputChange('city', e.target.value)}
                          className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                          required
                        >
                          <option value="">{t('checkout_page.shipping_info.city_placeholder')}</option>
                          {provinces.map(province => (
                            <option key={province.code} value={province.code}>{province.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otherDistrict">{t('checkout_page.other_shipping_info.district_label')}</Label>
                        <select
                          id="otherDistrict"
                          value={otherShippingInfo.district}
                          onChange={(e) => handleOtherInputChange('district', e.target.value)}
                          className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                          required
                        >
                          <option value="">{t('checkout_page.shipping_info.district_placeholder')}</option>
                          {otherDistricts.map(district => (
                            <option key={district.code} value={district.code}>{district.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otherWard">{t('checkout_page.other_shipping_info.ward_label')}</Label>
                        <select
                          id="otherWard"
                          value={otherShippingInfo.ward}
                          onChange={(e) => handleOtherInputChange('ward', e.target.value)}
                          className="w-full rounded-lg border border-dessert-primary focus:border-dessert-primary focus:ring-2 focus:ring-dessert-primary/30 px-4 py-2 text-base bg-white shadow-sm transition-colors"
                          required
                        >
                          <option value="">{t('checkout_page.shipping_info.ward_placeholder')}</option>
                          {otherWards.map(ward => (
                            <option key={ward.code} value={ward.code}>{ward.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otherAddressDetail">{t('checkout_page.other_shipping_info.address_label')}</Label>
                        <Input
                          id="otherAddressDetail"
                          value={otherShippingInfo.address}
                          onChange={(e) => handleOtherInputChange('address', e.target.value)}
                          placeholder={t('checkout_page.shipping_info.address_placeholder')}
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="orderNote">{t('checkout_page.other_shipping_info.order_note_label')}</Label>
                    <textarea
                      id="orderNote"
                      value={shippingInfo.orderNote || ''}
                      onChange={(e) => handleInputChange('orderNote', e.target.value)}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                      placeholder={t('checkout_page.other_shipping_info.order_note_placeholder')}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary + Confirm Sticky Together */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('checkout_page.order_summary.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{t('checkout_page.order_summary.quantity')} {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Order Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('checkout_page.order_summary.subtotal')}</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('checkout_page.order_summary.shipping')}</span>
                        <span>{formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('checkout_page.order_summary.tax')}</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>{t('checkout_page.order_summary.total')}</span>
                        <span className="text-dessert-primary">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button type="submit" className="w-full" size="lg">
                      {t('checkout_page.order_summary.submit_button', { total: formatPrice(total) })}
                    </Button>
                  </CardContent>
                </Card>

                {/* THÔNG BÁO CẦN CHÚ Ý */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="saveInfo" 
                          checked={saveInfo}
                          onCheckedChange={(checked) => setSaveInfo(checked === true)}
                          className="mt-1"
                        />
                        <div className="space-y-3">
                          <Label htmlFor="saveInfo" className="text-sm font-medium leading-relaxed">
                            {t('checkout_page.notice.title')}
                          </Label>
                          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                            <p>
                              {t('checkout_page.notice.line1')}
                            </p>
                            <p>
                              {t('checkout_page.notice.line2')}
                            </p>
                            <div className="flex items-center gap-2 mt-3 p-1 border border-dessert-primary rounded-lg bg-white shadow-sm">
                              <span className="text-dessert-primary text-xl">
                                <PhoneCall className="inline-block mr-1" size={20} />
                              </span>
                              <span className="font-semibold text-base text-gray-700">{t('checkout_page.notice.hotline')}</span>
                              <span className="font-mono text-xl font-bold text-dessert-primary ml-2 tracking-wider">{HOTLINE}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;