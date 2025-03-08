
export interface countryCodeProp {
    countryCode: string
}

export interface Message {
    id?: string;
    chatId: string;
    sender: "user" | "assistant";
    content: string;
    createdAt?: string; 
}

export interface Chat {
    id?: string;
    userId: string;
    createdAt?: string; 
    updatedAt?: string; 
    messages?: Message[];
}

export type ChatList = Chat[];