"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Type, AlignLeft, Tags } from "lucide-react";


const prompts = [
  {
    icon: <FileText strokeWidth={1.0} className="size-5" />,
    text: "Generate a Youtube video script",
  },
  {
    icon: <Type strokeWidth={1.0} className="size-5" />,
    text: "Titles suggestion for your video",
  },
  {
    icon: <AlignLeft strokeWidth={1.0} className="size-5" />,
    text: "Generate a description for your script",
  },
  {
    icon: <Tags strokeWidth={1.0} className="size-5" />,
    text: "Get Tags for your video",
  },
]

export default function App() {

  const handlePromptClick = (text: string) => {
    console.log(text)
  }

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
              onClick={() => handlePromptClick(prompt.text)}
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

//   @headlessui/react embla-carousel react-markdown tiptap react-lazy-load-image-component recharts react-intersection-observer

