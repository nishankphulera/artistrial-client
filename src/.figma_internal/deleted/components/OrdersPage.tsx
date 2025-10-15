import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, Package, Eye, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface OrderItem {
  artwork_id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  price: number;
  image_url: string;
  media_type: string;
  quantity: number;
}

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'completed' | 'shipped' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  completed_at?: string;
  shipped_at?: string;
  tracking_number?: string;
  payment_intent_id?: string;
}

interface OrdersPageProps {
  userId: string;
  userRole: 'artist' | 'collector' | 'user';
  isDashboardDarkMode?: boolean;
}

export function OrdersPage({ userId, userRole, isDashboardDarkMode = false }: OrdersPageProps) {
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      // Fetch purchases
      const purchasesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/orders/${userId}?type=purchases`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setPurchases(purchasesData.orders);
      }

      // Fetch sales (only for artists)
      if (userRole === 'artist') {
        const salesResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/orders/${userId}?type=sales`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (salesResponse.ok) {
          const salesData = await salesResponse.json();
          setSales(salesData.orders);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (artworkId: string, title: string) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/download/${artworkId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // In a real implementation, this would open the secure download URL
        window.open(data.download_url, '_blank');
      } else {
        const error = await response.json();
        alert(error.error || 'Download failed');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Download failed');
    }
  };

  const handleMarkAsShipped = async (orderId: string) => {
    try {
      const trackingNumber = prompt('Enter tracking number:');
      if (!trackingNumber) return;

      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/orders/${orderId}/ship`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ tracking_number: trackingNumber }),
        }
      );

      if (response.ok) {
        fetchOrders(); // Refresh orders
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to mark as shipped');
      }
    } catch (error) {
      console.error('Error marking as shipped:', error);
      alert('Failed to mark as shipped');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'failed') return <X className="w-4 h-4 text-red-500" />;
    if (paymentStatus === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    if (status === 'shipped') return <Truck className="w-4 h-4 text-blue-500" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'failed') return 'Payment Failed';
    if (paymentStatus === 'pending') return 'Payment Pending';
    if (status === 'shipped') return 'Shipped';
    if (status === 'completed') return 'Completed';
    return 'Processing';
  };

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'failed') return 'destructive';
    if (paymentStatus === 'pending') return 'secondary';
    if (status === 'shipped') return 'default';
    if (status === 'completed') return 'default';
    return 'secondary';
  };

  const renderOrderCard = (order: Order, isPurchase: boolean) => (
    <Card key={order.id} className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(order.status, order.payment_status)}
              <Badge variant={getStatusColor(order.status, order.payment_status) as any}>
                {getStatusText(order.status, order.payment_status)}
              </Badge>
            </div>
            <p className="font-semibold text-lg">{formatPrice(order.total_amount)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.artwork_id} className="flex items-center space-x-4">
              <div className="w-16 h-16 flex-shrink-0">
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                <p className="text-sm text-gray-600">by {item.artist_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.media_type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {order.tracking_number && (
                <span className="text-sm text-gray-600">
                  Tracking: {order.tracking_number}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isPurchase ? (
                <>
                  {order.payment_status === 'completed' && (
                    <>
                      {order.items.some(item => ['image', 'video', 'audio', '3d_model'].includes(item.media_type)) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(order.items[0].artwork_id, order.items[0].title)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {order.payment_status === 'completed' && order.status !== 'shipped' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsShipped(order.id)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  )}
                </>
              )}
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className={`h-full w-full p-6 ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
        <div className="w-full">
          <div className="animate-pulse">
            <div className={`h-8 rounded w-48 mb-6 ${isDashboardDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="p-6">
                    <div className={`h-20 rounded ${isDashboardDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full p-6 ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>Orders</h1>
          <p className={`mt-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your purchases and sales</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            {userRole === 'artist' && (
              <TabsTrigger value="sales">My Sales</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="purchases">
            {purchases.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring the marketplace to find amazing artworks</p>
                  <Button>
                    Browse Marketplace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                {purchases.map((order) => renderOrderCard(order, true))}
              </div>
            )}
          </TabsContent>

          {userRole === 'artist' && (
            <TabsContent value="sales">
              {sales.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No sales yet</h3>
                    <p className="text-gray-600 mb-6">List your artworks in the marketplace to start selling</p>
                    <Button>
                      Upload Artwork
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {sales.map((order) => renderOrderCard(order, false))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

