import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Gallery from "./pages/Gallery";
import Pilots from "./pages/Pilots";
import Sponsors from "./pages/Sponsors";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminCalendar from "./pages/AdminCalendar";
import AdminGallery from "./pages/AdminGallery";
import AdminGalleryAlbums from "./pages/AdminGalleryAlbums";
import AdminMetrics from "./pages/AdminMetrics";
import AdminPilots from "./pages/AdminPilots";
import AdminSponsors from "./pages/AdminSponsors";
import AdminPressReleases from "./pages/AdminPressReleases";
import AdminYouTubeVideos from "./pages/AdminYouTubeVideos";
import AdminResults from "./pages/AdminResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pilots" element={<Pilots />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/results" element={<Results />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/gallery-albums" element={<AdminGalleryAlbums />} />
            <Route path="/admin/metrics" element={<AdminMetrics />} />
            <Route path="/admin/pilots" element={<AdminPilots />} />
            <Route path="/admin/sponsors" element={<AdminSponsors />} />
            <Route path="/admin/press-releases" element={<AdminPressReleases />} />
            <Route path="/admin/youtube-videos" element={<AdminYouTubeVideos />} />
            <Route path="/admin/results" element={<AdminResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
