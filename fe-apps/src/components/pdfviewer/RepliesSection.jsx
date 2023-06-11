import React, { useState } from "react";

import { useCommentsStore } from "@utils/stores/pdfviewerStore.js";

import { VerticalDotsIcon, SendIcon } from "@assets/icons.js";

const RepliesSection = (props) => {
  const replies = props.comment.replies;
  const { addReply, deleteReply } = useCommentsStore();
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [reply, setReply] = useState("");

  return (
    <>
      <button
        className="text-xs w-min whitespace-nowrap text-primary my-1"
        onClick={() => setRepliesOpen(!repliesOpen)}
      >
        {replies.length === 0 ? "reply" : `${replies.length} replies`}
      </button>
      {repliesOpen && (
        <div className="pl-4">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-base-300 p-2 rounded-md flex flex-row justify-between items-start"
            >
              <div className="flex flex-col">
                <div className="text-xs text-secondary">{reply.name}</div>
                <div className="text-xs">{reply.reply}</div>
              </div>
              {reply.email === props.user.email && (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0}>
                    <VerticalDotsIcon />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu shadow bg-base-100 rounded-box border"
                  >
                    <li>
                      <button
                        onClick={() => deleteReply(reply.id, props.comment.id)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
          <form
            className="flex flex-row items-center my-2"
            onSubmit={(e) => {
              e.preventDefault();
              addReply({
                name: props.user.name,
                email: props.user.email,
                commentId: props.comment.id,
                reply: reply,
              });
              setReply("");
            }}
          >
            <input
              className="w-full border-2 border-base-300 rounded-md p-2"
              placeholder="Reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <button className="text-primary ml-2" type="submit">
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default RepliesSection;
