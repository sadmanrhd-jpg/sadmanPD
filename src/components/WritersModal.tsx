import { useState, type FormEvent } from "react";
import { Pause, Play, Trash2, UserPlus, X } from "lucide-react";
import {
  addOrUpdateWriter,
  deleteWriter,
  toggleWriterStatus,
} from "../services/blogService";
import {
  OWNER_EMAIL,
  validateWriterInput,
  type WriterRecord,
} from "../utils/blogLogic";

interface WritersModalProps {
  isOpen: boolean;
  adminUid: string;
  writers: WriterRecord[];
  onClose: () => void;
}

export function WritersModal({
  isOpen,
  adminUid,
  writers,
  onClose,
}: WritersModalProps) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("Guest Writer");
  const [bio, setBio] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddWriter = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const check = validateWriterInput({ email, displayName, title, bio });
    setFormErrors(check.errors);
    if (!check.valid) return;

    setSubmitting(true);
    try {
      await addOrUpdateWriter({ email, displayName, title, bio }, adminUid);
      setEmail("");
      setDisplayName("");
      setTitle("Guest Writer");
      setBio("");
      setStatusMessage(
        "Writer added. They can now sign in using their Google account at #blog/login or via the subtle Sign in link at the bottom of the Blog page.",
      );
    } catch (error) {
      setFormErrors({
        email:
          error instanceof Error ? error.message : "Could not save writer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (writer: WriterRecord) => {
    setActionId(writer.id);
    setStatusMessage(null);
    try {
      await toggleWriterStatus(writer);
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (writerId: string) => {
    setActionId(writerId);
    setStatusMessage(null);
    try {
      await deleteWriter(writerId);
      setConfirmRemoveId(null);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="writers-modal-title"
      className="fixed inset-0 z-50 bg-[#171716]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#fffdf6] text-[#171716] border-2 border-[#171716] rounded-2xl shadow-[8px_8px_0_#171716] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-5 border-b border-[#171716]/12">
          <div>
            <p className="text-xs font-medium text-[#d9442e] mb-1">
              Author Access Registry
            </p>
            <h2
              id="writers-modal-title"
              className="font-display text-2xl font-semibold text-[#171716]"
            >
              Manage Blog Writers
            </h2>
            <p className="text-sm text-[#171716]/65 mt-1">
              Add trusted writers by their Google email whenever you are ready to grow the team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close writers manager"
            className="w-9 h-9 rounded-xl border border-[#171716]/20 flex items-center justify-center text-[#171716]/75 hover:border-[#171716] hover:text-[#171716] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-8">
          {/* Invite Writer Form */}
          <form onSubmit={handleAddWriter} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#171716]">
              <UserPlus className="w-4 h-4 text-[#d9442e]" />
              <span>Add a Writer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="writer-email"
                  className="block text-xs font-medium text-[#171716]/75 mb-1.5"
                >
                  Google Email
                </label>
                <input
                  id="writer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="writer@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#171716]/25 bg-[#f2efe6]/45 text-sm text-[#171716] focus:outline-none focus:border-[#171716]"
                />
                {formErrors.email && (
                  <p className="text-xs text-[#d9442e] mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="writer-name"
                  className="block text-xs font-medium text-[#171716]/75 mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="writer-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Anika Rahman"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#171716]/25 bg-[#f2efe6]/45 text-sm text-[#171716] focus:outline-none focus:border-[#171716]"
                />
                {formErrors.displayName && (
                  <p className="text-xs text-[#d9442e] mt-1">
                    {formErrors.displayName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="writer-title"
                  className="block text-xs font-medium text-[#171716]/75 mb-1.5"
                >
                  Editorial Role
                </label>
                <input
                  id="writer-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Guest Writer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#171716]/25 bg-[#f2efe6]/45 text-sm text-[#171716] focus:outline-none focus:border-[#171716]"
                />
              </div>

              <div>
                <label
                  htmlFor="writer-bio"
                  className="block text-xs font-medium text-[#171716]/75 mb-1.5"
                >
                  Short Bio (Optional)
                </label>
                <input
                  id="writer-bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Writes about visual storytelling and systems."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#171716]/25 bg-[#f2efe6]/45 text-sm text-[#171716] focus:outline-none focus:border-[#171716]"
                />
              </div>
            </div>

            {statusMessage && (
              <p className="text-xs text-[#171716]/80 bg-[#f2efe6] px-3.5 py-2.5 rounded-xl">
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-[#171716] text-sm font-medium shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {submitting ? "Adding Writer..." : "Approve Writer Access"}
            </button>
          </form>

          {/* Active Roster */}
          <div className="pt-6 border-t border-[#171716]/12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#171716]">
                Authorized Authors
              </h3>
              <span className="text-xs text-[#171716]/55 tabular-nums">
                {writers.length + 1} total
              </span>
            </div>

            <div className="divide-y divide-[#171716]/10 border-y border-[#171716]/10">
              {/* Owner row */}
              <div className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#171716]">
                    Sadman Rahman
                  </p>
                  <p className="text-xs text-[#171716]/60 mt-0.5 truncate">
                    {OWNER_EMAIL} · Owner &amp; Admin
                  </p>
                </div>
                <span className="text-xs font-medium text-[#171716]/70">
                  Full Access
                </span>
              </div>

              {writers.length === 0 ? (
                <p className="py-4 text-xs text-[#171716]/55">
                  No additional writers added yet. Right now only your account can publish.
                </p>
              ) : (
                writers.map((writer) => (
                  <div
                    key={writer.id}
                    className="py-3.5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#171716]">
                        {writer.displayName}
                      </p>
                      <p className="text-xs text-[#171716]/60 mt-0.5 truncate">
                        {writer.email} · {writer.title || "Guest Writer"} ·{" "}
                        {writer.status === "active" ? "Active" : "Paused"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={actionId === writer.id}
                        onClick={() => handleToggleStatus(writer)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#171716]/20 text-xs font-medium text-[#171716]/80 hover:border-[#171716] hover:text-[#171716] transition-colors disabled:opacity-50"
                      >
                        {writer.status === "active" ? (
                          <>
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>

                      {confirmRemoveId === writer.id ? (
                        <div className="inline-flex items-center gap-1.5 text-xs">
                          <button
                            type="button"
                            disabled={actionId === writer.id}
                            onClick={() => handleRemove(writer.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#d9442e] text-white font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmRemoveId(null)}
                            className="px-2 py-1.5 text-[#171716]/65"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmRemoveId(writer.id)}
                          aria-label={`Remove ${writer.displayName}`}
                          className="p-1.5 rounded-lg border border-[#171716]/15 text-[#d9442e] hover:border-[#d9442e] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
