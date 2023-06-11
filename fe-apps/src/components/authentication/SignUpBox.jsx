import React, { useState } from "react";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";

import { VisibleIcon, HiddenIcon } from "@assets/icons.js";

import Button from "@components/common/Button.jsx";

const SignUpBox = () => {
  const {
    setAuthMode,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    createUser,
  } = useAuthenticationStore();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold">Create An Account</span>
      <form
        className="form-control w-full max-w-xs my-4"
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <div className="my-1">
          <label className="label">
            <span className="label-text">What is your name?</span>
          </label>
          <input
            type="text"
            placeholder="Type Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full max-w-xs rounded-2xl"
          />
        </div>
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
            <span className="label-text">Secure it with password</span>
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
        <div className="my-8 flex flex-col items-center">
          <Button title="SignUp" showArrow={true} />
          <button
            className="btn btn-link text-base-content"
            onClick={() => setAuthMode("signin")}
          >
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpBox;
