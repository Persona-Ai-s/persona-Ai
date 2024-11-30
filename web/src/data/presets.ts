import { big5Instructions, cultureFitInstructions, investigatorInstructions, personalityInstructions } from "./instructions";
import { SessionConfig, defaultSessionConfig } from "./playground-state";
// import { VoiceId } from "./voices";
import {
  HeartHandshake,
  PersonStanding,
  User,
  // GraduationCap,
  // Annoyed,
  // Music,
  // Cigarette,
  // Anchor,
  // Meh,
  // HeadsetIcon,
  // Gamepad,
  // Sparkles,
  // TreePalm,
  // Skull,
  View,
} from "lucide-react";

export interface Preset {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  sessionConfig: SessionConfig;
  defaultGroup?: PresetGroup;
  icon?: React.ElementType;
}

export enum PresetGroup {
  FUNCTIONALITY = "Pick Your Interviewer",
  PERSONALITY = "Fun Style & Personality Demos",
}

export const defaultPresets: Preset[] = [
  // Functionality Group
  {
    id: "investigator-ai",
    name: "Investigator AI",
    description:
    "An AI investigator who will interview and investigate a candidate and their CV.",
    instructions: investigatorInstructions,
    sessionConfig: { ...defaultSessionConfig },
    defaultGroup: PresetGroup.FUNCTIONALITY,
    icon: View,
  },
  {
    id: "values-and-personality",
    name: "Values & Personality Test",
    description:
      "A values and personality test.",
    instructions: personalityInstructions,
    sessionConfig: { ...defaultSessionConfig },
    defaultGroup: PresetGroup.FUNCTIONALITY,
    icon: PersonStanding,
  },
  {
    id: "big5",
    name: "Big 5 Personality Test",
    description:
      "A Big 5 Personality Test that will assess a candidate's personality traits and values.",
    instructions: big5Instructions,
    sessionConfig: { ...defaultSessionConfig },
    defaultGroup: PresetGroup.FUNCTIONALITY,
    icon: User,
  },
  {
    id: "culture-fit",
    name: "Culture Fit Test",
    description: "A Culture Fit Test that will assess a candidate's culture fit.",
    instructions: cultureFitInstructions,
    sessionConfig: { ...defaultSessionConfig },
  defaultGroup: PresetGroup.FUNCTIONALITY,
  icon: HeartHandshake,
},
];
