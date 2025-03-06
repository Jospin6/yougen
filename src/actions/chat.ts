"use server";

import { streamText } from "ai";
import { gemini } from "@/lib/gemini";
import {french, english} from "@/lib/prompts/sytemPrompt"
import { createStreamableValue } from "ai/rsc";
import { Message } from "@/components/ui/chatSection";

export const chat = async (history: Message[]) => {
    const stream = createStreamableValue<string>();

    const formattedHistory = history.map((msg) => ({
        role: "user" as const, 
        content: msg.content,
    }));

    (async () => {
        const { textStream } = await streamText({
            model: gemini("gemini-1.5-flash"),
            system: english(),
            messages: formattedHistory,
        });

        for await (const text of textStream) {
            stream.update(text);
        }
        stream.done();
    })();

    return {
        messages: history,
        newMessage: stream.value,
    };
};


// export interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// export async function continueConversation(history: Message[]) {

//   const stream = createStreamableValue();

//   (async () => {
//     const { textStream } = streamText({
//         model: gemini("gemini-1.5-flash"),
//         system: french(),
//         messages: history,
//       });
      

//     for await (const text of textStream) {
//       stream.update(text);
//     }

//     stream.done();
//   })();

//   return {
//     messages: history,
//     newMessage: stream.value,
//   };
// }