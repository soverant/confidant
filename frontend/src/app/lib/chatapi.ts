// postChat.ts

import { BASE_URL } from "./constants"

// Define the data interface
export interface NewMessage {
    chat_id: string
    content: string
    sender_type: "user"|"system"|"confidant"
    sender: string
}
export interface Message {
    id: string,
    created_at: Date
    modified_at: Date
    content: string
    sender_type: "user"|"system"|"confidant"
    sender: string
}
export interface ChatData {
    id: string;
    confidant_id: string
    messages: Message[]
}

// Function to post data
export async function sendMessage(url: string, data: NewMessage): Promise<ChatData> {
    const full_url = BASE_URL + url
    try {
        const response = await fetch(full_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ChatData = await response.json();
        console.log('Success:', result);
        return result
    } catch (error) {
        console.error('Error:', error);
        throw "send message failed"
    }
}

export async function getChatData(url: string): Promise<ChatData> {
    const full_url = BASE_URL + url
    try {
        const response = await fetch(full_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ChatData = await response.json();
        console.log('Chat Data:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw "chat not found"
    }
}

