import React from "react";
import { HuddleIframe, iframeApi, useEventListener } from "@huddle01/iframe";

interface PostLottusRoomProps {
  roomUrl: string;
}

const PostLottusRoom: React.FC<PostLottusRoomProps> = ({ roomUrl }) => {
  useEventListener("app:initialized", () => {
    iframeApi.initialize({
      redirectUrlOnLeave: "https://your-dapp-url.com",
      wallets: ["metamask"],
    });
  });

  return (
    <div className="h-[600px] w-full card rounded-box place-items-center overflow-hidden">
      <HuddleIframe roomUrl={roomUrl} className="w-[1000px] h-[800px] aspect-video" />
    </div>
  );
};

export default PostLottusRoom;
