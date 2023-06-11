import React from "react";
import { createRoot } from "react-dom/client";
import Init from "@components/common/Init.jsx";

import Header from "@components/common/Header.jsx";

import Body from "@components/dashboard/Body.jsx";

const App = () => {
  return (
    <div className="relative h-full overflow-hidden">
      <Header />
      <Body />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Init App={App} />);
