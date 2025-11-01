"use client";

import { supabase } from "@/lib/supabaseClient";
import { get } from "http";
import { useEffect, useState } from "react";
interface CommentParams {
  id: string;
  created_at: string;
  updated_at: string;
  username: string;
  payload: string;
  reply_of?: string;
}
interface EditCommentParams {
  id: string;
  payload: string;
}
export const HomeClient = () => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState<CommentParams[]>([]);
  const [editComment, setEditComment] = useState<EditCommentParams>({
    id: "",
    payload: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const onChangeEditComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditComment((prev) => ({ ...prev, payload: e.target.value }));
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call Supabase to persist the comment
    console.log("Submitted comment:", comment);
    const { data, error } = await supabase
      .from("comments")
      .insert({ username: "Anonymous", payload: comment });
    if (!error) {
      window.alert("Comment sent successfully!");
      setComment("");
    } else {
      window.alert(error?.message || "Error sending comment");
    }
  };

  // fetch comment list from Supabase
  const getCommentList = async () => {
    const { data, error } = await supabase.from("comments").select("*");
    if (!error) {
      setCommentList(data);
    } else {
      window.alert(error?.message || "Error fetching comments");
      setCommentList([]);
    }
  };

  // fetch comments on component mount
  useEffect(() => {
    getCommentList();
  }, []);

  // confirm edit comment
  const confirmEdit = async () => {
    const { data, error } = await supabase
      .from("comments")
      .update({ payload: editComment.payload })
      .eq("id", editComment.id);
    if (!error) {
      window.alert("Comment updated successfully!");
      setEditComment({ id: "", payload: "" });
      getCommentList();
    } else {
      window.alert(error?.message || "Error updating comment");
    }
  };

  //delete comment
  const confirmDelete = async (id: string) => {
    const ok = window.confirm("Delete comment?");
    if (ok) {
      const { data, error } = await supabase
        .from("comments")
        .delete()
        .match({ id });
      if (!error) {
        window.alert("Deleted Comment :)");
      } else {
        window.alert(error?.message);
      }
    }
  };
  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold">Comments!</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex gap-8">
        <input
          type="text"
          placeholder="Add a comment"
          onChange={handleChange}
          value={comment}
          className="p-2 border-b focus:border-b-gray-700 w-full outline-none"
        />
        <button className="px-4 py-2 bg-blue-500 rounded-lg text-white">
          Submit
        </button>
      </form>
      <div className="flex flex-col gap-4 pt-12">
        {commentList
          .sort((a, b) => {
            const aDate = new Date(a.created_at);
            const bDate = new Date(b.created_at);
            return +aDate - +bDate;
          })
          .map((comment) => {
            const isEditing = editComment.id === comment.id;

            return (
              <div key={comment.id} className="border rounded-md p-4">
                <p className="font-semibold mb-2">
                  {comment.username}
                  {comment.updated_at !== comment.created_at && (
                    <span className="ml-4 text-sm italic font-extralight">
                      edited
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 justify-between">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editComment.payload}
                      onChange={onChangeEditComment}
                      className="pb-1 border-b w-full"
                    />
                  ) : (
                    <p className="font-light">{comment.payload}</p>
                  )}
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={confirmEdit}
                          disabled={editComment.payload === comment.payload}
                          className="text-green-500"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditComment({ id: "", payload: "" })
                          }
                          className="text-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setEditComment({
                              id: comment.id,
                              payload: comment.payload,
                            })
                          }
                          className="text-green-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(comment.id)}
                          className="text-gray-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
