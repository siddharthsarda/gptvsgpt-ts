# gptvsgpt-ts

gptvsgpt-ts is the typescript clone of https://github.com/yoheinakajima/GPTvsGPT/. This program leverages OpenAI's Assistant API to generate a back-and-forth dialogue on a specified topic, allowing each Assistant's unique character traits to shine through in the conversation. This is easily extendible with additional Assistant API capabilities such as function calls and retrieval. You can learn more about the OpenAI Assistant API [here](https://platform.openai.com/docs/assistants/overview).

Find me on X/Twitter at [@sidsarda](https://twitter.com/sidsarda).

## How it Works

The application creates two Assistants with predefined personalities and instructions. It initiates a thread for each Assistant and starts a conversation on a given topic. Each Assistant takes turns responding to the other, with the conversation dynamically unfolding in real-time. Once set up, set up your parameters and run like this:

```typescript
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
```

## Getting Started

### Prerequisites

- Node@19
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone git@github.com:siddharthsarda/gptvsgpt-ts.git
cd gptvsgpt-ts
```

2. Install the required dependencies:

```bash
npm install
```
3. Create an .env from the .env.example

### Setting up Environment Variables
Create an .env.local from the .env.local.example and set the value for OPENAI_API_KEY.

### Usage

Run the script with the following command:

```bash
npm run start
```

You can customize the personalities and topics directly in the script or build upon the code to create a more interactive experience.

## Contributing

Contributions are welcome!

## License

MIT