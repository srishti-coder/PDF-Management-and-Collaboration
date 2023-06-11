import React from "react";
import { createRoot } from "react-dom/client";
import Init from "@components/common/Init.jsx";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";

import SignUpBox from "@components/authentication/SignUpBox.jsx";
import SignInBox from "@components/authentication/SignInBox.jsx";
import ForgotPasswordBox from "@components/authentication/ForgotPasswordBox.jsx";
import ResetPasswordBox from "@components/authentication/ResetPasswordBox.jsx";

const App = () => {
  const { authMode } = useAuthenticationStore();

  return (
    <div className="h-full">
      {authMode === "signup" && <SignUpBox />}
      {authMode === "signin" && <SignInBox />}
      {authMode === "forgotpassword" && <ForgotPasswordBox />}
      {authMode === "resetpassword" && <ResetPasswordBox />}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Init App={App} />);
