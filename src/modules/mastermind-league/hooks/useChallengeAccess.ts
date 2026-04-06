// Challenge availability: 2026 quarterly windows (+ optional single-play via ENFORCE_SINGLE_PLAY in registrationService)

import { useState, useEffect } from "react";
import {
  getChallengeQuarter,
  getChallengeClosedReason,
  formatChallengeQuarterLabel,
  getMsUntilChallengeStart,
  CHALLENGE_YEAR,
} from "../utils/challengeSchedule";
import {
  ENFORCE_CHALLENGE_DATES,
  ENFORCE_SINGLE_PLAY,
  hasDeviceAttemptLock,
} from "../services/registrationService";

const defaultState = () => ({
  canEnter: false,
  challengeActive: false,
  deviceLocked: false,
  currentQuarter: null as ReturnType<typeof getChallengeQuarter>,
  closedReason: null as ReturnType<typeof getChallengeClosedReason>,
  statusMessage: null as string | null,
  msUntilStart: 0,
});

export function useChallengeAccess(): {
  canEnter: boolean;
  challengeActive: boolean;
  deviceLocked: boolean;
  currentQuarter: ReturnType<typeof getChallengeQuarter>;
  closedReason: ReturnType<typeof getChallengeClosedReason>;
  statusMessage: string | null;
  msUntilStart: number;
  quarterLabel: string | null;
} {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const tick = () => {
      const now = new Date();
      const calendarQuarter = getChallengeQuarter(now);
      let q = calendarQuarter;
      let active: boolean;

      if (ENFORCE_CHALLENGE_DATES) {
        active = calendarQuarter !== null;
      } else {
        active = true;
        q = calendarQuarter ?? 2;
      }

      const locked = ENFORCE_SINGLE_PLAY && hasDeviceAttemptLock();
      const closed = getChallengeClosedReason(now);
      const msUntilStart = getMsUntilChallengeStart(now);

      let statusMessage: string | null = null;
      if (ENFORCE_SINGLE_PLAY && locked) {
        statusMessage = "You have already attempted the challenge.";
      } else if (ENFORCE_CHALLENGE_DATES && !active && closed === "before_start") {
        statusMessage = `Challenge opens April 16, ${CHALLENGE_YEAR}.`;
      } else if (ENFORCE_CHALLENGE_DATES && !active && closed === "after_season") {
        statusMessage = `The ${CHALLENGE_YEAR} challenge season has ended.`;
      } else if (active && q != null) {
        statusMessage = calendarQuarter !== null
          ? `Now playing: ${formatChallengeQuarterLabel(q)}`
          : `Practice mode: ${formatChallengeQuarterLabel(q)}`;
      }

      setState({
        canEnter: active && !locked,
        challengeActive: active,
        deviceLocked: locked,
        currentQuarter: q,
        closedReason: ENFORCE_CHALLENGE_DATES ? closed : null,
        statusMessage,
        msUntilStart: ENFORCE_CHALLENGE_DATES ? msUntilStart : 0,
      });
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return {
    ...state,
    quarterLabel:
      state.currentQuarter != null
        ? formatChallengeQuarterLabel(state.currentQuarter)
        : null,
  };
}
