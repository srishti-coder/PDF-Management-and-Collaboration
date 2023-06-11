import React from "react";
import { create } from "zustand";
import toast from "react-hot-toast";

import { context } from "@utils/constants.js";

const useDashboardStore = create((set, get) => ({
  authToken: context.authToken,
  pdfList: [],
  isLoading: false,
  fetchPDFList: () => {
    set({ isLoading: true });
    fetch("/api/dashboard/listpdf/", {
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
        set({ isLoading: false, pdfList: data });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
        set({ isLoading: false });
      });
  },
  isUploadingPDF: false,
  uploadPDF: (file) => {
    set({ isUploadingPDF: true });
    let formData = new FormData();
    formData.append("file", file);
    toast.promise(
      new Promise((resolve, reject) => {
        fetch("/api/dashboard/uploadpdf/", {
          method: "POST",
          headers: {
            Authorization: `Token ${get().authToken}`,
          },
          body: formData,
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Something went wrong");
          })
          .then((data) => {
            set({ pdfList: [data.pdf, ...get().pdfList] });
            resolve();
            set({ isUploadingPDF: false });
          })
          .catch((err) => {
            console.log(err);
            reject();
            set({ uploadingPDF: false });
          });
      }),
      {
        loading: "Uploading PDF...",
        success: "PDF Uploaded Successfully",
        error: <b>Something went wrong</b>,
      }
    );
  },
  deletePDF: (id) => {
    fetch(`/api/dashboard/deletepdf/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${get().authToken}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("PDF Deleted Successfully");
          window.location.replace("/dashboard");
          return;
        }
        throw new Error("Something went wrong");
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
}));

export default useDashboardStore;
