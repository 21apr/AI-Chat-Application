import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function getAnswer(req: any, res: any) {
  const { question, fileContent } = req.body;
  try {
    const answer = (await getAnswerFromOpenAI(question, fileContent)) as any;
    if (!answer) {
      res.status(500).json({ error: "Unable to get a response from OpenAI." });
      return;
    }
    res.json({ answer: answer });
  } catch (error) {
    res.status(500).json({ error: "Unable to get a response from OpenAI." });
  }
}

export async function getAnswerFromOpenAI(question: string, fileContent: string) {
  try {
    const numberOfTokensForAnswer = 150
    if (fileContent === "") {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful assistant." },
          { "role": "user", "content": question },
        ],
        max_tokens: numberOfTokensForAnswer,
      });
      return response.choices[0].message.content;
    } else {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful assistant." },
          { "role": "user", "content": "It is a text file with the following content:" + fileContent },
          { "role": "user", "content": "I want you to answer this question based on the file text:" + question },
        ],
        max_tokens: numberOfTokensForAnswer,
      });
      return response.choices[0].message.content;
    }

  } catch (error) {
    console.error("Error when working with OpenAI API:", error);
    throw error;
  }
}

export async function getChatName(question: string, fileContent: string) {
  try {
    if (fileContent === "") {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "you are an assistant who comes up with one short name of no more than 5 words" },
          { "role": "user", "content": question },
        ],
        max_tokens: 50,
      });
      return response.choices[0].message.content;
    } else {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "you are an assistant who comes up with one short name of no more than 5 words" },
          { "role": "user", "content": "It is a text file with the following content:" + fileContent + "AND It is my question:" + question },
        ],
        max_tokens: 50,
      });
    return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("Error when working with OpenAI API:", error);
    throw error;
  }
}