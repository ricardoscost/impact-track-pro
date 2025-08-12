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
import RequireAdmin from "./components/RequireAdmin";

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
            <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
            <Route path="/admin/calendar" element={<RequireAdmin><AdminCalendar /></RequireAdmin>} />
            <Route path="/admin/gallery" element={<RequireAdmin><AdminGallery /></RequireAdmin>} />
            <Route path="/admin/gallery-albums" element={<RequireAdmin><AdminGalleryAlbums /></RequireAdmin>} />
            <Route path="/admin/metrics" element={<RequireAdmin><AdminMetrics /></RequireAdmin>} />
            <Route path="/admin/pilots" element={<RequireAdmin><AdminPilots /></RequireAdmin>} />
            <Route path="/admin/sponsors" element={<RequireAdmin><AdminSponsors /></RequireAdmin>} />
            <Route path="/admin/press-releases" element={<RequireAdmin><AdminPressReleases /></RequireAdmin>} />
            <Route path="/admin/youtube-videos" element={<RequireAdmin><AdminYouTubeVideos /></RequireAdmin>} />
            <Route path="/admin/results" element={<RequireAdmin><AdminResults /></RequireAdmin>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
