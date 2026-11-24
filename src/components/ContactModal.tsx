import { useEffect, useState, type FormEvent } from "react";
import { CloseIcon, Arrow } from "./Characters";
import { SocialLinks } from "./SocialLinks";
import { validateContactForm, type ContactFormValues } from "../utils/portfolioLogic";

interface ContactModalProps {
  isOpen: boolean;
  initialTopic?: ContactFormValues["topic"];
  initialNote?: string;
  onClose: () => void;
}

export function ContactModal({
  isOpen,
  initialTopic = "Product Design",
  initialNote = "",
  onClose,
}: ContactModalProps) {
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    topic: initialTopic,
    message: initialNote,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [submitted, setSubmitted] = useState<ContactFormValues | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues((prev) => ({
        ...prev,
        topic: initialTopic,
        message: initialNote || prev.message,
      }));
      setErrors({});
    }
  }, [isOpen, initialTopic, initialNote]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = validateContactForm(values);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitted({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sadmanrhd@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setSubmitted(null);
    setValues({ name: "", email: "", topic: initialTopic, message: "" });
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#171716]/45 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="w-full max-w-2xl rounded-2xl bg-[#f2efe6] text-[#171716] border-2 border-[#171716] shadow-[8px_8px_0_#171716] p-6 md:p-10 relative my-auto"
      >
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#171716] pb-5">
          <div>
            <p className="text-sm text-[#d9442e] font-medium m-0">
              Get in Touch · Singapore &amp; Remote
            </p>
            <h2
              id="contact-modal-title"
              className="mt-2 font-display text-3xl md:text-4xl font-medium leading-tight tracking-[-0.02em] m-0"
            >
              Let&apos;s Work Together
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="w-11 h-11 rounded-xl border-2 border-[#171716] bg-[#fffdf6] flex items-center justify-center hover:bg-[#171716] hover:text-[#f2efe6] transition-colors shrink-0"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#fffdf6] border-2 border-[#171716] px-4 py-3">
          <div className="text-sm">
            Direct email:{" "}
            <a
              href="mailto:sadmanrhd@gmail.com"
              className="underline decoration-2 underline-offset-4 hover:text-[#d9442e] font-medium"
            >
              sadmanrhd@gmail.com
            </a>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="px-3.5 py-1.5 rounded-xl border-2 border-[#171716] bg-[#f5d837] text-sm font-medium hover:bg-[#c7ef45] transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>

        <div data-testid="contact-modal-socials" className="mt-4">
          <SocialLinks variant="surface" compact />
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border-2 border-[#171716] bg-[#c7ef45] p-6 md:p-8">
            <p className="text-sm font-medium m-0">
              Inquiry Sent
            </p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-medium leading-tight m-0">
              Thanks, {submitted.name}.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#171716]/85">
              Your note about <strong className="font-semibold">{submitted.topic}</strong> has been
              logged for <span className="font-medium">{submitted.email}</span>. Sadman typically
              replies within two business days.
            </p>
            <div className="mt-5 p-4 rounded-xl bg-[#fffdf6] border-2 border-[#171716] text-sm leading-relaxed">
              {submitted.message}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm font-medium hover:bg-[#171716] hover:text-[#f2efe6] transition-colors"
              >
                Send Another Note
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-sm font-medium hover:bg-[#ff5b44] hover:text-[#171716] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5b44]"
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-[#c92a14] m-0">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5b44]"
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-[#c92a14] m-0">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium mb-2">
                Discipline
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(["Product Design", "Street Photography", "Both"] as const).map((topic) => {
                  const selected = values.topic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, topic }))}
                      aria-pressed={selected}
                      className={`px-3.5 py-2.5 rounded-xl border-2 border-[#171716] text-sm font-medium transition-colors whitespace-nowrap ${
                        selected
                          ? topic === "Street Photography"
                            ? "bg-[#4169ed] text-[#f2efe6]"
                            : "bg-[#ff5b44] text-[#171716]"
                          : "bg-[#fffdf6] text-[#171716] hover:bg-[#f5d837]"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium mb-1.5"
              >
                Project Brief
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                placeholder="Share a quick overview, timeline, or commission idea..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#ff5b44] resize-y"
              />
              {errors.message && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-[#c92a14] m-0">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border-2 border-[#171716] bg-transparent text-sm font-medium hover:bg-[#171716]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-sm font-medium shadow-[4px_4px_0_#ff5b44] hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[4px_4px_0_#171716] transition-all duration-150"
              >
                Send Message <Arrow />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
