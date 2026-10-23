import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { GuardianEngine } from "./engine";
import { GuardianDecision, GuardianDecisionSchema } from "./schema";
import { NormalizedRingEvent } from "../ring/normalizeEvent";
import { HouseholdConfig } from "../store/householdEventStore";
import { buildGuardianSystemPrompt, buildGuardianUserPrompt } from "./prompts";
import { MockGuardianEngine } from "./mockEngine";

export class BedrockGuardianEngine implements GuardianEngine {
  private client: BedrockRuntimeClient | null = null;
  private modelId: string;
  private fallbackEngine: MockGuardianEngine;

  constructor() {
    this.fallbackEngine = new MockGuardianEngine();
    this.modelId =
      process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

    const region = process.env.AWS_REGION || "us-east-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (accessKeyId && secretAccessKey) {
      this.client = new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
          sessionToken: process.env.AWS_SESSION_TOKEN,
        },
      });
    } else {
      // Allow default credential provider chain if running in AWS environment
      try {
        this.client = new BedrockRuntimeClient({ region });
      } catch {
        this.client = null;
      }
    }
  }

  async decide(
    event: NormalizedRingEvent,
    household: HouseholdConfig
  ): Promise<GuardianDecision> {
    // If MOCK_AI is enabled or client is not available, use deterministic fallback
    if (process.env.MOCK_AI === "true" || !this.client) {
      return this.fallbackEngine.decide(event, household);
    }

    try {
      const systemPrompt = buildGuardianSystemPrompt();
      const userPrompt = buildGuardianUserPrompt(event, household);

      let payload: any;
      if (this.modelId.includes("claude")) {
        payload = {
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: userPrompt }],
            },
          ],
          temperature: 0.1,
        };
      } else if (this.modelId.includes("amazon.nova")) {
        payload = {
          system: [{ text: systemPrompt }],
          messages: [
            {
              role: "user",
              content: [{ text: userPrompt }],
            },
          ],
          inferenceConfig: {
            temperature: 0.1,
            max_new_tokens: 1024,
          },
        };
      } else {
        // Generic JSON completion
        payload = {
          prompt: `\n\nHuman: ${systemPrompt}\n\n${userPrompt}\n\nAssistant:`,
          max_tokens_to_sample: 1024,
          temperature: 0.1,
        };
      }

      const command = new InvokeModelCommand({
        modelId: this.modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });

      const response = await this.client.send(command);
      const rawText = new TextDecoder().decode(response.body);
      const parsedRaw = JSON.parse(rawText);

      let outputJsonText = "";
      if (parsedRaw.content && Array.isArray(parsedRaw.content)) {
        outputJsonText = parsedRaw.content[0]?.text || "";
      } else if (parsedRaw.output?.message?.content?.[0]?.text) {
        outputJsonText = parsedRaw.output.message.content[0].text;
      } else if (parsedRaw.completion) {
        outputJsonText = parsedRaw.completion;
      } else {
        outputJsonText = rawText;
      }

      // Extract JSON if model wrapped in markdown code blocks
      const cleanJsonMatch = outputJsonText.match(/\{[\s\S]*\}/);
      if (!cleanJsonMatch) {
        throw new Error("No JSON object found in Bedrock response");
      }

      const jsonCandidate = JSON.parse(cleanJsonMatch[0]);
      return GuardianDecisionSchema.parse(jsonCandidate);
    } catch (err) {
      console.warn(
        "[GuardianEngine] Bedrock call failed or was invalid, falling back to deterministic engine:",
        err instanceof Error ? err.message : err
      );
      return this.fallbackEngine.decide(event, household);
    }
  }

  getEngineName(): string {
    return `Amazon Bedrock (${this.modelId})`;
  }
}

/**
 * Factory helper for active guardian engine.
 */
export function getGuardianEngine(): GuardianEngine {
  if (process.env.MOCK_AI === "true") {
    return new MockGuardianEngine();
  }
  return new BedrockGuardianEngine();
}
