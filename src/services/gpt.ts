type gptMessage = {
    role: string;
    message: string;
    who: string;
}

export async function chat(prompt: string, message: string, messages: gptMessage[], chat_id: string): Promise<string> {
    const raw = JSON.stringify({
        "env": "chatbot",
        "session": "N/A",
        "prompt": prompt,
        "context": prompt,
        "messages": messages.map((msg, i) => ({
            "id": `${i+1}`,
            "role": msg.role,
            "content": msg.message,
            "who": msg.who,
            "html": ""
        })),
        "newMessage": message,
        "userName": "",
        "aiName": "",
        "model": "gpt-3.5-turbo",
        "temperature": 0.1,
        "maxTokens": 1024*4,
        "maxResults": 1,
        "apiKey": "",
        "service": "openai",
        "embeddingsIndex": "",
        "stop": "",
        "clientId": chat_id,
    });

    const r = await fetch(Bun.env.KELVINGPT_API + "", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authority": Bun.env.KELVINGPT_API_AUTHORITY + "",
        },
        body: raw,
        redirect: "follow",
    });
    const { answer } = await r.json();
    return answer;
}