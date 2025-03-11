"use client";
import { postChat, setCurrentChatId, setInputMessage } from "@/features/chatSlice";
import { AppDispatch } from "@/features/store";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Type, AlignLeft, Tags } from "lucide-react";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";


const prompts = [
  {
    icon: <FileText strokeWidth={1.0} className="size-5" />,
    text: "Generate Youtube script",
  },
  {
    icon: <Type strokeWidth={1.0} className="size-5" />,
    text: "Titles suggestion",
  },
  {
    icon: <AlignLeft strokeWidth={1.0} className="size-5" />,
    text: "Generate a video description",
  },
  {
    icon: <Tags strokeWidth={1.0} className="size-5" />,
    text: "Get video Tags",
  },
]

export default function App() {

  // const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useCurrentUser()

  const handleGenerateScript = async (videoTitle: string) => {
    const prompt = `${videoTitle} for the topic:`

    try {
      const res = await dispatch(postChat({ userId: user?.id! })).unwrap();

      if (res?.id) {
        dispatch(setCurrentChatId(res.id));
        dispatch(setInputMessage(prompt));
        setTimeout(() => {
          redirect(`/y/${res.id}`);
        }, 200)
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full space-y-8 text-gray-50 px-32">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-semibold">
          Hi there !
        </h1>
        <h2 className="text-xl text-gray-500">
          What can i help you with ?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
        <AnimatePresence>
          {prompts.map((prompt, index) => (
            <motion.button key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerateScript(prompt.text)}
              transition={{ duration: 0.4, delay: index * 0.05, type: "spring", bounce: 0.25 }}
              className="flex items-center gap-3 p-4 text-left border rounded-xl transition-all text-sm"
            >
              {prompt.icon}
              <span>
                {prompt.text}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}