import React from "react";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";

import Button from "@components/common/Button.jsx";

const ForgotPasswordBox = () => {
  const { setAuthMode, email, setEmail, sendResetPasswordEmail } =
    useAuthenticationStore();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold">Forgot your password?</span>
      <div className="form-control w-full max-w-xs my-4">
        <div className="my-1">
          <label className="label">
            <span className="label-text">What is your email?</span>
          </label>
          <input
            type="email"
            placeholder="Type Your Email"
            className="input input-bordered w-full max-w-xs rounded-2xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-8 flex flex-col items-center">
          <Button
            title="Send Email"
            showArrow={true}
            onClick={sendResetPasswordEmail}
          />
          <button
            className="btn btn-link text-base-content"
            onClick={() => setAuthMode("signin")}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordBox;
