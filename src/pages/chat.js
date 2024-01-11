import axios from "axios";
import { useEffect, useRef, useState } from "react"
import TypingAnimation from "../components/typingAnimation";


export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessageRef = useRef(null)

    useEffect(() => {
        // This code will run every time `chatLog` changes.
        console.log('chatLog updated:', chatLog);
        endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" })
        localStorage.setItem('chatLog', JSON.stringify(chatLog));
    }, [chatLog]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }]);
        sendMessage(inputValue)
        setInputValue('');
    }

    const sendMessage = (message) => {
        const url = "https://api.openai.com/v1/chat/completions";
        const header = {
            "Content-type": "application/json",
            "Authorization": "Bearer sk-IIc4tCiQxD5zslx63QBET3BlbkFJPxomcruQ3HVq3hiM64zarijx"
        };

        const data = {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", content: message }]
        };

        setIsLoading(true);

        axios.post(url, data, { headers: header }).then((response) => {
            console.log('response', response)
            setChatLog((prevChatLog) => [...prevChatLog, { type: "bot", message: response.data.choices[0].message.content }]);
            console.log('chatlog', chatLog)
            localStorage.setItem('chatLog', JSON.stringify(chatLog))
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false)
            console.log(`Error sending the message${error}`);
        })

    }
    return (
        <div className="w-full">
            <div className="flex flex-col min-h-screen bg-gray-900">
                <h1 className="sticky top-0 bg-gradient-to-r from-blue-800 to-pink-700 rounded-br-2xl rounded-bl-2xl bg-gray-100 text-center py-3 font-bold text-4xl">My Personal Assistant</h1>
                <div className="flex-grow p-6 px-10">
                    <div className="flex-grow space-y-4">
                        {
                            chatLog.map((message, index) => (
                                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${message.type === 'user' ? 'bg-pink-700' : 'bg-blue-950'} rounded-lg p-4 text-white max-w-sm`}>
                                        {message.message}
                                    </div>
                                </div>
                            ))
                        }
                        {
                            isLoading &&
                            <div key={chatLog.length} className="flex justify-start">
                                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                                    <TypingAnimation />
                                </div>
                            </div>
                        }
                        <div ref={endOfMessageRef}></div>
                    </div>

                </div>
                <form onSubmit={handleSubmit} className="flex-none p-6 px-10">
                    <div className="flex rounded-lg border border-gray-700 bg-gray-800">
                        <input type="text" className="flex-grow px-4 py-6 bg-transparent text-white focus:outline-none" placeholder="Type your query here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <button type="submit" className="bg-pink-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}