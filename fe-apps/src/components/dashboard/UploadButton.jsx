import React, { useRef } from "react";

import useDashboardStore from "@utils/stores/dashboardStore.js";

import { LoadingIcon } from "@assets/icons.js";

const UploadButton = () => {
  const { isUploadingPDF, uploadPDF } = useDashboardStore();
  const pdfRef = useRef(null);

  return (
    <div>
      <input
        ref={pdfRef}
        onChange={() => {
          uploadPDF(pdfRef.current.files[0]);
        }}
        type="file"
        accept=".pdf"
        className="hidden"
        multiple={false}
      />
      <button
        onClick={() => pdfRef.current.click()}
        className={`btn btn-outline m-2 w-40 ${
          isUploadingPDF && "btn-disabled"
        }`}
      >
        {isUploadingPDF && <LoadingIcon />}
        {isUploadingPDF ? "Uploading" : "Upload New PDF"}
      </button>
    </div>
  );
};

export default UploadButton;
