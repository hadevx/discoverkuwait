import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/language-context";
import { ProgressProvider } from "@/lib/progress-context";
import { SiteBanner } from "@/components/site-banner";

const HomePage        = lazy(() => import("@/src/pages/home/home-page").then((m) => ({ default: m.HomePage })));
const QuizPage        = lazy(() => import("@/src/pages/quiz/quiz-page").then((m) => ({ default: m.QuizPage })));
const DictionaryPage  = lazy(() => import("@/src/pages/forum/dictionary/dictionary-page").then((m) => ({ default: m.DictionaryPage })));
const ProfilePage     = lazy(() => import("@/src/pages/profile/profile-page").then((m) => ({ default: m.ProfilePage })));
const ForumPage       = lazy(() => import("@/src/pages/forum/forum-page").then((m) => ({ default: m.ForumPage })));
const TopicDetailPage = lazy(() => import("@/src/pages/forum/topic-detail-page").then((m) => ({ default: m.TopicDetailPage })));
const UsersPage       = lazy(() => import("@/src/pages/users/UsersPage").then((m) => ({ default: m.UsersPage })));
const MaintenancePage = lazy(() => import("@/src/pages/maintenance/maintenance-page").then((m) => ({ default: m.MaintenancePage })));

const API_BASE =
  import.meta.env.DEV
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

  if (siteStatus === null) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <ProgressProvider>
          <Suspense fallback={null}>
            {siteStatus === "maintenance" ? (
              <MaintenancePage />
            ) : (
              <>
                {banner && (
                  <SiteBanner message={banner} bgColor={bannerBg} textColor={bannerTextColor} />
                )}
                <Routes>
                  <Route path="/"                  element={<HomePage />} />
                  <Route path="/quiz"              element={<QuizPage />} />
                  <Route path="/dictionary"        element={<DictionaryPage />} />
                  <Route path="/profile"           element={<ProfilePage />} />
                  <Route path="/forum"             element={<ForumPage />} />
                  <Route path="/forum/topics/:id"  element={<TopicDetailPage />} />
                  <Route path="/users"             element={<UsersPage />} />
                </Routes>
              </>
            )}
          </Suspense>
          <Toaster position="top-center" richColors />
        </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
