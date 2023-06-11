import React from "react";

import { RightArrowIcon } from "@assets/icons.js";

const Button = ({ title, onClick, showArrow }) => {
  return (
    <button
      className="relative w-full btn btn-glass btn-accent rounded-2xl font-semibold text-base-content"
      onClick={onClick}
    >
      {title}
      {showArrow && (
        <div className="absolute right-4">
          <RightArrowIcon />
        </div>
      )}
    </button>
  );
};

export default Button;
