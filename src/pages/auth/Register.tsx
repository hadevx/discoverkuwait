// @ts-nocheck

import { useState } from "react";
import { EyeOff, Eye, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { useRegisterUserMutation } from "../../redux/queries/userApi";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showUsernameNote, setShowUsernameNote] = useState(false);

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, name, email, password, confirmPassword } = form;

  // Generic onChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { t } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser({ username, name, email, password, confirmPassword }).unwrap();
      dispatch(setUserInfo({ ...res }));
      localStorage.removeItem("dk-progress-v1");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || t.toastErrorOccurred);
    }
  };
  return (
    <>
      <div className=" flex mt-[-100px] flex-col items-center justify-center  min-h-screen text-black">
        <div>
          <h1 className="mb-5 text-[20px] font-semibold">Create new account</h1>
        </div>
        <div>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <div className="h-[40px] bg-opacity-50 w-[300px] rounded-md bg-gray-100 flex items-center">
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  value={username}
                  onChange={handleChange}
                  onFocus={() => setShowUsernameNote(true)}
                  onBlur={() => setShowUsernameNote(false)}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  className="w-full shadow border rounded-md h-full bg-white bg-opacity-50 py-3 px-4 outline-0 focus:border-tomato focus:border-2"
                />
              </div>

              {showUsernameNote && (
                <div className="flex items-start gap-2 mt-2 text-xs  text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-[1px]" />
                  <span>username cannot be changed later.</span>
                </div>
              )}
            </div>

            <div className=" h-[40px] bg-opacity-50 w-[300px] rounded-md bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
              <input
                type="text"
                name="name"
                placeholder="name"
                value={name}
                onChange={handleChange}
                className=" w-full shadow border rounded-md h-full bg-white bg-opacity-50 py-3 px-4  outline-0 focus:border-tomato focus:border-2"
              />
            </div>
            <div className=" h-[40px] bg-opacity-50 w-[300px] rounded-md   bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
              <input
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={handleChange}
                className=" w-full shadow border rounded-md h-full bg-white bg-opacity-50 py-3 px-4  outline-0 focus:border-tomato focus:border-2"
              />
            </div>
            {/*  <div className=" h-[40px]  border  bg-opacity-50 w-[300px] rounded-md   bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
                <div className="relative w-[300px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                    965
                  </span>
                  <input
                    type="number"
                    name="phone"
                    placeholder="phone"
                    value={phone}
                    onChange={handleChange}
                    maxLength={8}
                    className="w-full h-[40px] shadow border rounded-md bg-white bg-opacity-50 pl-12 outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                  />
                </div>
              </div> */}
            <div className="rounded-md border relative  h-[40px]  w-[300px]   bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full shadow rounded-md h-full bg-white bg-opacity-50 py-3 px-4 outline-none outline-0  focus:border-tomato focus:border-2"
              />
              <button
                type="button"
                className="text-grey-40 absolute right-0 focus:text-violet-60 px-4 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye strokeWidth={1} />
                ) : (
                  <span>
                    <EyeOff strokeWidth={1} />
                  </span>
                )}
              </button>
            </div>
            <div className="rounded-md border relative  h-[40px]  w-[300px]   bg-gray-100  placeholder:text-grey-40  flex items-center mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="confirm password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full shadow rounded-md h-full bg-white bg-opacity-50 py-3 px-4 outline-none outline-0 focus:border-tomato focus:border-2"
              />
              <button
                type="button"
                className="text-grey-40 absolute right-0 focus:text-violet-60 px-4 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye strokeWidth={1} />
                ) : (
                  <span>
                    <EyeOff strokeWidth={1} />
                  </span>
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full mt-4  rounded-lg font-semibold flex items-center justify-center  px-3 py-2  transition-all delay-50 bg-gradient-to-t from-zinc-900 to-zinc-700  shadow-[0_7px_15px_rgba(0,0,0,0.5)] hover:scale-[0.995] text-white ">
                {!isLoading ? "Register" : <Spinner className="border-t-slate-700" />}
              </button>
            </div>
          </form>
          <div className="mt-5">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
