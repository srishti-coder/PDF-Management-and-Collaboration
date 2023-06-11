import React, { useEffect } from "react";
import "@styles/tailwind.css";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";

import { context } from "@utils/constants.js";
import useInitStore from "@utils/stores/initStore.js";
import useAuthenticationStore from "@utils/stores/authenticationStore.js";

const Init = (props) => {
  const { handleWindowResize } = useInitStore();
  const { getCurrentUser } = useAuthenticationStore();

  useEffect(() => {
    if (
      !context.isAuthPage &&
      !context.isPdfShared &&
      context.authToken === null
    ) {
      window.location.href = "/authentication?redirected=true";
    }

    if (!context.isPdfShared && !context.isAuthPage) getCurrentUser();

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize, getCurrentUser]);

  return (
    <CookiesProvider>
      <div className="h-screen hide-scrollbar overflow-y-scroll bg-base-100 font-poppins">
        <props.App />
        <Toaster />
      </div>
    </CookiesProvider>
  );
};

export default Init;
