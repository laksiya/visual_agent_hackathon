import React, { useEffect, useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoBox from "@/app/Components/VideoBox";
import { Spinner } from "./utils/spinner";
import Image from "next/image";

interface SimliAgentProps {
  onStart: () => void;
  onClose: () => void;
}

// Get your Simli API key from https://app.simli.com/
const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY;

const SimliAgent: React.FC<SimliAgentProps> = ({ onStart, onClose }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const [tempRoomUrl, setTempRoomUrl] = useState<string>("");
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const myCallObjRef = useRef<DailyCall | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const [muteAvatar, setMuteAvatar] = useState<boolean>(true);
  /**
   * Create a new Simli room and join it using Daily
   */


  const handleJoinRoom = async () => {
    // Set loading state
    setIsLoading(true);

    // 1- Create a new simli avatar at https://app.simli.com/
    // 2- Cutomize your agent and copy the code output
    // 3- PASTE YOUR CODE OUTPUT FROM SIMLI BELOW 👇
    /**********************************/

    const response = await fetch("https://api.simli.ai/startE2ESession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: SIMLI_API_KEY,
        faceId: "b5339445-51cf-4e2d-ac8b-23bfcc9b700d",
        voiceId: "f114a467-c40a-4db8-964d-aaba89cd08fa",
        firstMessage: "Hi, Im your personal tax dude! Whats on your mind?",
        systemPrompt: "Ong is an empathetic and attentive virtual companion designed to provide emotional support and friendly interactions. Ong’s tone is warm, caring, and conversational, fostering a sense of connection and understanding. Ong’s tasks include engaging users in meaningful conversations, offering a listening ear, and promoting emotional well-being through compassionate interactions.",
      }),
    })

    const data = await response.json();
    const roomUrl = data.roomUrl;

    /**********************************/

    // Print the API response
    console.log("API Response", data);

    // Create a new Daily call object
    let newCallObject = DailyIframe.getCallInstance();
    if (newCallObject === undefined) {
      newCallObject = DailyIframe.createCallObject({
        videoSource: false,
      });
    }

    // Setting my default username
    newCallObject.setUserName("User");

    console.log("roomUrl", roomUrl);

    // Join the Daily room
    await newCallObject.join({ url: roomUrl });
    myCallObjRef.current = newCallObject;
    console.log("Joined the room with callObject", newCallObject);
    setCallObject(newCallObject);

    // Start checking if Simli's Chatbot Avatar is available
    loadChatbot();
  };

  useEffect(() => {
    handleJoinRoom()
  }, [])

  /**
   * Checking if Simli's Chatbot avatar is available then render it
   */
  const loadChatbot = async () => {
    if (myCallObjRef.current) {
      let chatbotFound: boolean = false;

      const participants = myCallObjRef.current.participants();
      for (const [key, participant] of Object.entries(participants)) {
        if (participant.user_name === "Chatbot") {
          setChatbotId(participant.session_id);
          chatbotFound = true;
          setIsLoading(false);
          setIsAvatarVisible(true);
          onStart();
          break; // Stop iteration if you found the Chatbot
        }
      }
      if (!chatbotFound) {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  };

  useEffect(() => {
    if (callObject) {
      callObject.setLocalAudio(muteAvatar);
    } else {
      console.log("CallObject is null");
    }
  }, [muteAvatar])


  return (
    <>
      <div className="relative h-full">
        {isAvatarVisible ? (
          <>
            <div className={`absolute bg-white top-1 text-gray-50 right-2 z-10 p-1 rounded-lg hover:color-white`}>
              <Image className="cursor-pointer opacity-100 hover:opacity-20" onClick={() => setMuteAvatar(prev => !prev)} src={!muteAvatar ? `/microphone-muted.svg` : `/microphone.svg`} alt="Mute" width={20} height={20} />
            </div>
            <DailyProvider callObject={callObject}>
              {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
            </DailyProvider>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full -mt-20">
            {!isAvatarVisible && (
              isLoading && (
                <Spinner />
              )
            )}

          </div>
        )}
      </div>
    </>
  );
};

export default SimliAgent;
