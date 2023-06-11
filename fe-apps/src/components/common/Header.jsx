import React from "react";
import { useCookies } from "react-cookie";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";

import { UserIcon } from "@assets/icons.js";

const Header = () => {
  const [, , removeCookie] = useCookies(["authToken"]);
  const { currentUser } = useAuthenticationStore();

  return (
    <div className="h-20 w-full flex flex-row items-center justify-between px-10">
      <a href="/">
        <span className="text-4xl font-bold">PDFColab</span>
      </a>
      <div className="w-28 flex flex-row items-center justify-between">
        <span>Hi {currentUser.name.split(" ")[0]}</span>
        <div className="dropdown dropdown-end dropdown-hover">
          <label tabIndex={0}>
            <UserIcon />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu shadow bg-base-100 rounded-box border"
          >
            <li>
              <button
                onClick={() => {
                  removeCookie("authToken");
                  window.location.href = "/authentication?logout=true";
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
