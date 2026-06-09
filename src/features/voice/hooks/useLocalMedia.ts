import { useState, useRef, useCallback } from "react";

export function useLocalMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A ref always pointing to the current stream so callbacks don't hold stale closures.
  const streamRef = useRef<MediaStream | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = s;
      setStream(s);
      setError(null);
      return s;
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Microphone access denied");
      return null;
    }
  }, []); // stable – never re-created

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !next; });
      return next;
    });
  }, []);

  const toggleDeafen = useCallback(() => {
    setIsDeafened((prev) => {
      const next = !prev;
      if (next) {
        setIsMuted(true);
        streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = false; });
      } else {
        setIsMuted(false);
        streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = true; });
      }
      return next;
    });
  }, []);

  /**
   * Fully stops media and clears React state (triggers re-render).
   * Use for intentional "leave room" actions.
   */
  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
    setIsMuted(false);
    setIsDeafened(false);
  }, []);

  /**
   * Stops mic tracks WITHOUT updating React state (no re-render).
   * Safe to call in useEffect cleanup during React Strict Mode double-invoke,
   * because it won't unmount child components that depend on `stream` being non-null.
   * The next `startMedia()` call will overwrite the ref with a fresh stream.
   */
  const stopTracksSilently = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    // Intentionally do NOT call setStream(null) here.
  }, []);

  return {
    stream,
    isMuted,
    isDeafened,
    error,
    startMedia,
    toggleMute,
    toggleDeafen,
    stopMedia,
    stopTracksSilently,
  };
}
