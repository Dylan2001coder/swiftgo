import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RequestRide from "./pages/RequestRide";
import RideDetail from "./pages/RideDetail";
import History from "./pages/History";
import DriverHub from "./pages/DriverHub";
import BecomeDriver from "./pages/BecomeDriver";
import UssdInfo from "./pages/UssdInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/request" element={<RequestRide />} />
            <Route path="/app/ride/:id" element={<RideDetail />} />
            <Route path="/app/history" element={<History />} />
            <Route path="/app/drive" element={<DriverHub />} />
            <Route path="/app/become-driver" element={<BecomeDriver />} />
            <Route path="/ussd" element={<UssdInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
