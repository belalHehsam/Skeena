import { useEffect, useState } from "react";

export function useSpeakingDetection(stream: MediaStream | null) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setIsSpeaking(false);
      return;
    }

    // AudioContext can only start after user interaction, which is fine as this is ran inside the voice room
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let intervalId: any = null;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioCtx();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      intervalId = setInterval(() => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);

        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i];
        }
        const average = total / bufferLength;

        const isTrackEnabled = stream.getAudioTracks().some((t) => t.enabled);
        setIsSpeaking(average > 15 && isTrackEnabled);
      }, 100);
    } catch (err) {
      console.error("Error in useSpeakingDetection AudioContext:", err);
      setIsSpeaking(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (source) source.disconnect();
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch((e) => console.error("Error closing AudioContext:", e));
      }
    };
  }, [stream]);

  return isSpeaking;
}
