import { TurnDetectionTypeId } from "@/data/turn-end-types";
import { ModalitiesId } from "@/data/modalities";
import { VoiceId } from "@/data/voices";
import { Preset } from "./presets";
import { ModelId } from "./models";
import { TranscriptionModelId } from "./transcription-models";
import { investigatorInstructions } from "./instructions";

export interface SessionConfig {
  model: ModelId;
  transcriptionModel: TranscriptionModelId;
  turnDetection: TurnDetectionTypeId;
  modalities: ModalitiesId;
  voice: VoiceId;
  temperature: number;
  maxOutputTokens: number | null;
  vadThreshold: number;
  vadSilenceDurationMs: number;
  vadPrefixPaddingMs: number;
}

export interface PlaygroundState {
  sessionConfig: SessionConfig;
  userPresets: Preset[];
  selectedPresetId: string | null;
  openaiAPIKey: string | null | undefined;
  instructions: string;
}

export const defaultSessionConfig: SessionConfig = {
  model: ModelId.gpt_4o_realtime,
  transcriptionModel: TranscriptionModelId.whisper1,
  turnDetection: TurnDetectionTypeId.server_vad,
  modalities: ModalitiesId.text_and_audio,
  voice: VoiceId.alloy,
  temperature: 0.8,
  maxOutputTokens: null,
  vadThreshold: 0.5,
  vadSilenceDurationMs: 1000,
  vadPrefixPaddingMs: 300,
};

// Define the initial state
export const defaultPlaygroundState: PlaygroundState = {
  sessionConfig: { ...defaultSessionConfig },
  userPresets: [],
  selectedPresetId: "investigator-ai",
  openaiAPIKey: undefined,
  instructions: investigatorInstructions,
};
