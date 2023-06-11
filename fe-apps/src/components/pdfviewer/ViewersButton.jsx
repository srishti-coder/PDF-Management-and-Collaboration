import React, { useState } from "react";

import { usePDFViewerStore } from "@utils/stores/pdfviewerStore.js";
import { copyToClipboard } from "@utils/utils.js";

import {
  ViewersIcon,
  UserIcon,
  CopyIcon,
  VerticalDotsIcon,
} from "@assets/icons.js";

const ViewersButton = () => {
  const { pdfName, sharedViewers, fetchSharedViewers, revokeAccess } =
    usePDFViewerStore();
  const [showViewersModal, setShowViewersModal] = useState(false);

  return (
    <>
      <div className="tooltip tooltip-top w-1/5" data-tip="Viewers with access">
        <button
          className="btn btn-outline rounded-md w-full"
          onClick={() => {
            fetchSharedViewers();
            setShowViewersModal(true);
          }}
        >
          <ViewersIcon />
        </button>
      </div>
      <dialog
        className={`modal h-screen w-screen ${
          showViewersModal && "modal-open"
        }`}
      >
        <form method="dialog" className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowViewersModal(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">{pdfName}</h3>
          <div className="min-h-[8rem] max-h-56 overflow-auto">
            {sharedViewers.map((viewer) => (
              <div
                key={viewer.id}
                className="w-full bg-base-300 px-4 py-2 rounded-3xl flex flex-row items-center justify-between my-4"
              >
                <div className="flex flex-row items-center">
                  <UserIcon />
                  <span className="mx-2">
                    {(
                      viewer.shared_to_name + `( ${viewer.shared_to_email} )`
                    ).substring(0, 30) + "..."}
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <button
                    className="btn btn-link r-0"
                    onClick={() => {
                      copyToClipboard(
                        `${window.location.origin}/pdfviewer/shared/${viewer.id}`
                      );
                    }}
                  >
                    <CopyIcon />
                  </button>
                  <div className="dropdown dropdown-left">
                    <label tabIndex={0}>
                      <VerticalDotsIcon />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu shadow bg-base-100 rounded-box border"
                    >
                      <li>
                        <button
                          onClick={() => revokeAccess(viewer.id)}
                          className="w-36"
                        >
                          Revoke Access
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            {sharedViewers.length === 0 && (
              <div className="w-full p-16 flex flex-row items-center justify-center">
                <span>No shared viewers</span>
              </div>
            )}
          </div>
          <div className="modal-action justify-end items-center">
            <button className="btn" onClick={() => setShowViewersModal()}>
              Done
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default ViewersButton;
