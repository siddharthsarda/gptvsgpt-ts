import { OpenAI } from 'openai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getLastAssistantMessage(threadId: string): Promise<string> {
  const messagesResponse = await client.beta.threads.messages.list(threadId);
  const messages = messagesResponse.data;

  // Iterate through messages in reverse chronological order to find the last assistant message
  for (const message of messages) {
    if (message.role === 'assistant') {
      // Get the content of the last assistant message
      const assistantMessageContent = message.content
        .filter((content): content is MessageContentText => 'text' in content)
        .map((content) => content.text.value)
        .join(' ');
      return assistantMessageContent.trim();
    }
  }

  return ''; // Return an empty string if there is no assistant message
}

async function converse(assistant1Params: any, assistant2Params: any, topic: string, messageCount: number) {
  console.log(`TOPIC: ${topic}\n`);
  // Initialize Assistants
  const assistant1 = await client.beta.assistants.create(assistant1Params);
  const assistant2 = await client.beta.assistants.create(assistant2Params);

  // Create Threads
  const thread1 = await client.beta.threads.create({});
  const thread2 = await client.beta.threads.create({});

  // Function for the conversation between two assistants
  async function assistantConversation(
    startMessage: string,
    assistantA: any,
    threadA: any,
    assistantB: any,
    threadB: any,
    msgLimit: number,
  ) {
    let messageContent = startMessage;

    for (let i = 0; i < msgLimit; i++) {
      // Determine which assistant is speaking for color coding
      let assistantColor, assistantName;
      if (assistantA === assistant1) {
        assistantColor = '\x1b[94m\x1b[1m';
        assistantName = assistant1Params.name;
      } else {
        assistantColor = '\x1b[92m\x1b[1m';
        assistantName = assistant2Params.name;
      }

      // Bold and color the assistant's name and print the turn
      console.log(`${assistantColor}${assistantName} speaking...\x1b[0m (Turn ${i + 1})`);

      // Send the message and wait for a response
      await client.beta.threads.messages.create(threadA.id, {
        role: 'user',
        content: messageContent,
      });

      // Run the assistant and wait until it's done
      const run = await client.beta.threads.runs.create(threadA.id, {
        assistant_id: assistantA.id,
      });
      while (true) {
        const runStatus = await client.beta.threads.runs.retrieve(threadA.id, run.id);
        if (runStatus.status === 'completed') {
          break;
        }
        await sleep(1000); // sleep to avoid hitting the API too frequently
      }

      // Get all messages from the assistant since the last 'user' message
      messageContent = await getLastAssistantMessage(threadA.id);

      // Print out each of the assistant's messages
      console.log(`${messageContent}\n`);

      // Swap the assistants and threads for the next turn in the conversation
      [assistantA, assistantB] = [assistantB, assistantA];
      [threadA, threadB] = [threadB, threadA];
    }
  }

  // Start the conversation
  const startMessage = `Respond with a starting line to discuss ${topic}?`;
  await assistantConversation(startMessage, assistant1, thread1, assistant2, thread2, messageCount);
}

// Define the parameters for the two assistants (example parameters provided)
const assistant1Params = {
  name: 'Pirate',
  instructions: 'You are a mean pirate.',
  tools: [{ type: 'code_interpreter' }],
  model: 'gpt-3.5-turbo-1106',
};

const assistant2Params = {
  name: 'Mermaid',
  instructions: 'You are a bubbly mermaid who speaks like a Valley Girl.',
  tools: [{ type: 'code_interpreter' }],
  model: 'gpt-3.5-turbo-1106',
};

// Example usage:
converse(assistant1Params, assistant2Params, 'global warming', 5);
