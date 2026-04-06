"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isValidEmailFormat, registerPlayer } from "../services/registrationService";
import type { PlayerProfile } from "../types/gameTypes";

const EASE = [0.33, 1, 0.68, 1] as const;

interface ChallengeRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (profile: PlayerProfile) => void;
}

export function ChallengeRegistrationModal({
  open,
  onClose,
  onSuccess,
}: ChallengeRegistrationModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [hasChapter, setHasChapter] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHasChapter(false);
    setChapterName("");
    setErrors({});
    setSubmitting(false);
  }, []);

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (firstName.trim().length < 2) {
      e.firstName = "First name must be at least 2 characters.";
    }
    if (!lastName.trim()) {
      e.lastName = "Last name is required.";
    }
    if (!isValidEmailFormat(email)) {
      e.email = "Enter a valid email address.";
    }
    if (hasChapter && !chapterName.trim()) {
      e.chapterName = "Chapter name is required when you select Yes.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = registerPlayer({
      firstName,
      lastName,
      email,
      chapter: hasChapter ? chapterName.trim() : null,
    });
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ form: result.message });
      return;
    }
    reset();
    onSuccess(result.profile);
  };

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm text-[#E8E9E4] placeholder:text-[#B1C9EB]/35 outline-none transition-shadow";
  const inputStyle: React.CSSProperties = {
    background: "rgba(20,88,134,0.2)",
    border: "1px solid rgba(177,201,235,0.25)",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(4,6,20,0.88)", backdropFilter: "blur(8px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reg-modal-title"
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) handleClose();
          }}
        >
          <motion.form
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{
              background:
                "linear-gradient(160deg, rgba(10,1,71,0.96) 0%, rgba(20,88,134,0.35) 100%)",
              border: "1px solid rgba(255,189,89,0.35)",
            }}
          >
            <h2
              id="reg-modal-title"
              className="text-xl font-black mb-1"
              style={{
                background: "linear-gradient(135deg, #FFD966, #FFBD59)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Enter the Challenge
            </h2>
            <p className="text-[#B1C9EB]/65 text-xs mb-6">
              One attempt per person and per device.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#B1C9EB]/55 mb-1.5">
                  First name
                </label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  disabled={submitting}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#B1C9EB]/55 mb-1.5">
                  Last name
                </label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  disabled={submitting}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#B1C9EB]/55 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className={inputCls}
                  style={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={submitting}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#B1C9EB]/55 mb-2">
                  ICAI chapter member?
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setHasChapter(true)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{
                      background: hasChapter ? "rgba(255,189,89,0.25)" : "rgba(20,88,134,0.2)",
                      border: hasChapter
                        ? "1px solid rgba(255,189,89,0.55)"
                        : "1px solid rgba(177,201,235,0.2)",
                      color: hasChapter ? "#FFBD59" : "#B1C9EB",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setHasChapter(false);
                      setChapterName("");
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{
                      background: !hasChapter ? "rgba(255,189,89,0.25)" : "rgba(20,88,134,0.2)",
                      border: !hasChapter
                        ? "1px solid rgba(255,189,89,0.55)"
                        : "1px solid rgba(177,201,235,0.2)",
                      color: !hasChapter ? "#FFBD59" : "#B1C9EB",
                    }}
                  >
                    No
                  </button>
                </div>
                {hasChapter && (
                  <input
                    className={`${inputCls} mt-3`}
                    style={inputStyle}
                    placeholder="Chapter name"
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    disabled={submitting}
                  />
                )}
                {errors.chapterName && (
                  <p className="text-red-400 text-xs mt-1">{errors.chapterName}</p>
                )}
              </div>
            </div>

            {errors.form && (
              <p className="text-amber-300 text-sm mt-4 text-center">{errors.form}</p>
            )}

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-[#B1C9EB]"
                style={{
                  background: "rgba(177,201,235,0.08)",
                  border: "1px solid rgba(177,201,235,0.25)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl font-black text-sm"
                style={{
                  background: "linear-gradient(155deg, #FFCF70 0%, #FFBD59 45%, #D4940F 100%)",
                  color: "#0A0147",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "…" : "Start quiz"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
