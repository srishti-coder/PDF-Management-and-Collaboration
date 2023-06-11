import React from "react";
import { create } from "zustand";
import toast from "react-hot-toast";

import { context } from "@utils/constants.js";
import { validateEmail } from "@utils/utils.js";

const usePDFViewerStore = create((set, get) => ({
  authToken: context.authToken,
  pdfId: context.pdfId,
  pdfUrl: null,
  pdfName: context.pdfName,
  fetchPDF: () => {
    fetch(`/api/pdfviewer/getpdf/${get().pdfId}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${get().authToken}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.blob();
        }
        throw new Error("Something went wrong");
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        set({ pdfUrl: url });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  isPdfShared: context.isPdfShared,
  sharedToUser: context.sharedToUser || {},
  fetchSharedPDF: () => {
    fetch(`/api/pdfviewer/getsharedpdf/${context.sharedId}/`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          return res.blob();
        }
        throw new Error("Something went wrong");
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        set({ pdfUrl: url });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  sharedViewers: [],
  fetchSharedViewers: () => {
    fetch(`/api/pdfviewer/getsharedviewers?pdf_id=${get().pdfId}`, {
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
        set({ sharedViewers: data.viewers });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  revokeAccess: (id) => {
    fetch(`/api/pdfviewer/revokeaccess/${id}/`, {
      method: "DELETE",
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
        set({
          sharedViewers: get().sharedViewers.filter(
            (viewer) => viewer.id !== id
          ),
        });
        toast.success("Access Revoked Successfully");
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
}));

const useShareStore = create((set, get) => ({
  authToken: context.authToken,
  pdfId: context.pdfId,
  pdfName: context.pdfName,
  email: "",
  setEmail: (email) => {
    set({ email: email });
  },
  name: "",
  setName: (name) => {
    set({ name: name });
  },
  isAuthenticatedUser: false,
  isExternalUser: false,
  checkUserAvailability: (email) => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    fetch(`/api/user/check?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
        if (data.message === "User is not available") {
          toast.error(
            "User not found. Please enter name for the external user"
          );
          set({
            name: "",
            isExternalUser: true,
            isAuthenticatedUser: false,
          });
        } else {
          set({
            name: data.name,
            isExternalUser: false,
            isAuthenticatedUser: true,
          });
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  isInvitationSent: false,
  link: "",
  inviteUser: () => {
    toast.promise(
      new Promise((resolve, reject) => {
        fetch("/api/pdfviewer/inviteviewer/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${get().authToken}`,
          },
          body: JSON.stringify({
            pdfId: get().pdfId,
            sharedToEmail: get().email,
            sharedToName: get().name,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Something went wrong");
          })
          .then((data) => {
            set({
              isInvitationSent: true,
              link: `${window.location.origin}/pdfviewer/shared/${data.sharedId}`,
            });
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      }),
      {
        loading: "Sending Invitation...",
        success: "Invitation Sent Successfully",
        error: <b>Something went wrong</b>,
      }
    );
  },
  reset: () => {
    set({
      email: "",
      name: "",
      isAuthenticatedUser: false,
      isExternalUser: false,
      isInvitationSent: false,
      link: "",
    });
  },
}));

const useCommentsStore = create((set, get) => ({
  authToken: context.authToken,
  pdfId: context.pdfId,
  comments: [],
  isCommentsLoading: false,
  fetchComments: () => {
    set({ isCommentsLoading: true });
    fetch(`/api/pdfviewer/getcomments?pdf_id=${get().pdfId}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        set({ isCommentsLoading: false, comments: data.comments });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
        set({ isCommentsLoading: false });
      });
  },
  sharedId: context.sharedId || "",
  comment: "",
  setComment: (comment) => {
    set({ comment: comment });
  },
  addComment: ({ name, email }) => {
    if (get().comment === "") {
      toast.error("Please enter a comment");
      return;
    } else {
      fetch("/api/pdfviewer/addcomment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfId: get().pdfId,
          comment: get().comment,
          name: name,
          email: email,
          sharedId: get().sharedId,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Something went wrong");
        })
        .then((data) => {
          set({
            comments: [
              {
                id: data.id,
                email: data.email,
                name: data.name,
                comment: data.comment,
                replies: [],
              },
              ...get().comments,
            ],
            comment: "",
          });
        })
        .catch((err) => {
          toast.error("Something went wrong");
          console.log(err);
        });
    }
  },
  deleteComment: (id) => {
    fetch(`/api/pdfviewer/deletecomment/${id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        set({
          comments: get().comments.filter((comment) => comment.id !== id),
        });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  addReply: ({ name, email, commentId, reply }) => {
    if (reply === "") {
      toast.error("Please enter a reply");
      return;
    }
    
    fetch("/api/pdfviewer/addreply/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfId: get().pdfId,
        reply: reply,
        name: name,
        email: email,
        commentId: commentId,
        sharedId: get().sharedId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        set({
          comments: get().comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [
                  {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    reply: data.reply,
                  },
                  ...comment.replies,
                ],
              };
            }
            return comment;
          }),
        });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
  deleteReply: (id, commentId) => {
    fetch(`/api/pdfviewer/deletereply/${id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        set({
          comments: get().comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== id),
              };
            }
            return comment;
          }),
        });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  },
}));

export { usePDFViewerStore, useShareStore, useCommentsStore };
