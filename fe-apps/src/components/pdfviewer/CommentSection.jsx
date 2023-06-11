import React, { useEffect, useState } from "react";

import useAuthenticationStore from "@utils/stores/authenticationStore.js";
import {
  usePDFViewerStore,
  useCommentsStore,
} from "@utils/stores/pdfviewerStore.js";

import { LoadingIcon, SendIcon, VerticalDotsIcon } from "@assets/icons.js";

import RepliesSection from "@components/pdfviewer/RepliesSection.jsx";

const CommentSection = () => {
  const { currentUser } = useAuthenticationStore();
  const { isPdfShared, sharedToUser } = usePDFViewerStore();
  const {
    comments,
    isCommentsLoading,
    fetchComments,
    comment,
    setComment,
    addComment,
    deleteComment,
  } = useCommentsStore();
  const [user, setUser] = useState(isPdfShared ? sharedToUser : currentUser);

  useEffect(() => {
    setUser(isPdfShared ? sharedToUser : currentUser);
  }, [isPdfShared, sharedToUser, currentUser, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <span className="text-xl font-semibold my-4">Comments</span>
      <div className="h-full flex flex-col justify-between overflow-auto">
        {isCommentsLoading && (
          <div className="flex flex-col items-center justify-center h-full">
            <LoadingIcon />
            <span className="text-md">Loading Comments...</span>
          </div>
        )}
        {!isCommentsLoading && comments.length === 0 && (
          <span className="text-center text-gray-500 h-full flex flex-col justify-end">
            No comments yet. Be the first to comment!
          </span>
        )}
        <div className="flex flex-col overflow-auto hide-scrollbar">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-base-300 p-4 rounded-md my-2 flex flex-row justify-between items-start"
            >
              <div className="flex flex-col">
                <div className="text-xs text-secondary">{comment.name}</div>
                <div>{comment.comment}</div>
                <RepliesSection comment={comment} user={user} />
              </div>
              {comment.email === user.email && (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0}>
                    <VerticalDotsIcon />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu shadow bg-base-100 rounded-box border"
                  >
                    <li>
                      <button onClick={() => deleteComment(comment.id)}>
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        <form
          className="flex flex-row justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            addComment(user);
          }}
        >
          <input
            className="w-full input input-bordered rounded-md my-6"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKey
          ></input>
          <button className="btn btn-outline" type="submit">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
