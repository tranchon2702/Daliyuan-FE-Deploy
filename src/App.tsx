import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyAccount from "./pages/MyAccount/MyAccount";
import NotFound from "./pages/NotFound";
import PaymentMethods from "./pages/PaymentMethods/PaymentMethods";
import AdminLayout from "./pages/Admin/Views/AdminLayout";
import AdminProductsPage from "./pages/Admin/Views/AdminProductsPage";
import AdminDashboardPage from "./pages/Admin/Views/AdminDashboardPage";
import AdminNewsPage from "./pages/Admin/Views/AdminNewsPage";
import AdminSystemPage from "./pages/Admin/Views/AdminSystemPage";
import AdminOrdersPage from "./pages/Admin/Views/AdminOrdersPage";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from "./pages/Admin/Views/AdminLogin";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/hinh-thuc-thanh-toan" element={<PaymentMethods />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="news" element={<AdminNewsPage />} />
            <Route path="system" element={<AdminSystemPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
