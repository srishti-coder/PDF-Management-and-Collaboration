import React, { useEffect, useState } from "react";

import useDashboardStore from "@utils/stores/dashboardStore.js";

import { PdfIcon, LoadingIcon } from "@assets/icons.js";

import UploadButton from "@components/dashboard/UploadButton.jsx";

const Body = () => {
  const { pdfList, fetchPDFList, isLoading } = useDashboardStore();
  const [searchedPDF, setSearchedPDF] = useState("");

  useEffect(() => {
    fetchPDFList();
  }, [fetchPDFList]);

  return (
    <div className="absolute h-full w-full bg-base-100">
      <div className="w-full flex flex-row">
        <input
          type="text"
          value={searchedPDF}
          onChange={(e) => setSearchedPDF(e.target.value)}
          className="input input-bordered w-full m-2"
          placeholder="Search PDF here..."
        />
        <UploadButton />
      </div>
      <div className="h-full flex flex-col overflow-auto hide-scrollbar">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full mb-36">
            <LoadingIcon />
            <span className="text-md">Loading...</span>
          </div>
        )}
        {!isLoading && pdfList.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full mb-36">
            <h1 className="text-4xl">No PDFs Found</h1>
          </div>
        )}
        {pdfList
          .filter((pdf) =>
            pdf.name.toLowerCase().includes(searchedPDF.toLowerCase())
          )
          .map((pdf) => (
            <button
              key={pdf.id}
              className="btn btn-lg m-2 justify-start"
              onClick={() => (window.location.href = `/pdfviewer/${pdf.id}`)}
            >
              <PdfIcon />
              <span className="mx-6">{pdf.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Body;
