/**
 * TypeScript types for the Resume page data.
 * Defines the structure for resume header, work experience, skills, clients, and speaking history.
 */

/**
 * Contact or social link with icon identifier for resume header buttons.
 */
export interface ContactLink {
  /** Display label for the button (e.g., "linkedin.com/in/sing-chan") */
  label: string;

  /** URL to navigate to */
  url: string;

  /** Icon identifier for the button */
  icon: "linkedin" | "github" | "email" | "download";
}

/**
 * Role entry within a job, representing a position held at a company.
 * Multiple roles can exist for a single company (promotions, concurrent roles).
 */
export interface Role {
  /** Job title (e.g., "VP, Product", "Product Manager") */
  title: string;

  /** Start date of the role (e.g., "May 2020", "March 2018") */
  startDate: string;

  /** End date of the role, or "Present" if current */
  endDate: string | "Present";
}

/**
 * Single job entry representing employment at a company.
 * Can include multiple roles (e.g., promotions over time).
 */
export interface Job {
  /** Company name */
  company: string;

  /** Array of roles held at this company, ordered chronologically */
  roles: Role[];

  /** Main description paragraph about responsibilities and achievements */
  description: string;

  /** Optional bullet points for key contributions (used for detailed job entries) */
  keyContributions?: string[];
}

/**
 * Header section content for the resume page.
 * Displays name, tagline, and contact buttons.
 */
export interface ResumeHeaderContent {
  /** Full name (e.g., "Sing Chan") */
  name: string;

  /** Professional tagline or summary statement */
  tagline: string;

  /** Contact/social links displayed as buttons */
  contactLinks: ContactLink[];
}

/**
 * Category of skills for the sidebar (e.g., "Core Competencies", "Everyday Tools").
 * Skills are displayed as chips within each category.
 */
export interface SkillCategory {
  /** Category label displayed as heading */
  label: string;

  /** Array of skill names to display as chips */
  skills: string[];
}

/**
 * Conference or speaking event entry.
 */
export interface SpeakingEvent {
  /** Conference name (e.g., "ARMA Canada 2021 Information Conf") */
  conference: string;

  /** Year of the event */
  year: string;

  /** Optional topic or session title */
  topic?: string;
}

/**
 * Speaking history content with intro text and events list.
 */
export interface SpeakingContent {
  /** Introduction text for the speaking section */
  intro: string;

  /** Array of speaking events */
  events: SpeakingEvent[];
}

/**
 * Complete resume page data structure.
 * Contains all content sections for the resume page.
 *
 * @example
 * const resumeData: ResumeData = {
 *   pageTitle: "Resume | Sing Chan's Portfolio",
 *   pageDescription: "Sing Chan's resume...",
 *   header: {
 *     name: "Sing Chan",
 *     tagline: "I develop useful, intuitive applications...",
 *     contactLinks: [...]
 *   },
 *   jobs: [...],
 *   skillCategories: [...],
 *   clients: [...],
 *   speaking: {...}
 * };
 */
export interface ResumeData {
  /** Page title for metadata */
  pageTitle: string;

  /** Page description for metadata */
  pageDescription: string;

  /** Resume header content (name, tagline, contact links) */
  header: ResumeHeaderContent;

  /** Array of job entries, ordered by date (most recent first) */
  jobs: Job[];

  /** Skill categories for sidebar (Core Competencies, Everyday Tools, etc.) */
  skillCategories: SkillCategory[];

  /** Array of client names */
  clients: string[];

  /** Speaking history section content */
  speaking: SpeakingContent;
}
