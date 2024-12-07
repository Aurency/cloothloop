import { FormEvent } from "react";
import { HiPaperAirplane } from "react-icons/hi";

type ChatProps = {
    userMessage: string;
    setUserMessage: (value: string) => void;
    handleSendMessage: (e: FormEvent) => void;
}

export default function ChatInput({userMessage, setUserMessage, handleSendMessage}:ChatProps) {
    return(
        <div className="flex space-x-2 items-center mt-auto">
            <form 
            onSubmit={handleSendMessage}
            className="flex items-center justify-center w-full space-x-2">
                <input 
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Masukkan pertanyaan anda"
                className="flex p-2 h-10 w-full rounded-full border-[2px] border-[#15392e]/60 px-3 text-sm text-gray-600"
                />
                <button>
                    <HiPaperAirplane
                    className="text-[#0A4635]"
                    size={20}
                    />
                </button>
            </form>
        </div>
    )
}