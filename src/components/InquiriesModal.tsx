import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  ExternalLink,
  Inbox,
  Mail,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteInquiry,
  updateInquiryStatus,
  type InquiryRecord,
  type InquiryStatus,
} from "../services/contactService";
import { formatEditorialDate } from "../utils/blogLogic";

interface InquiriesModalProps {
  isOpen: boolean;
  inquiries: InquiryRecord[];
  onClose: () => void;
}

type InboxFilter = "all" | "new" | "archived";

function buildReplyInGmailUrl(inquiry: InquiryRecord): string {
  const subject = inquiry.subject.toLowerCase().startsWith("re:")
    ? inquiry.subject
    : `Re: ${inquiry.subject}`;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inquiry.email)}&su=${encodeURIComponent(subject)}`;
}

function formatInquiryTimestamp(date: Date | null): string {
  if (!date) return "Just now";
  const datePart = formatEditorialDate(date);
  const timePart = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
}

export function InquiriesModal({
  isOpen,
  inquiries,
  onClose,
}: InquiriesModalProps) {
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const unreadCount = useMemo(
    () => inquiries.filter((item) => item.status === "new").length,
    [inquiries],
  );

  const archivedCount = useMemo(
    () => inquiries.filter((item) => item.status === "archived").length,
    [inquiries],
  );

  const visibleInquiries = useMemo(() => {
    if (filter === "new") {
      return inquiries.filter((item) => item.status === "new");
    }
    if (filter === "archived") {
      return inquiries.filter((item) => item.status === "archived");
    }
    return inquiries.filter((item) => item.status !== "archived");
  }, [inquiries, filter]);

  if (!isOpen) return null;

  const handleStatusChange = async (id: string, nextStatus: InquiryStatus) => {
    setBusyId(id);
    setActionError(null);
    try {
      await updateInquiryStatus(id, nextStatus);
    } catch {
      setActionError("Could not update inquiry status. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setActionError(null);
    try {
      await deleteInquiry(id);
      setConfirmDeleteId(null);
    } catch {
      setActionError("Could not delete this inquiry. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiries-modal-title"
      data-testid="inquiries-modal"
      className="fixed inset-0 z-50 bg-[#171716]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-[#f2efe6] text-[#171716] border-2 border-[#171716] rounded-2xl shadow-[8px_8px_0_#171716] max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden my-auto">
        <div className="p-6 sm:p-7 border-b-2 border-[#171716] bg-[#fffdf6] flex items-start justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-medium text-[#d9442e] m-0">
              Private Inbox Backup · Owner Only
            </p>
            <h2
              id="inquiries-modal-title"
              className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold leading-tight text-[#171716] m-0"
            >
              Client Inquiries
            </h2>
            <p className="mt-1.5 text-sm text-[#171716]/68 m-0">
              Every message submitted through Get in Touch is backed up here alongside direct Gmail delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiries dialog"
            className="w-10 h-10 rounded-xl border-2 border-[#171716] bg-[#f2efe6] flex items-center justify-center hover:bg-[#171716] hover:text-[#f2efe6] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 sm:px-7 py-3.5 border-b border-[#171716]/15 bg-[#f2efe6] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div
            role="tablist"
            aria-label="Filter inquiries"
            className="inline-flex items-center rounded-xl border border-[#171716]/20 bg-[#fffdf6] p-0.5"
          >
            {(
              [
                { id: "all", label: `Inbox (${inquiries.length - archivedCount})` },
                { id: "new", label: `Unread (${unreadCount})` },
                { id: "archived", label: `Archived (${archivedCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-[#171716] text-[#f2efe6]"
                    : "text-[#171716]/72 hover:text-[#171716]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#171716]/60">
            Total saved: {inquiries.length}
          </span>
        </div>

        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-4">
          {actionError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl border border-[#c92a14] bg-[#fffdf6] text-xs font-medium text-[#c92a14]"
            >
              {actionError}
            </div>
          )}

          {visibleInquiries.length === 0 ? (
            <div className="rounded-2xl border-2 border-[#171716]/15 bg-[#fffdf6] px-6 py-12 text-center">
              <div className="w-11 h-11 rounded-2xl bg-[#f2efe6] border border-[#171716]/15 text-[#171716] grid place-items-center mx-auto mb-3">
                <Inbox className="w-5 h-5" />
              </div>
              <p className="font-display text-lg font-semibold text-[#171716] m-0">
                {filter === "new"
                  ? "No unread inquiries"
                  : filter === "archived"
                    ? "No archived inquiries"
                    : "No inquiries yet"}
              </p>
              <p className="mt-1.5 text-sm text-[#171716]/65 max-w-sm mx-auto m-0">
                When prospective clients or partners submit the Get in Touch form, their messages appear here immediately.
              </p>
            </div>
          ) : (
            visibleInquiries.map((inquiry) => {
              const isBusy = busyId === inquiry.id;
              const isNew = inquiry.status === "new";
              const isArchived = inquiry.status === "archived";

              return (
                <article
                  key={inquiry.id}
                  data-testid={`inquiry-card-${inquiry.id}`}
                  className={`rounded-2xl border-2 border-[#171716] p-5 space-y-4 transition-colors ${
                    isNew ? "bg-[#fffdf6] shadow-[4px_4px_0_#171716]" : "bg-[#fffdf6]/85"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-md border border-[#171716] font-semibold ${
                            isNew ? "bg-[#c7ef45] text-[#171716]" : "bg-[#f2efe6] text-[#171716]/75"
                          }`}
                        >
                          {isNew ? "New" : isArchived ? "Archived" : "Read"}
                        </span>
                        <span className="text-[#171716]/65 font-medium">
                          {inquiry.emailDelivered ? "Emailed to Gmail" : "Saved Backup"}
                        </span>
                        <span className="text-[#171716]/45">·</span>
                        <span className="text-[#171716]/60">
                          {formatInquiryTimestamp(inquiry.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-semibold text-[#171716] leading-snug m-0 break-words">
                        {inquiry.subject || `[${inquiry.topic}] Inquiry from ${inquiry.name}`}
                      </h3>

                      <p className="text-sm text-[#171716]/75 m-0">
                        From <strong className="font-semibold text-[#171716]">{inquiry.name}</strong>{" "}
                        &lt;
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="underline decoration-1 underline-offset-2 hover:text-[#d9442e]"
                        >
                          {inquiry.email}
                        </a>
                        &gt;
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f2efe6] border border-[#171716]/20 p-4 text-sm leading-relaxed text-[#171716] whitespace-pre-wrap break-words">
                    {inquiry.message}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                    <a
                      href={buildReplyInGmailUrl(inquiry)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-xs font-semibold text-[#171716] hover:bg-[#171716] hover:text-[#f2efe6] transition-colors whitespace-nowrap"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply in Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex flex-wrap items-center gap-2">
                      {!isArchived && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            handleStatusChange(inquiry.id, isNew ? "read" : "new")
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#171716]/30 bg-[#fffdf6] text-xs font-medium text-[#171716] hover:border-[#171716] transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isNew ? "Mark Read" : "Mark Unread"}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          handleStatusChange(
                            inquiry.id,
                            isArchived ? "read" : "archived",
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#171716]/30 bg-[#fffdf6] text-xs font-medium text-[#171716] hover:border-[#171716] transition-colors disabled:opacity-50"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>{isArchived ? "Move to Inbox" : "Archive"}</span>
                      </button>

                      {confirmDeleteId === inquiry.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(inquiry.id)}
                            className="px-3 py-1.5 rounded-xl border-2 border-[#c92a14] bg-[#c92a14] text-xs font-semibold text-[#fffdf6] hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1.5 rounded-xl border border-[#171716]/25 text-xs font-medium text-[#171716]/75 hover:border-[#171716]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirmDeleteId(inquiry.id)}
                          aria-label={`Delete inquiry from ${inquiry.name}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#171716]/25 text-xs font-medium text-[#171716]/70 hover:border-[#c92a14] hover:text-[#c92a14] transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
