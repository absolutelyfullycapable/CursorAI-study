"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/actions/comments";
import { formatRelativeTime, getPublicImageUrl } from "@/lib/utils";

export type CommentItem = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  parent_id: string | null;
  image_path: string | null;
  profiles: { username: string } | null;
};

export function CommentSection({
  postId,
  comments,
  currentUserId,
  isLoggedIn,
}: {
  postId: string;
  comments: CommentItem[];
  currentUserId: string | null;
  isLoggedIn: boolean;
}) {
  const boundCreate = createComment.bind(null, postId, null);
  const [state, formAction, pending] = useActionState(boundCreate, {});

  const roots = comments.filter((c) => !c.parent_id);
  const repliesByParent = comments.reduce<Record<string, CommentItem[]>>((acc, c) => {
    if (!c.parent_id) return acc;
    if (!acc[c.parent_id]) acc[c.parent_id] = [];
    acc[c.parent_id].push(c);
    return acc;
  }, {});

  return (
    <section className="space-y-2.5">
      <h3 className="px-0.5 text-[15px] font-bold tracking-tight text-ink">
        댓글 {comments.length}
      </h3>

      {isLoggedIn ? (
        <form action={formAction} className="card space-y-3 p-4">
          {state.error ? (
            <p className="text-[13px] text-red-600">{state.error}</p>
          ) : null}
          <textarea
            name="content"
            rows={3}
            placeholder="댓글을 입력하세요"
            className="input-field min-h-[80px] resize-y"
          />
          <ImageField />
          <button
            type="submit"
            disabled={pending}
            className="btn-primary px-4 py-1.5 text-[13px] disabled:opacity-60"
          >
            {pending ? "등록 중..." : "댓글 등록"}
          </button>
        </form>
      ) : (
        <p className="card p-4 text-[13px] text-muted">
          댓글을 쓰려면{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </p>
      )}

      <ul className="space-y-2">
        {roots.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            replies={repliesByParent[comment.id] ?? []}
            postId={postId}
            currentUserId={currentUserId}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </ul>
    </section>
  );
}

function ImageField({
  currentImagePath = null,
  showRemove = false,
}: {
  currentImagePath?: string | null;
  showRemove?: boolean;
}) {
  const currentUrl = getPublicImageUrl(currentImagePath);

  return (
    <div className="space-y-2">
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt="첨부 이미지"
          className="max-h-40 rounded-xl object-cover"
        />
      ) : null}
      <label className="block text-[12px] font-semibold text-muted">
        이미지 첨부 (선택, 5MB 이하)
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-[12px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-ink"
        />
      </label>
      {showRemove && currentUrl ? (
        <label className="flex items-center gap-2 text-[12px] text-muted">
          <input type="checkbox" name="remove_image" />
          기존 이미지 삭제
        </label>
      ) : null}
    </div>
  );
}

function CommentThread({
  comment,
  replies,
  postId,
  currentUserId,
  isLoggedIn,
}: {
  comment: CommentItem;
  replies: CommentItem[];
  postId: string;
  currentUserId: string | null;
  isLoggedIn: boolean;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <li className="space-y-2">
      <CommentRow
        comment={comment}
        postId={postId}
        canEdit={currentUserId === comment.author_id}
        isLoggedIn={isLoggedIn}
        onReply={() => setReplying((v) => !v)}
        showReplyButton
      />

      {replying && isLoggedIn ? (
        <div className="ml-6 sm:ml-8">
          <ReplyForm
            postId={postId}
            parentId={comment.id}
            onDone={() => setReplying(false)}
            onCancel={() => setReplying(false)}
            placeholder={`${comment.profiles?.username ?? "작성자"}님에게 답글`}
          />
        </div>
      ) : null}

      {replies.length > 0 ? (
        <ul className="ml-4 space-y-2 border-l-2 border-border pl-3 sm:ml-6 sm:pl-4">
          {replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              postId={postId}
              canEdit={currentUserId === reply.author_id}
              isLoggedIn={isLoggedIn}
              isReply
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ReplyForm({
  postId,
  parentId,
  onDone,
  onCancel,
  placeholder,
}: {
  postId: string;
  parentId: string;
  onDone: () => void;
  onCancel: () => void;
  placeholder: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createComment(postId, parentId, {}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      onDone();
    });
  }

  return (
    <form action={onSubmit} className="card space-y-2 p-3">
      {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
      <textarea
        name="content"
        rows={2}
        autoFocus
        placeholder={placeholder}
        className="input-field min-h-[64px] resize-y"
      />
      <ImageField />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary px-3 py-1 text-[13px] disabled:opacity-60"
        >
          {pending ? "등록 중..." : "답글 등록"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost px-3 py-1 text-[13px]">
          취소
        </button>
      </div>
    </form>
  );
}

function CommentRow({
  comment,
  postId,
  canEdit,
  isLoggedIn,
  onReply,
  showReplyButton = false,
  isReply = false,
}: {
  comment: CommentItem;
  postId: string;
  canEdit: boolean;
  isLoggedIn: boolean;
  onReply?: () => void;
  showReplyButton?: boolean;
  isReply?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const imageUrl = getPublicImageUrl(comment.image_path);

  function onSave(formData: FormData) {
    startTransition(async () => {
      const result = await updateComment(comment.id, postId, {}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setEditing(false);
    });
  }

  function onDelete() {
    if (!confirm(isReply ? "답글을 삭제할까요?" : "댓글을 삭제할까요?")) return;
    startTransition(async () => {
      await deleteComment(comment.id, postId);
    });
  }

  return (
    <div className={`card p-4 ${isReply ? "bg-surface-muted/40" : ""}`}>
      <div className="mb-2 flex items-center justify-between gap-2 text-[12px] text-muted">
        <div className="flex items-center gap-2">
          {isReply ? (
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-muted ring-1 ring-border">
              답글
            </span>
          ) : null}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-ink/70">
            {(comment.profiles?.username ?? "?").slice(0, 1)}
          </span>
          <span className="font-semibold text-ink/75">
            u/{comment.profiles?.username ?? "unknown"}
          </span>
        </div>
        <time dateTime={comment.created_at}>
          {formatRelativeTime(comment.created_at)}
          {comment.updated_at !== comment.created_at ? " · 수정됨" : ""}
        </time>
      </div>

      {editing ? (
        <form action={onSave} className="space-y-2">
          {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
          <textarea
            name="content"
            rows={3}
            defaultValue={comment.content}
            className="input-field resize-y"
          />
          <ImageField currentImagePath={comment.image_path} showRemove />
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary px-3 py-1 text-[13px]">
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-ghost px-3 py-1 text-[13px]"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          {comment.content ? (
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink/90">
              {comment.content}
            </p>
          ) : null}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className={`max-h-72 w-full rounded-xl object-cover ${comment.content ? "mt-3" : ""}`}
            />
          ) : null}
          <div className="mt-2 flex flex-wrap gap-3">
            {showReplyButton && isLoggedIn ? (
              <button
                type="button"
                onClick={onReply}
                className="text-[12px] font-semibold text-brand hover:underline"
              >
                답글 달기
              </button>
            ) : null}
            {showReplyButton && !isLoggedIn ? (
              <Link href="/login" className="text-[12px] font-semibold text-muted hover:text-ink">
                로그인 후 답글
              </Link>
            ) : null}
            {canEdit ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-[12px] font-semibold text-muted hover:text-ink"
                >
                  수정
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={onDelete}
                  className="text-[12px] font-semibold text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
