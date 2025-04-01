"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { TypingAnimation } from "@/components/ui/typing-animation";

type Message = {
  text: string;
  isBot: boolean;
};

const FormSchema = z.object({
  message: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
});

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedSessionId = sessionStorage.getItem("session_id");
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem("session_id", storedSessionId);
    }
    setSessionId(storedSessionId);

    const savedMessages = sessionStorage.getItem("chat_history");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing chat history:", error);
        sessionStorage.removeItem("chat_history");
      }
    } else {
      // Add a welcome message if no chat history exists
      const welcomeMessage: Message = {
        text: "🎵 Hi there! I'm Music Buddy. Ask me about your favorite songs, genres, or artists! 🎶",
        isBot: true,
      };
      setMessages([welcomeMessage]);
      sessionStorage.setItem("chat_history", JSON.stringify([welcomeMessage]));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chat_history", JSON.stringify(messages));
    }
    // if (chatContainerRef.current) {
    //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    // }
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  // bottom auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      const lastmessage = messages[messages.length - 1];

      if (!lastmessage.isBot) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!data.message.trim() || !sessionId) return;

    const newMessages = [...messages, { text: data.message, isBot: false }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const response = await axios.post(SERVER_URL, {
        message: data.message,
        session_id: sessionId, // Sending session ID along with user input
      });

      setMessages([
        ...newMessages,
        { text: response.data.response, isBot: true },
      ]);
    } catch (error: any) {
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );
      setMessages([
        ...newMessages,
        {
          text: "Sorry, I'm having trouble connecting. Please try again later!",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <main
          className="flex-grow max-sm:pb-7 shadow-neutral-300 dark:shadow-neutral-600 bg-neutral-100 dark:bg-neutral-800 shadow-2xl m-[6vw] border border-solid rounded-2xl p-3 h-full"
          style={{ width: "clamp(300px,90vw,1200px)" }}
        >
          <div
            ref={chatContainerRef}
            className="space-y-4 mb-4 overflow-y-auto"
          >
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-xl ${
                      message.isBot
                        ? `${"  "}`
                        : `${"dark:bg-neutral-700/70 bg-neutral-300 shadow-md"} rounded-tr-none`
                    } ${"dark:text-white  text-gray-800"} `}
                  >
                    <span className="text-sm md:text-base font-mono">
                      {message.isBot ? (
                        messages.length - 1 === index ? (
                          <TypingAnimation
                            duration={20}
                            className="text-sm md:text-base font-bold"
                          >
                            {message.text}
                          </TypingAnimation>
                        ) : (
                          message.text
                        )
                      ) : (
                        message.text
                      )}
                    </span>
                  </div>
                </div>
                {message.isBot && (
                  <hr
                    className=" mx-auto border border-neutral-800/10 dark:border-neutral-50/10"
                    style={{ width: "clamp(200px,70vw,900px)" }}
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl dark:bg-green-600/20 bg-green-100 animate-pulse flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-mono">Music Buddy is Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </main>
        <div ref={bottomRef}></div>

        {/* form */}
        <div className="fixed flex items-center justify-center  left-0 bottom-0 right-0 h-[10vh] p-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit as any)}
              className="flex items-center justify-center"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative ">
                        <Input
                          {...field}
                          placeholder="Ask about any  music..."
                          className="relative bg-neutal-50 dark:bg-neutral-600 h-12 max-sm:text-sm mr-2
                        border border-solid rounded-xl p-3
                        shadow-lg
                      "
                          style={{ width: "clamp(200px,60vw,800px)" }}
                        />
                        <button
                          type="submit"
                          className="absolute right-5 top-1/2 transform -translate-y-1/2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor "
                            className=" w-11 h-11 dark:hover:text-neutral-200/70 text-neutral-300 hover:text-neutral-800 dark:text-white"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
