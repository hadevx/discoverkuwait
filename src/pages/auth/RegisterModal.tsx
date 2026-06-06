import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useRegisterUserMutation } from "../../redux/queries/userApi";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { useProgress } from "@/lib/progress-context";
import { useLanguage } from "@/lib/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
};

export function RegisterModal({ open, onOpenChange, onSwitchToLogin }: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const { name, email, password, confirmPassword } = form;

  const dispatch = useDispatch();
  const { state, syncFromUser } = useProgress();
  const { t, dir } = useLanguage();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        return toast.error(t.toastAllFieldsRequired, { position: "top-center" });
      }
      if (password !== confirmPassword) {
        return toast.error(t.toastPasswordsMismatch, { position: "top-center" });
      }

      const res = await registerUser({ name, email, password, confirmPassword, ...state }).unwrap();
      dispatch(setUserInfo({ ...res }));
      syncFromUser(res);
      onOpenChange(false);
      toast.success(t.toastAccountCreated);
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
          <DialogTitle className="text-xl font-semibold">{t.registerTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleRegister} className="flex flex-col gap-3 mt-2">
          <input
            type="text"
            name="name"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={handleChange}
            dir="auto"
            className="w-full h-10 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
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
              {showPassword ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={t.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={handleChange}
            dir="ltr"
            className="w-full h-10 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-1 h-10 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {isLoading ? t.creatingAccount : t.registerBtn}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-2">
          {t.alreadyHaveAccount}{" "}
          <button
            type="button"
            className="font-semibold text-foreground underline underline-offset-4"
            onClick={() => { onOpenChange(false); onSwitchToLogin?.(); }}>
            {t.loginBtn}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
