import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { IoCloseCircleSharp } from "react-icons/io5"
import { LuBot } from "react-icons/lu"
import { RiSendPlane2Fill } from "react-icons/ri"
import { IMessage } from "../types"
import { chatbotService } from "../service/chatbotservice"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

// const Conversation: IMessage[] = [
//     { role: "user", content: "What laptop do you recommend for a casual user?" },
//     { role: "assistant", content: "The Librarian 1 is a simple laptop for casual users." },
//     { role: "user", content: "What are the specificiations?" },
//     { role: "assistant", content: "The Librarian 1 has an 14 inch HD screen, 8GB RAM, 256GB SSD, and 10th Gen Intel Core i5 processor." },
//     { role: "user", content: "How much does it cost?" },
//     { role: "assistant", content: "The Librarian 1 costs $999.99." },
//     { role: "user", content: "Add it to my cart." },
// ]

const FloatingBot = () => {
    const [status, setStatus] = useState(false)
    const [input, setInput] = useState<string>("")
    const [messages, setMessages] = useState<IMessage[]>([
        { role: "system", content: "You are a helpful assistant." }
    ])
    const [processing, setProcessing] = useState<boolean>(false)

    const onReset = () => {
        setMessages([])
    }

    const Process = async () => {
        if (processing)
            return
        if (input === "") {
            alert("Please enter a message")
            return
        }
        setProcessing(true)
        const newMessages = [...messages, { role: "user", content: input }]
        setMessages(newMessages)
        const resp = await chatbotService(newMessages);
        const assistantMessage = resp.choices[0].message.content
        setMessages([...newMessages, { role: "assistant", content: assistantMessage }])
        setInput("")
        setProcessing(false)
    }

    return (
        <>
            {!status && <button className="fixed bottom-4 right-4 bg-slate-900 rounded-lg opacity-60 text-white text-5xl text-center" onClick={() => setStatus(!status)}>
                <LuBot />
            </button>}
            {status && <div className="fixed bottom-10 right-4 bg-slate-900 h-[calc(100vh-10%)] w-[400px] flex flex-col text-white opacity-90 rounded">
                <div className="flex p-1">
                    <div className="flex-grow"></div>
                    <button className="text-xl" onClick={() => setStatus(!status)}><IoCloseCircleSharp /></button>
                </div>
                <div className="h-[100%] bg-slate-950 overflow-auto p-2 flex flex-col text-black space-y-2">
                    {messages.map((message, index) => (<>
                        {(message.role != 'system') && <div key={index} className={"px-2 rounded-lg w-[90%] " + (message.role === 'user' ? 'ml-auto bg-blue-800 text-white' : 'bg-slate-800 text-white')}>

                            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                        </div>}
                    </>))}
                </div>
                <div className="flex items-center m-1">
                    <textarea className="flex-grow outline-none resize-none text-black p-1" rows={5}
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <div className="flex flex-col text-lg">
                        <button className="bg-blue-600 p-2 text-white opacity-70"
                            onClick={Process}
                        ><RiSendPlane2Fill /></button>
                        <button className="bg-red-600 p-2 text-white opacity-70"
                            onClick={onReset}
                        ><FaTrash /></button>
                        <button className="bg-slate-900 p-2 text-white opacity-70"
                            onClick={() => setStatus(!status)}
                        ><IoCloseCircleSharp /></button>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default FloatingBot