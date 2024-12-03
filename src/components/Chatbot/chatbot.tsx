"use client";
import {TbMessageChatbot} from "react-icons/tb";
import { FormEvent, useState } from "react";
import { HiChat } from "react-icons/hi";
import BotMessage from "./ui/bot-message";
import UserMessage from "./ui/user-message";
import ChatInput from "./ui/chat-input";
import { chatCompletion } from "../../../actions";

export type Message = {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

export default function Chatbot(){
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {role: 'assistant', content: 'Halo, ada yang bisa saya bantu?'},
  ]);

  const handleSendMessage = async(e: FormEvent) => {
    e.preventDefault();
    console.log('USER MESSAGE', userMessage);
    if(!userMessage) return;

    // Create new message object
    const newMessage: Message = {role: 'user', content: userMessage};
    console.log("NEW MESSAGE", newMessage);

    // Update the message state
    setMessages((prevMessage) =>[...prevMessage, newMessage]);
    setLoading(true);

    // Request to OPENAI
    try {
      // Copy of messages
      const chatMessages = messages.slice(1);
      console.log('CHAT MESSAGES', chatMessages);

      // Call the chat completion API
      const res = await chatCompletion([...chatMessages, newMessage]);
      console.log('RESPONSE', res);

      // Handle response
      if (res.content){
        setUserMessage('');
        const assistantMessage: Message = {
          content: res.content,
          role: 'assistant',
        }
        setMessages(prevMessages => [...prevMessages, assistantMessage])
      }
    } catch (error) {
      console.log('API error', error);
    } finally {
      setLoading(false);
    }
  }

    return(
        <>
            <TbMessageChatbot
            onClick={()=> setShowChat(!showChat)}
            size={45}
            className="fixed bottom-10 right-12 text-[#0A4635] rounded-full bg-[#FFEA7F] hover:bg-[#fcde49] hover:cursor-pointer hover:rounded-full p-2"
            />
    

            {showChat && (
                <div className="fixed mb-3 right-12 bottom-[calc(4rem+1.5rem)] hover:cursor-pointer p-5 shadow-md shadow-gray h-[474px] w-[500px] bg-[#F2E8D8] rounded-lg">
                    <div className="flex flex-col h-full">

                        {/*CHAT HEADER */}
                        <div>
                            <h2 className="font-semibold text-lg text-[#0A4635] tracking-tight">Chatbot</h2>
                        </div>

                        {/* Chat COntainer */}
                        <div className="flex flex-col flex-1 items-center p-2 overflow-y-auto">
                            {messages && messages.map((m, i) =>{
                                return m.role == 'assistant' ? (
                                    <BotMessage {...m} key={i} />
                                ): (
                                    <UserMessage {...m} key={i} />
                                )
                            })}
                        </div>

                        {/* Message input */}
                        <ChatInput
                        userMessage={userMessage}
                        setUserMessage={setUserMessage}
                        handleSendMessage={handleSendMessage}
                        />
                      

                        
                    </div>
                </div>
                ) 
                }
        </>
    );
}