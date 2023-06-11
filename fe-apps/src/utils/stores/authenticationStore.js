import React from "react";
import { create } from "zustand";
import toast from "react-hot-toast";

import { context } from "@utils/constants.js";
import { validateEmail } from "@utils/utils.js";

const useAuthenticationStore = create((set, get) => ({
  authMode: context.authMode,
  setAuthMode: (mode) => {
    set({ authMode: mode });
  },
  name: "",
  setName: (name) => {
    set({ name: name });
  },
  email: "",
  setEmail: (email) => {
    set({ email: email });
  },
  password: "",
  setPassword: (password) => {
    set({ password: password });
  },
  authToken: context.authToken,
  isUserLoggedIn: () => get().authToken !== null,
  createAuthToken: (setCookie, rememberMe) => {
    if (!validateEmail(get().email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (get().password.length < 8) {
      toast.error("Password must be atleast 8 characters long");
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        fetch("/api/user/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: get().email.toLowerCase(),
            password: get().password,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Something went wrong");
          })
          .then((data) => {
            set({ authToken: data.token });
            const expirationDate = new Date();
            if (rememberMe)
              expirationDate.setMonth(expirationDate.getMonth() + 1);
            else expirationDate.setDate(expirationDate.getDate() + 1);
            setCookie("authToken", data.token, {
              path: "/",
              expires: expirationDate,
            });
            resolve();
            const queryParams = new URLSearchParams(window.location.search);
            const isRedirected = queryParams.get("redirected") === "true";
            const previousURL = document.referrer;
            const isSameOrigin = previousURL.startsWith(window.location.origin);
            if (isRedirected && isSameOrigin)
              window.location.replace(previousURL);
            else window.location.href = "/dashboard";
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      }),
      {
        loading: "Logging In...",
        success: "Logged In Successfully",
        error: <b>Something went wrong</b>,
      }
    );
  },
  createUser: () => {
    if (!validateEmail(get().email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (get().password.length < 8) {
      toast.error("Password must be atleast 8 characters long");
      return;
    }
    if (get().name === "" || get().email === "") {
      toast.error("Please fill all the fields");
      return;
    }

    fetch("/api/user/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: get().name,
        email: get().email.toLowerCase(),
        password: get().password,
      }),
    }).then((res) => {
      if (res.ok) {
        set({ authMode: "signin" });
        toast.success("User Created Successfully");
      } else {
        toast.error("User Already Exists");
      }
    });
  },
  currentUser: {
    name: "",
    email: "",
  },
  getCurrentUser: () => {
    fetch("/api/user/me/", {
      method: "GET",
      headers: {
        Authorization: `Token ${get().authToken}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        set({ currentUser: data });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  sendResetPasswordEmail: () => {
    if (!validateEmail(get().email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        fetch("/api/user/forgotpassword/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: get().email.toLowerCase(),
          }),
        })
          .then((res) => {
            if (res.ok) {
              resolve();
            }
            throw new Error("Something went wrong");
          })
          .catch((err) => {
            reject();
            console.log(err);
          });
      }),
      {
        loading: "Sending Email...",
        success: "Email Sent Successfully",
        error: <b>Something went wrong</b>,
      }
    );
  },
  setNewPassword: (password, confirmPassword) => {
    if (password.length < 8) {
      toast.error("Password must be atleast 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    
    toast.promise(
      new Promise((resolve, reject) => {
        fetch("/api/user/resetpassword/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: password,
          }),
        })
          .then((res) => {
            if (res.ok) {
              resolve();
              window.location.replace("/");
            }
            throw new Error("Something went wrong");
          })
          .catch((err) => {
            reject();
            console.log(err);
          });
      }),
      {
        loading: "Resetting Password...",
        success: "Password Reset Successfully",
        error: <b>Something went wrong</b>,
      }
    );
  },
}));

export default useAuthenticationStore;
