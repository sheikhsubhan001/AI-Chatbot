// ChatWindow.tsx
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../avatar";
import { Button } from "../button";
import { Input } from "../input";
import { FaRegUser } from "react-icons/fa";
import { RiGeminiLine } from "react-icons/ri";

const API_KEY = "AIzaSyCtQC9-isXysc2rC0ijhguaNNerk40KdkQ";

function ChatWindow() {
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm Gemini AI. How can I help you today?" }
    ]);

    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === "") return;

        // Add user message
        setMessages(prev => [...prev, { role: "user", text: input }]);
        const userMessage = input;
        setInput("");

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userMessage }] }]
                    })
                }
            );

            const data = await res.json();

            let aiText =
                data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't process that.";

            // Add AI message
            setMessages(prev => [...prev, { role: "ai", text: aiText }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [
                ...prev,
                { role: "ai", text: "Error connecting to AI." }
            ]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex flex-col w-full max-w-md h-[80vh] border border-gray-300 rounded-lg bg-white shadow-md">
            <main className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) =>
                    msg.role === "ai" ? (
                        <MessageLeft key={index} text={msg.text} />
                    ) : (
                        <MessageRight key={index} text={msg.text} />
                    )
                )}
                <div ref={chatEndRef} />
            </main>
            <footer className="flex items-center gap-2 p-3 border-t border-gray-200 bg-gray-50">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1"
                />
                <Button onClick={handleSend} size="sm">Send</Button>
            </footer>
        </div>
    );
}

const MessageLeft = ({ text }) => (
    <div className="flex items-start space-x-2">
        <Avatar>
            <AvatarFallback>
                <RiGeminiLine />
            </AvatarFallback>
        </Avatar>
        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%]">
            <p className="text-sm">{text}</p>
        </div>
    </div>
);

const MessageRight = ({ text }) => (
    <div className="flex items-start justify-end space-x-2">
        <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
            <p className="text-sm">{text}</p>
        </div>
        <Avatar>
            <AvatarFallback>
                <FaRegUser />
            </AvatarFallback>
        </Avatar>
    </div>
);

export default function ChatPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {isOpen && (
                <div className="fixed bottom-16 right-4 left-4 sm:left-auto sm:right-4 z-50">
                    <ChatWindow />
                </div>
            )}
            <Button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed right-4 bottom-4 sm:right-4"
            >
                Chat with AI
            </Button>
        </div>
    );
}
