import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/queries/userApi";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { useProgress } from "@/lib/progress-context";
import { useLanguage } from "@/lib/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister?: () => void;
};

export function LoginModal({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { email, password } = form;

  const dispatch = useDispatch();
  const { syncFromUser } = useProgress();
  const { t, lang, dir } = useLanguage();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        return toast.error(t.toastAllFieldsRequired, { position: "top-center" });
      }

      let guestProgress = {};
      try {
        const raw = localStorage.getItem("dk-progress-v1");
        if (raw) guestProgress = JSON.parse(raw);
      } catch {}

      const res = await loginUser({ email, password, ...guestProgress }).unwrap();
      dispatch(setUserInfo({ ...res }));
      syncFromUser(res);
      onOpenChange(false);
      toast.success(t.toastWelcomeBack);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.error || t.toastErrorOccurred, {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{t.loginTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="flex flex-col gap-3 mt-2">
          <input
            type="email"
            name="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={handleChange}
            dir="ltr"
            className="w-full h-10 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={handleChange}
              dir="ltr"
              className="w-full h-10 rounded-md border border-border bg-background px-4 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye size={16} strokeWidth={1.5} />
              ) : (
                <EyeOff size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-1 h-10 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {isLoading ? t.loggingIn : t.loginBtn}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-2">
          {t.noAccount}{" "}
          {onSwitchToRegister ? (
            <button
              type="button"
              className="font-semibold text-foreground underline underline-offset-4"
              onClick={() => { onOpenChange(false); onSwitchToRegister(); }}>
              {t.registerBtn}
            </button>
          ) : (
            <Link
              to="/register"
              className="font-semibold text-foreground underline underline-offset-4"
              onClick={() => onOpenChange(false)}>
              {t.registerBtn}
            </Link>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
