/**
 * Resume page components barrel export.
 *
 * Components for the /resume page displaying professional history,
 * skills, client list, and speaking engagements.
 */

export { default as ResumeHeader } from "./ResumeHeader";
export { default as WorkExperience } from "./WorkExperience";
export { default as CoreCompetencies } from "./CoreCompetencies";
export { default as ClientList } from "./ClientList";
export { default as ConferenceSpeaker } from "./ConferenceSpeaker";

// Re-export types for convenience
export type { ResumeHeaderProps } from "./ResumeHeader";
export type { WorkExperienceProps } from "./WorkExperience";
export type { CoreCompetenciesProps } from "./CoreCompetencies";
export type { ClientListProps } from "./ClientList";
export type { ConferenceSpeakerProps } from "./ConferenceSpeaker";
