import {
  EndEvent,
  HoldEvent,
  IceCandidateEvent,
  PeerConnectionEvent,
  ReferEvent,
  RTCPeerConnectionDeprecated,
  RTCSession,
} from "jssip/lib/RTCSession";
import { SipConstants, SipAudioElements, randomId } from "./index";
import { DTMF_TRANSPORT } from "jssip/lib/Constants";
import { IncomingResponse } from "jssip/lib/SIPMessage";
import * as events from "events";
import { C, Grammar } from "jssip";

export default class SipSession extends events.EventEmitter {
  #id;
  #rtcOptions;
  #audio;
  #rtcSession;
  #active;

  constructor(rtcSession, rtcConfig, audio) {
    super();
    this.setMaxListeners(Infinity);
    this.#id = randomId("");
    this.#rtcOptions = {
      mediaConstraints: { audio: true, video: false },
      pcConfig: rtcConfig,
    };
    this.#rtcSession = rtcSession;
    this.#audio = audio;
    this.#active = false;
    this.addListeners();
  }

  addListeners() {
    if (this.#rtcSession.connection) {
      this.addPeerConnectionListener(this.#rtcSession.connection);
    } else {
      this.#rtcSession.on("peerconnection", (data) => {
        let pc = data.peerconnection;
        this.addPeerConnectionListener(pc);
      });
    }

    this.#rtcSession.on("progress", () => {
      this.emit(SipConstants.SESSION_RINGING, {
        status: SipConstants.SESSION_RINGING,
      });
      if (this.#audio.isRemoteAudioPaused() && !this.replaces) {
        this.#audio.playRinging(undefined);
      } else {
        this.#audio.playRingback(undefined);
      }
    });

    this.#rtcSession.on("accepted", ({ response }) => {
      this.emit(SipConstants.SESSION_ANSWERED, {
        status: SipConstants.SESSION_ANSWERED,
        callSid: response?.hasHeader("X-Call-Sid")
          ? response.getHeader("X-Call-Sid")
          : null,
      });
      this.#audio.playAnswer(undefined);
    });

    this.#rtcSession.on("failed", (data) => {
      let { originator, cause, message } = data;
      let description;

      if (
        message &&
        originator === "remote" &&
        message instanceof IncomingResponse &&
        message.status_code
      ) {
        description = `${message.status_code}`.trim();
      }

      if (originator === "local" && cause === C.causes.CANCELED) {
        description = "Cancelled by user";
      }

      if (originator === "local" && cause === C.causes.REJECTED) {
        description = "Rejected by user";
      }

      this.emit(SipConstants.SESSION_FAILED, {
        cause,
        status: SipConstants.SESSION_FAILED,
        originator,
        description,
      });

      if (originator === "remote") {
        this.#audio.playFailed(undefined);
      } else {
        this.#audio.pauseRinging();
        this.#audio.pauseRingback();
      }
    });

    this.#rtcSession.on("ended", (data) => {
      const { originator, cause, message } = data;
      let description;

      if (originator === "remote") {
        this.#audio.playRemotePartyHungup(undefined);
      } else {
        this.#audio.playLocalHungup(undefined);
      }

      if (message && originator === "remote" && message.hasHeader("Reason")) {
        const reason = Grammar.parse(message.getHeader("Reason"), "Reason");
        if (reason) {
          description = `${reason.cause}`.trim();
        }
      }

      this.emit(SipConstants.SESSION_ENDED, {
        cause,
        status: SipConstants.SESSION_ENDED,
        originator,
        description,
      });
    });

    this.#rtcSession.on("muted", () => {
      this.emit(SipConstants.SESSION_MUTED, { status: "muted" });
    });

    this.#rtcSession.on("unmuted", () => {
      this.emit(SipConstants.SESSION_MUTED, { status: "unmuted" });
    });

    this.#rtcSession.on("hold", (data) => {
      this.emit(SipConstants.SESSION_HOLD, {
        status: "hold",
        originator: data.originator,
      });
    });

    this.#rtcSession.on("unhold", (data) => {
      this.emit(SipConstants.SESSION_HOLD, {
        status: "unhold",
        originator: data.originator,
      });
    });

    this.#rtcSession.on("refer", (data) => {
      let { accept } = data;
      accept((rtcSession) => {
        rtcSession.data.replaces = true;
        this.emit(SipConstants.SESSION_REFER, {
          session: rtcSession,
          type: "refer",
        });
      }, this.#rtcOptions);
    });

    this.#rtcSession.on("replaces", (data) => {
      data.accept((rtcSession) => {
        rtcSession.data.replaces = true;
        if (!rtcSession.isEstablished()) {
          rtcSession.answer(this.#rtcOptions);
          this.emit(SipConstants.SESSION_REPLACES, {
            session: rtcSession,
            type: "replaces",
          });
        }
      });
    });

    this.#rtcSession.on("icecandidate", (evt) => {
      let type = evt.candidate.candidate.split(" ");
      let candidate = type[7];
      if (["srflx", "relay"].indexOf(candidate) > -1) {
        evt.ready();
        this.emit(SipConstants.SESSION_ICE_READY, {
          candidate,
          status: "ready",
        });
      }
    });
  }

  addPeerConnectionListener(pc) {
    pc.addEventListener("addstream", (event) => {
      if (this.#rtcSession.direction === "outgoing") {
        this.#audio.pauseRinging();
      }
      this.#audio.playRemote(event.stream);
      this.emit(SipConstants.SESSION_ADD_STREAM, {
        direction: this.#rtcSession.direction,
      });
    });
  }

  get rtcSession() {
    return this.#rtcSession;
  }

  get direction() {
    return this.#rtcSession.direction;
  }

  get id() {
    return this.#id;
  }

  get user() {
    return this.#rtcSession.remote_identity.uri.user;
  }

  get active() {
    return this.#active;
  }

  get answerTime() {
    return this.#rtcSession.start_time;
  }

  get duration() {
    if (!this.answerTime) return 0;
    let now = new Date().getUTCMilliseconds();
    return Math.floor((now - this.answerTime.getUTCMilliseconds()) / 1000);
  }

  get replaces() {
    return Boolean(this.#rtcSession.data.replaces);
  }

  setActive(flag) {
    let wasActive = this.#active;
    this.#active = flag;

    if (this.#rtcSession.isEstablished()) {
      if (this.replaces) return;
      if (this.#active) this.unhold();
      else this.hold();
    }

    if (this.#active && !wasActive) {
      this.emit(SipConstants.SESSION_ACTIVE);
    }
  }

  answer() {
    this.#rtcSession.answer(this.#rtcOptions);
  }

  terminate(sipCode, sipReason) {
    this.#rtcSession.terminate({
      status_code: sipCode,
      reason_phrase: sipReason,
    });
  }

  isMuted() {
    return this.#rtcSession.isMuted().audio?.valueOf() || false;
  }

  mute() {
    this.#rtcSession.mute({ audio: true, video: true });
  }

  unmute() {
    this.#rtcSession.unmute({ audio: true, video: true });
  }

  isHolded() {
    return this.#rtcSession.isOnHold().local.valueOf() || false;
  }

  hold() {
    this.#rtcSession.hold();
  }

  unhold() {
    this.#rtcSession.unhold();
  }

  sendDtmf(tone) {
    this.#rtcSession.sendDTMF(tone, { transportType: DTMF_TRANSPORT.RFC2833 });
  }
}
