import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";

const Room = () => {
  const { room_id } = useParams();
  const [isMuteAudio, setIsMuteAudio] = useState(false);

  const options = {
    appId: "6140d6ad1ad44ac2b7d3b84335f524fc",
    channel: room_id,
    token: null,
    uid: 0,
  };

  const channelParametersRef = useRef({
    localAudioTrack: null,
    remoteAudioTrack: null,
    remoteUid: null,
  });

  AgoraRTC.setLogLevel(2);

  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });

  useEffect(() => {
    if (channelParametersRef.current.localAudioTrack) {
      channelParametersRef.current.localAudioTrack.setEnabled(!isMuteAudio);
    }
  }, [isMuteAudio]);

  const handleJoin = async () => {
    await agoraEngine.join(
      options.appId,
      options.channel,
      options.token,
      options.uid
    );
    channelParametersRef.current.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();

    await agoraEngine.publish(channelParametersRef.current.localAudioTrack);
    console.log("Handle khi tham gia");
    console.log(channelParametersRef.current);
  };

  useEffect(() => {
    if (room_id) {
      handleJoin();
    }

    return () => {
      handleLeave();
    };
  }, [room_id]);

  useEffect(() => {
    const handleUserPublished = async (user, mediaType) => {
      await agoraEngine.subscribe(user, mediaType);
      console.log("handle khi có người tham gia", user);

      if (mediaType === "audio") {
        channelParametersRef.current.remoteUid = user.uid;
        channelParametersRef.current.remoteAudioTrack = user.audioTrack;
        channelParametersRef.current.remoteAudioTrack.play();
      }
    };

    const handleUserUnpublished = (user) => {
      console.log("handle khi có người rời đi", user);
    };

    agoraEngine.on("user-published", handleUserPublished);
    agoraEngine.on("user-unpublished", handleUserUnpublished);

    return () => {
      agoraEngine.off("user-published", handleUserPublished);
      agoraEngine.off("user-unpublished", handleUserUnpublished);
    };
  }, [agoraEngine]);

  const handleLeave = async () => {
    if (channelParametersRef.current.localAudioTrack) {
      channelParametersRef.current.localAudioTrack.close();
    }
    await agoraEngine.leave();
    console.log("You left the channel");
  };

  const handleToggleMute = () => {
    setIsMuteAudio((prev) => !prev);
  };

  return (
    <div>
      <center>
        <h2 className="left-align">Get started with Voice Calling</h2>
        <div className="row">
          <div>
            <button onClick={handleToggleMute}>
              {isMuteAudio ? "Unmute Audio" : "Mute Audio"}
            </button>
          </div>
          <div>
            <button onClick={handleLeave}>Leave</button>
          </div>
        </div>
      </center>
    </div>
  );
};

export default Room;
