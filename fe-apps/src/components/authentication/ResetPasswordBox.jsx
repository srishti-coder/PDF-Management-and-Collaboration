import React, { useState } from "react";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";

import { VisibleIcon, HiddenIcon } from "@assets/icons.js";

import Button from "@components/common/Button.jsx";

const ResetPasswordBox = () => {
  const { setNewPassword } = useAuthenticationStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold">Reset your password</span>
      <div className="form-control w-full max-w-xs my-4">
        <div className="my-1">
          <label className="label">
            <span className="label-text">Set new password</span>
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
        <div className="my-1">
          <label className="label">
            <span className="label-text">Confirm new password</span>
          </label>
          <div className="relative rounded-2xl">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type Your Password"
              className="input input-bordered w-full max-w-xs rounded-2xl"
            />
            <button
              className="absolute right-0 top-0 btn btn-link text-base-content"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              type="button"
            >
              {showConfirmPassword ? <VisibleIcon /> : <HiddenIcon />}
            </button>
          </div>
        </div>
        <div className="my-8 flex flex-col items-center">
          <Button
            title="Reset Password"
            showArrow={true}
            onClick={() => setNewPassword(password, confirmPassword)}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordBox;
