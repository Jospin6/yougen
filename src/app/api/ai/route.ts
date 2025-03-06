// API Route: /api/ai
import { NextRequest, NextResponse } from 'next/server';
import { streamText, generateText } from "ai";
import { gemini } from "@/lib/gemini";

const model = gemini("gemini-1.5-flash");

// export async function POST(req: NextRequest) {
//   try {
//     const { message } = await req.json();
//     const {text} = await generateText({
//         model,
//         prompt: message,
//     });

//     return NextResponse.json({ text });
//   } catch (error) {
//     return NextResponse.json({ error: "An error occured" }, { status: 500 });
//   }
// }
