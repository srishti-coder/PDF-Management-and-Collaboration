import React from "react";
import toast from "react-hot-toast";

const validateEmail = (email) => {
  // Regular expression to validate email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const copyToClipboard = (link) => {
  const isSecure = window.location.protocol === "https:";
  if (!isSecure) {
    toast((t) => (
      <span>
        Clipboard access is not available in insecure sites. Please use this
        <a
          href={link}
          className="link link-primary px-2"
          target="_blank"
          rel="noreferrer"
        >
          Link
        </a>
        manually to visit it.
      </span>
    ));
  } else {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  }
};

export { validateEmail, copyToClipboard };
