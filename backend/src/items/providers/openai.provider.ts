import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config/config.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatChoice {
  message: ChatMessage;
  index: number;
  finish_reason: string;
}

interface OpenRouterChatResponse {
  id: string;
  choices: ChatChoice[];
}

@Injectable()
export class OpenAIProvider {
  private readonly endpoint = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private readonly configService: ConfigService) {}

  async generateDescription(prompt: string): Promise<string> {
    const apiKey = this.configService.openRouter.apiKey;

    const response = await axios.post<OpenRouterChatResponse>(
      this.endpoint,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content.trim();
  }
}
