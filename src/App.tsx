import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/language-context";
import { ProgressProvider } from "@/lib/progress-context";
import { HomePage } from "@/src/pages/home/home-page";
import { QuizPage } from "@/src/pages/quiz/quiz-page";
import { DictionaryPage } from "@/src/pages/dictionary/dictionary-page";
import { ProfilePage } from "@/src/pages/profile/profile-page";
import { MaintenancePage } from "@/src/pages/maintenance/maintenance-page";
import { SiteBanner } from "@/components/site-banner";

const API_BASE =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_API_LOCALHOST
    : import.meta.env.VITE_API_URL;

export function App() {
  const [siteStatus, setSiteStatus] = useState<"active" | "maintenance" | null>(null);
  const [banner, setBanner] = useState("");
  const [bannerBg, setBannerBg] = useState("#18181b");
  const [bannerTextColor, setBannerTextColor] = useState("#ffffff");

  useEffect(() => {
    fetch(`${API_BASE}/api/update-store-status`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: any[]) => {
        const store = Array.isArray(data) ? data[0] : data;
        if (store) {
          setSiteStatus(store.status === "maintenance" ? "maintenance" : "active");
          setBanner(store.banner?.trim() ?? "");
          setBannerBg(store.bannerBg ?? "#18181b");
          setBannerTextColor(store.bannerTextColor ?? "#ffffff");
        } else {
          setSiteStatus("active");
        }
      })
      .catch(() => setSiteStatus("active"));
  }, []);

  // Still loading — render nothing (avoids flash of wrong page)
  if (siteStatus === null) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <ProgressProvider>
          {siteStatus === "maintenance" ? (
            <MaintenancePage />
          ) : (
            <>
              {banner && <SiteBanner message={banner} bgColor={bannerBg} textColor={bannerTextColor} />}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/dictionary" element={<DictionaryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </>
          )}
          <Toaster position="top-center" richColors />
        </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
