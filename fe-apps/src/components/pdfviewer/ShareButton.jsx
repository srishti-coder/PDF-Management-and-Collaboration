import React, { useState } from "react";

import { useShareStore } from "@utils/stores/pdfviewerStore.js";
import { copyToClipboard } from "@utils/utils.js";

import { UserIcon, LinkIcon } from "@assets/icons.js";

const ShareButton = () => {
  const [openShareModal, setOpenShareModal] = useState(false);
  const {
    pdfName,
    email,
    setEmail,
    name,
    setName,
    isAuthenticatedUser,
    isExternalUser,
    checkUserAvailability,
    isInvitationSent,
    link,
    inviteUser,
    reset,
  } = useShareStore();

  return (
    <>
      <div
        className="tooltip tooltip-top w-1/2"
        data-tip="Share PDF with others"
      >
        <button
          className="btn btn-outline rounded-md w-full"
          onClick={() => setOpenShareModal(true)}
        >
          Share
        </button>
      </div>
      <dialog
        className={`modal h-screen w-screen ${openShareModal && "modal-open"}`}
      >
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setOpenShareModal(false);
              reset();
            }}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">{pdfName}</h3>
          <form
            className="flex flex-row justify-between items-center"
            onSubmit={(e) => {
              e.preventDefault();
              checkUserAvailability(email);
            }}
          >
            <input
              type="email"
              value={email}
              className="input input-bordered w-4/5 rounded-md my-4"
              placeholder="Add email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInvitationSent}
            />
            <button
              className={`btn btn-outline rounded-md ${
                isInvitationSent && "btn-disabled"
              }`}
              type="submit"
            >
              Search
            </button>
          </form>
          {isAuthenticatedUser && (
            <div className="w-full, bg-base-300 p-4 rounded-3xl flex flex-row items-center">
              <UserIcon />
              <span className="mx-2">{name}</span>
            </div>
          )}
          {isExternalUser && (
            <input
              type="text"
              value={name}
              className="input input-bordered w-full rounded-md"
              placeholder="Enter external username"
              onChange={(e) => setName(e.target.value)}
              disabled={isInvitationSent}
            />
          )}
          <div className="modal-action justify-between items-center">
            <button
              className={`btn btn-sm btn-outline rounded-full w-28 flex flex-row justify-around items-center ${
                !isInvitationSent && "btn-disabled"
              }`}
              onClick={() => copyToClipboard(link)}
            >
              <LinkIcon />
              <span className="text-xs">Copy Link</span>
            </button>
            <button
              className={`btn ${
                (email === "" || name === "" || isInvitationSent) &&
                "btn-disabled"
              }`}
              onClick={() => inviteUser()}
            >
              Invite
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ShareButton;
