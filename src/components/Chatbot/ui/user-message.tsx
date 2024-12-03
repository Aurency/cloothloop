import { HiOutlineUser } from "react-icons/hi";
import { Message } from '../chatbot';


export default function UserMessage({role, content}: Message){
    return(
        <div className='flex my-2 w-full '>
            <div className='flex justify-center items-center p-1 w-8 h-8 border-black rounded-full mr-2 text-gray-600'>
                <HiOutlineUser
                size={20}
                />
            </div>

            <div className='text-xs'>
                <div>{role}</div>
                <p>{content}</p>
            </div>
        </div>

    )
}