import axios from "axios";
import { IMessage } from "../types";

const FULL_OPENAI_URI = import.meta.env.VITE_OPENAI_URI
const API_KEY = import.meta.env.VITE_API_KEY


const config = {
    headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
    }
}

export async function chatbotService(messages: IMessage[]) {
    try {
        const payload = {
            messages: trimmer(messages),
            temperature: 0.1,
        }
        console.info(JSON.stringify(payload, null, 2))
        const resp = await axios.post(FULL_OPENAI_URI, payload, config)
        return resp.data
    }
    catch (error) {
        console.error(error)
    }
}

export function trimmer(messages: IMessage[],
    keepSystemMessage: boolean = true,
    history: number = 2) {

    if (!messages || messages.length === 0)
        return []

    const final = []

    // There should only be one system message, but just in case
    const systemMessage = messages.filter(message => message.role === 'system')[0]

    // Add the system message from the messages
    if (keepSystemMessage && systemMessage)
        final.push(systemMessage)

    // Keep 2 * history messages from the bottom
    if (messages.length > 2 * history + 1 + (systemMessage ? 1 : 0)) {
        const start = messages.length - 2 * history - 1
        for (let i = start; i < messages.length; i++) {
            final.push(messages[i])
        }
        return final
    }
    else
        // if it is small return all the messages
        return messages
}