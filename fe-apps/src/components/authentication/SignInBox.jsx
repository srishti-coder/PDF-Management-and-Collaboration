import React, { useState } from "react";
import { useCookies } from "react-cookie";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";

import { VisibleIcon, HiddenIcon } from "@assets/icons.js";

import Button from "@components/common/Button.jsx";

const SignInBox = () => {
  const {
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    createAuthToken,
  } = useAuthenticationStore();
  const [, setCookie] = new useCookies(["authToken"]);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold">Welcome to PDFColab</span>
      <form
        className="form-control w-full max-w-xs text-xl my-4"
        onSubmit={(e) => {
          e.preventDefault();
          createAuthToken(setCookie, rememberMe);
        }}
      >
        <div className="my-1">
          <label className="label">
            <span className="label-text">What is your email?</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type Your Email"
            className="input input-bordered w-full max-w-xs rounded-2xl"
          />
        </div>
        <div className="my-1">
          <label className="label">
            <span className="label-text">What is your password?</span>
          </label>
          <div className="relative rounded-2xl">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type Your Password"
              className="input input-bordered w-full max-w-xs rounded-2xl"
            />
            <button
              className="absolute right-0 top-0 btn btn-link text-base-content"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? <VisibleIcon /> : <HiddenIcon />}
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={rememberMe ? "checked" : null}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span className="label-text px-2">Remember me</span>
          </label>
          <button
            className="btn btn-link text-base-content"
            onClick={() => setAuthMode("forgotpassword")}
            type="button"
          >
            Forgot Password?
          </button>
        </div>
        <div className="my-8 flex flex-col items-center">
          <Button title="SignIn" showArrow={true} />
          <button
            className="btn btn-link text-base-content"
            onClick={() => setAuthMode("signup")}
          >
            Don't have an account?
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInBox;
