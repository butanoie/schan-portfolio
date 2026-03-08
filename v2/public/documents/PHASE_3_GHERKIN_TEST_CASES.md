# Phase 3: Core Pages Development — Gherkin Test Cases

**Created:** 2026-03-03
**Author:** Sing Chan (with Claude)
**Source:** PHASE_3_PRODUCT_ROADMAP.md
**Format:** Gherkin (Given/When/Then)
**Coverage:** All PBIs across Epics 3.1–3.4
**Companion:** [Phase 3 Product Roadmap](PHASE_3_PRODUCT_ROADMAP.md)

---

## Epic 3.1: Homepage / Portfolio Page

### Feature 3.1.1: Project Grid Layout

#### PBI 3.1.1.1: Responsive Project Grid Component

> **Roadmap:** [PBI 3.1.1.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3111-responsive-project-grid-component)

```gherkin
Feature: Responsive Project Grid
  As a portfolio visitor
  I want to see projects in a responsive grid layout
  So that I can browse work samples at any screen size

  Background:
    Given a list of 18 projects is available

  Scenario: Grid renders all projects
    When the ProjectGrid component renders with 18 projects
    Then all 18 project items are visible in the grid

  Scenario: Desktop displays three columns
    Given the viewport width is 1200px or wider
    When the ProjectGrid renders
    Then the grid displays 3 columns
    And the gap between grid items is 24px

  Scenario: Tablet displays two columns
    Given the viewport width is between 900px and 1199px
    When the ProjectGrid renders
    Then the grid displays 2 columns
    And the gap between grid items is 24px

  Scenario: Mobile displays single column
    Given the viewport width is below 900px
    When the ProjectGrid renders
    Then the grid displays 1 column
    And the gap between grid items is 24px

  Scenario: Empty state renders gracefully
    Given an empty projects array
    When the ProjectGrid renders
    Then no grid items are rendered
    And no errors are thrown

  Scenario: Loading state renders skeleton
    Given loading is true
    When the ProjectGrid renders
    Then skeleton placeholders are shown instead of project cards

  Scenario: Passes axe accessibility audit
    When the ProjectGrid component renders with projects
    Then an axe-core audit reports zero WCAG 2.2 AA violations

  Scenario: Project click handler fires
    When a user clicks a project item
    Then the onProjectClick callback fires with the project id
```

#### PBI 3.1.1.2: Project Card Component

> **Roadmap:** [PBI 3.1.1.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3112-project-card-component)

```gherkin
Feature: Project Card
  As a portfolio visitor
  I want to see a preview card for each project
  So that I can quickly identify projects of interest

  Background:
    Given a project with a thumbnail, title, tags, and circa date

  Scenario: Card displays all project information
    When the ProjectCard renders
    Then the thumbnail image is visible via ProjectImage
    And the project title is displayed
    And technology tags are displayed
    And the circa date is displayed

  Scenario: Hover applies scale and shadow on desktop
    Given prefers-reduced-motion is not set to "reduce"
    When the user hovers over the card
    Then the card applies transform scale of 1.02
    And the card applies an elevation shadow

  Scenario: Hover animation disabled for reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the user hovers over the card
    Then no scale transform is applied
    And no shadow transition is applied

  Scenario: Card is keyboard focusable
    When the user presses Tab to navigate
    Then the card receives visible focus
    And the focus indicator meets WCAG 2.4.7

  Scenario: Card activates via Enter key
    Given the card has keyboard focus
    When the user presses Enter
    Then the onClick callback fires

  Scenario: Card activates via Space key
    Given the card has keyboard focus
    When the user presses Space
    Then the onClick callback fires

  Scenario: Touch target meets minimum size
    When the ProjectCard renders
    Then the interactive area is at least 44x44px

  Scenario: Priority card loads image eagerly
    Given the priority prop is true
    When the ProjectCard renders
    Then the thumbnail image does not use lazy loading
```

---

### Feature 3.1.2: Project Detail Display

#### PBI 3.1.2.1: Layout Variant Logic

> **Roadmap:** [PBI 3.1.2.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3121-layout-variant-logic)

```gherkin
Feature: Layout Variant Selection
  As the portfolio system
  I want to select the correct layout for each project
  So that content displays optimally based on viewport and content type

  Scenario: Mobile project with videos returns narrow-video
    Given the project has 1 or more videos
    And the viewport is mobile (isMobile is true)
    When getLayoutVariant is called
    Then the returned variant is "narrow-video"

  Scenario: Mobile project without videos returns narrow
    Given the project has 0 videos
    And the viewport is mobile (isMobile is true)
    When getLayoutVariant is called
    Then the returned variant is "narrow"

  Scenario: Desktop project with videos returns wide-video
    Given the project has 1 or more videos
    And the viewport is desktop (isMobile is false)
    When getLayoutVariant is called
    Then the returned variant is "wide-video"

  Scenario: Desktop project with altGrid flag returns wide-alternate
    Given the project has 0 videos
    And the project altGrid flag is true
    And the viewport is desktop (isMobile is false)
    When getLayoutVariant is called
    Then the returned variant is "wide-alternate"

  Scenario: Desktop project without videos or altGrid returns wide-regular
    Given the project has 0 videos
    And the project altGrid flag is false
    And the viewport is desktop (isMobile is false)
    When getLayoutVariant is called
    Then the returned variant is "wide-regular"

  Scenario: All 18 projects map to valid variants
    Given the full list of 18 portfolio projects
    When getLayoutVariant is called for each project at each viewport
    Then every result is one of the 5 valid LayoutVariant values
```

#### PBI 3.1.2.2: ProjectHeader Component

> **Roadmap:** [PBI 3.1.2.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3122-projectheader-component)

```gherkin
Feature: Project Header
  As a portfolio visitor
  I want to see project title, tags, and date clearly
  So that I can understand the project context at a glance

  Scenario: Title renders as h2 heading
    Given a project with title "Collabspace"
    When the ProjectHeader renders
    Then the title is rendered inside an h2 element

  Scenario: Technology tags render as chips
    Given a project with tags ["React", "TypeScript", ".NET"]
    When the ProjectHeader renders
    Then 3 styled chip elements are visible
    And each chip displays the corresponding tag text

  Scenario: Circa date is visually muted
    Given a project with circa "Fall 2017 - Present"
    When the ProjectHeader renders
    Then the circa text is displayed
    And its visual styling is muted relative to the title
```

#### PBI 3.1.2.3: ProjectDescription Component

> **Roadmap:** [PBI 3.1.2.3 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3123-projectdescription-component)

```gherkin
Feature: Project Description
  As a portfolio visitor
  I want to read formatted project descriptions
  So that I understand the project scope and my contributions

  Scenario: HTML content renders correctly
    Given description HTML containing <strong>, <p>, and <a> tags
    When the ProjectDescription renders
    Then the formatted content is visible in the DOM

  Scenario: Script tags are stripped by DOMPurify
    Given description HTML containing a <script> tag
    When the ProjectDescription renders
    Then the script tag is not present in the rendered output

  Scenario: Event handlers are stripped by DOMPurify
    Given description HTML containing an onclick attribute
    When the ProjectDescription renders
    Then no onclick attributes are present in the rendered output

  Scenario: Links render as accessible anchors
    Given description HTML containing an <a href="..."> tag
    When the ProjectDescription renders
    Then the link is present and navigable
```

#### PBI 3.1.2.4: VideoEmbed Component

> **Roadmap:** [PBI 3.1.2.4 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3124-videoembed-component)

```gherkin
Feature: Video Embed
  As a portfolio visitor
  I want to watch embedded video demos
  So that I can see projects in action

  Scenario: Vimeo URL renders Vimeo embed
    Given a video with a Vimeo URL
    When the VideoEmbed renders
    Then an iframe with a Vimeo embed src is present

  Scenario: YouTube URL renders YouTube embed
    Given a video with a YouTube URL
    When the VideoEmbed renders
    Then an iframe with a YouTube embed src is present

  Scenario: Self-hosted video renders video element
    Given a video with a direct MP4 URL
    When the VideoEmbed renders
    Then a native video element with the source URL is present

  Scenario: Container maintains 16:9 aspect ratio
    When any VideoEmbed renders
    Then the container maintains a 16:9 aspect ratio responsively

  Scenario: Iframe has accessible title
    When an iframe-based VideoEmbed renders
    Then the iframe has a non-empty title attribute

  Scenario: Iframe uses lazy loading
    When an iframe-based VideoEmbed renders
    Then the iframe has loading="lazy"
```

#### PBI 3.1.2.5: ProjectDetail Component

> **Roadmap:** [PBI 3.1.2.5 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3125-projectdetail-component)

```gherkin
Feature: Project Detail Assembly
  As a portfolio visitor
  I want to see each project's full detail in the correct layout
  So that content is displayed optimally for my viewport

  Scenario Outline: Correct layout variant renders
    Given a project configured for "<variant>" layout
    When the ProjectDetail renders
    Then the layout matches the "<variant>" visual structure

    Examples:
      | variant        |
      | wide-video     |
      | wide-regular   |
      | wide-alternate |
      | narrow         |
      | narrow-video   |

  Scenario: Responsive transition at md breakpoint
    Given the viewport transitions from desktop to mobile
    When the ProjectDetail re-renders
    Then the layout switches from a wide to narrow variant

  Scenario: All subcomponents render
    Given a project with header, description, video, and gallery content
    When the ProjectDetail renders
    Then ProjectHeader, ProjectDescription, VideoEmbed, and ProjectGallery are all present
```

---

### Feature 3.1.3: Projects List Container

#### PBI 3.1.3.1: ProjectsList Component

> **Roadmap:** [PBI 3.1.3.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3131-projectslist-component)

```gherkin
Feature: Projects List
  As a portfolio visitor
  I want to scroll through all projects on a single page
  So that I can browse the full portfolio without pagination

  Scenario: All 18 projects render
    Given a list of 18 projects
    When the ProjectsList renders
    Then 18 ProjectDetail components are present

  Scenario: Desktop vertical spacing is 64px
    Given the viewport is desktop width
    When the ProjectsList renders
    Then the vertical gap between projects is 64px

  Scenario: Mobile vertical spacing is 48px
    Given the viewport is mobile width
    When the ProjectsList renders
    Then the vertical gap between projects is 48px

  Scenario: Each project uses correct layout variant
    Given projects with varying video, altGrid, and viewport conditions
    When the ProjectsList renders
    Then each ProjectDetail renders the variant matching its content and viewport
```

#### PBI 3.1.3.2: Homepage Page Route

> **Roadmap:** [PBI 3.1.3.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3132-homepage-page-route)

```gherkin
Feature: Homepage Page Route
  As a portfolio visitor
  I want to land on the projects homepage
  So that I see the full portfolio immediately

  Scenario: Page fetches all 18 projects server-side
    When the homepage loads
    Then all 18 projects are fetched and rendered

  Scenario: Page title uses h1
    When the homepage renders
    Then the page title "Projects" is inside an h1 element

  Scenario: Project titles use h2
    When the homepage renders
    Then each project title is inside an h2 element

  Scenario: Container uses lg maxWidth
    When the homepage renders
    Then the main container has maxWidth="lg"

  Scenario: No client-side JavaScript errors on load
    When the homepage loads in the browser
    Then the console contains zero JavaScript errors
```

---

### Feature 3.1.4: Load More Navigation

#### PBI 3.1.4.1: ButaNavigation Component

> **Roadmap:** [PBI 3.1.4.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3141-butanavigation-component)

```gherkin
Feature: Buta Navigation
  As a portfolio visitor
  I want a friendly mascot to guide me through loading more projects
  So that the browsing experience feels personal and engaging

  Scenario: Loading state renders correctly
    Given the ButaNavigation state is "loading"
    When the component renders
    Then a loading indicator is displayed inside the thought bubble

  Scenario: Load-more state renders with action
    Given the ButaNavigation state is "load-more"
    And currentCount is 6 and totalCount is 18
    When the component renders
    Then a "load more" link is visible inside the thought bubble
    And the thought bubble uses Gochi Hand font
    And the bubble has #F5F5F5 background and a subtle border

  Scenario: End state renders completion message
    Given the ButaNavigation state is "end"
    When the component renders
    Then a completion message is displayed inside the thought bubble

  Scenario: Thought bubble has connecting circles
    When the ButaNavigation renders in any state
    Then decorative connecting circles are visible between the Buta image and bubble

  Scenario: Screen reader announcements
    When the ButaNavigation renders
    Then the container has role="status"
    And the container has aria-live="polite"

  Scenario: Load more link has contextual aria-label
    Given the ButaNavigation state is "load-more"
    And currentCount is 6 and totalCount is 18
    When the component renders
    Then the load more link has an aria-label containing project count context

  Scenario: Load more activates via keyboard
    Given the ButaNavigation state is "load-more"
    And the load more link has keyboard focus
    When the user presses Enter
    Then the onLoadMore callback fires

  Scenario: Load more activates via Space key
    Given the ButaNavigation state is "load-more"
    And the load more link has keyboard focus
    When the user presses Space
    Then the onLoadMore callback fires
```

---

## Epic 3.2: Resume Page

### Feature 3.2.1: Resume Content Components

#### PBI 3.2.1.1: ResumeHeader Component

> **Roadmap:** [PBI 3.2.1.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3211-resumeheader-component)

```gherkin
Feature: Resume Header
  As a recruiter or hiring manager
  I want to see name, tagline, and contact info
  So that I can quickly identify the candidate and reach out

  Scenario: Name renders in Oswald font at responsive sizes
    When the ResumeHeader renders on desktop
    Then the name is displayed in Oswald font at 2.5rem
    When the viewport shrinks to mobile
    Then the name font size adjusts to 1.75rem

  Scenario: Tagline renders in Open Sans
    When the ResumeHeader renders
    Then the tagline is displayed in Open Sans font

  Scenario: Email is obfuscated with ROT13
    When the ResumeHeader renders with contact links
    Then the email address in the DOM is ROT13-encoded

  Scenario: Phone is obfuscated with ROT5
    When the ResumeHeader renders with contact links
    Then the phone number in the DOM is ROT5-encoded

  Scenario: Contact info deobfuscates on interaction
    Given the ResumeHeader has rendered with obfuscated contact info
    When the user interacts with a contact link
    Then the display text shows the real contact information
```

#### PBI 3.2.1.2: WorkExperience Component

> **Roadmap:** [PBI 3.2.1.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3212-workexperience-component)

```gherkin
Feature: Work Experience
  As a recruiter
  I want to see career history with roles grouped by company
  So that I can understand career progression

  Scenario: Single job with one role renders
    Given a job with company "Habanero Consulting Group" and 1 role
    When the WorkExperience renders
    Then the company name is displayed prominently
    And the single role title and dates are visible

  Scenario: Multi-role job groups roles as timeline
    Given a job with company "Collabware Systems" and 3 roles
    When the WorkExperience renders
    Then the company name is displayed once
    And all 3 roles appear in a timeline under that company

  Scenario: Desktop date alignment
    Given the viewport is desktop width
    When the WorkExperience renders
    Then dates are muted and right-aligned

  Scenario: Mobile date positioning
    Given the viewport is mobile width
    When the WorkExperience renders
    Then dates appear below the role title

  Scenario: Key contributions render as list
    Given a role with 4 key contributions
    When the WorkExperience renders
    Then 4 list items are visible under the role
```

#### PBI 3.2.1.3: CoreCompetencies Component

> **Roadmap:** [PBI 3.2.1.3 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3213-corecompetencies-component)

```gherkin
Feature: Core Competencies
  As a recruiter
  I want to see skills grouped by category
  So that I can assess relevant expertise quickly

  Scenario: Skills render as chips grouped by category
    Given 3 skill categories with skills in each
    When the CoreCompetencies renders
    Then each category label is displayed
    And skills under each category appear as chip components

  Scenario: Chips are non-interactive display-only
    When the CoreCompetencies renders
    Then skill chips have no click handlers
    And chips are not keyboard focusable as interactive elements

  Scenario: Empty category handles gracefully
    Given a category with an empty skills array
    When the CoreCompetencies renders
    Then the category label still renders
    And no chip elements appear under it
    And no errors are thrown
```

#### PBI 3.2.1.4: ClientList Component

> **Roadmap:** [PBI 3.2.1.4 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3214-clientlist-component)

```gherkin
Feature: Client List
  As a portfolio visitor
  I want to see the breadth of client experience
  So that I can gauge industry expertise

  Scenario: All clients render
    Given a list of 50+ client names
    When the ClientList renders
    Then all client names are visible

  Scenario: Desktop displays four columns
    Given the viewport is desktop width
    When the ClientList renders
    Then clients are arranged in 4 columns

  Scenario: Tablet displays three columns
    Given the viewport is tablet width
    When the ClientList renders
    Then clients are arranged in 3 columns

  Scenario: Mobile displays two columns
    Given the viewport is mobile width
    When the ClientList renders
    Then clients are arranged in 2 columns
```

#### PBI 3.2.1.5: ConferenceSpeaker Component

> **Roadmap:** [PBI 3.2.1.5 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3215-conferencespeaker-component)

```gherkin
Feature: Conference Speaking History
  As a visitor
  I want to see speaking engagements
  So that I understand public speaking and thought leadership experience

  Scenario: All 6 events render
    Given a list of 6 speaking events
    When the ConferenceSpeaker renders
    Then all 6 events are displayed

  Scenario: Each event shows conference, year, and topic
    Given a speaking event at "SharePoint Saturday" in "2015" on "UX Design"
    When the ConferenceSpeaker renders
    Then the conference name, year, and topic are all visible
```

---

### Feature 3.2.2: Resume Page Layout

#### PBI 3.2.2.1: Resume Page Route

> **Roadmap:** [PBI 3.2.2.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3221-resume-page-route)

```gherkin
Feature: Resume Page Layout
  As a recruiter
  I want a well-structured resume page
  So that I can scan the candidate's background efficiently

  Scenario: Desktop renders two-column layout
    Given the viewport is md width or larger
    When the resume page renders
    Then the layout has two columns at 70/30 split

  Scenario: Mobile renders single column with reordered sections
    Given the viewport is below md width
    When the resume page renders
    Then the layout is single column
    And sections appear in order: Header, Core Competencies, Work Experience, Everyday Tools, Clients, Conferences

  Scenario: Heading hierarchy is correct
    When the resume page renders
    Then headings follow a logical h1 > h2 > h3 hierarchy with no skipped levels

  Scenario: Data loads from resume data module
    When the resume page renders
    Then content matches the data from v2/src/data/resume.ts
```

#### PBI 3.2.2.2: Print Stylesheet

> **Roadmap:** [PBI 3.2.2.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3222-print-stylesheet)

```gherkin
Feature: Print Stylesheet
  As a recruiter
  I want to print the resume cleanly
  So that I have a hard copy for review

  Scenario: Navigation and footer hidden in print
    When the user opens browser print preview
    Then the navigation header is not visible
    And the footer is not visible
    And non-essential UI elements are hidden

  Scenario: Print layout is single column for A4/Letter
    When the user opens browser print preview
    Then the layout renders as a single column optimized for A4/Letter

  Scenario: Page breaks avoid mid-section splits
    When the user opens browser print preview
    Then no section is split across a page boundary

  Scenario: PDF download button is present
    When the resume page renders
    Then a PDF download button is visible
    And it links to the static PDF file
```

---

### Feature 3.2.3: Resume Data Layer

#### PBI 3.2.3.1: Resume Types and Data

> **Roadmap:** [PBI 3.2.3.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3231-resume-types-and-data)

```gherkin
Feature: Resume Types and Data
  As a developer
  I want strongly-typed resume data
  So that components are type-safe and content is accurate

  Scenario: All 8 interfaces are defined
    When the resume types module is inspected
    Then interfaces exist for ResumeData, Job, Role, SkillCategory, ContactLink, and SpeakingEvent
    And all 8 interfaces have JSDoc documentation

  Scenario: Resume data matches v1 source content
    When resume data is loaded
    Then the content matches the original v1 portfolio resume data

  Scenario: Localized data function supports i18n
    Given a translation function t
    When getLocalizedResumeData(t) is called
    Then the returned data includes translated strings

  Scenario: Zero TypeScript errors
    When the resume types and data modules are type-checked
    Then TypeScript reports zero errors
```

---

## Epic 3.3: Colophon / About Page

### Feature 3.3.1: Colophon Content Components

#### PBI 3.3.1.1: AboutSection Component

> **Roadmap:** [PBI 3.3.1.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3311-aboutsection-component)

```gherkin
Feature: About Section
  As a visitor
  I want to read a bio about the portfolio author
  So that I understand who they are and what they do

  Scenario: Bio renders with name, role, and company
    Given name "Sing Chan", currentRole "VP, Product", company "Collabware Systems"
    When the AboutSection renders
    Then the name, role, and company are displayed prominently
    And the bio text is visible

  Scenario: HTML bio is sanitized
    Given a bio string containing HTML with a <script> tag
    When the AboutSection renders
    Then the script tag is stripped from the output
    And safe HTML tags render correctly

  Scenario: Responsibilities render when provided
    Given a list of 3 responsibilities
    When the AboutSection renders
    Then all 3 responsibilities are displayed
```

#### PBI 3.3.1.2: TechnologiesShowcase Component

> **Roadmap:** [PBI 3.3.1.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3312-technologiesshowcase-component)

```gherkin
Feature: Technologies Showcase
  As a visitor
  I want to see the technology stack used
  So that I can assess technical expertise and tooling choices

  Scenario: V2 technologies display in categorized grid
    Given V2 technologies grouped into 4 categories
    When the TechnologiesShowcase renders
    Then categories "Framework & Runtime", "UI & Styling", "Development Tools", and "Testing" are visible
    And each category contains its technology items

  Scenario: V1 technologies display in collapsible accordion
    When the TechnologiesShowcase renders
    Then V1 technologies are inside a collapsed accordion section

  Scenario: Technology names link to URLs
    Given a technology with a URL
    When the TechnologiesShowcase renders
    Then the technology name is a hyperlink to the URL

  Scenario: Technology without URL renders as plain text
    Given a technology without a URL
    When the TechnologiesShowcase renders
    Then the technology name is plain text with no link

  Scenario: Accordion expands via Enter key
    Given the V1 accordion trigger has keyboard focus
    When the user presses Enter
    Then the accordion expands to show V1 technologies

  Scenario: Accordion expands via Space key
    Given the V1 accordion trigger has keyboard focus
    When the user presses Space
    Then the accordion expands to show V1 technologies

  Scenario: Accordion collapses when toggled again
    Given the V1 accordion is expanded
    When the user activates the trigger again
    Then the accordion collapses
```

#### PBI 3.3.1.3: DesignPhilosophy Component

> **Roadmap:** [PBI 3.3.1.3 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3313-designphilosophy-component)

```gherkin
Feature: Design Philosophy
  As a visitor
  I want to see the color palette and typography choices
  So that I understand the visual design system

  Scenario: All 6 color swatches render
    When the DesignPhilosophy renders
    Then swatches for Sakura, Duck Egg, Sky Blue, Graphite, Sage, and Maroon are visible

  Scenario: Swatches display hex codes and descriptions
    Given the Sakura swatch
    When the DesignPhilosophy renders
    Then the swatch shows the hex code and descriptive text

  Scenario: Swatch text labels meet 3:1 contrast
    When the DesignPhilosophy renders
    Then text labels on each swatch have at least 3:1 contrast against the swatch background

  Scenario: Typography samples render in actual fonts
    When the DesignPhilosophy renders
    Then an Open Sans sample renders in Open Sans
    And an Oswald sample renders in Oswald
    And a Gochi Hand sample renders in Gochi Hand

  Scenario: Constants sourced from colors module
    When the DesignPhilosophy renders
    Then color values match constants from v2/src/constants/colors.ts
```

#### PBI 3.3.1.4: ButaStory Component

> **Roadmap:** [PBI 3.3.1.4 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3314-butastory-component)

```gherkin
Feature: Buta Story
  As a visitor
  I want to read the origin story of the Buta mascot
  So that I get a sense of the author's personality

  Scenario: Story renders in paragraphs
    When the ButaStory renders
    Then the mascot origin story is displayed in paragraph elements

  Scenario: Images have meaningful alt text
    When the ButaStory renders
    Then each Buta image has a descriptive non-empty alt attribute

  Scenario: Thought bubble uses Gochi Hand font
    When the ButaStory renders
    Then thought bubble text is styled in Gochi Hand font
```

---

### Feature 3.3.2: Colophon Page Assembly

#### PBI 3.3.2.1: Colophon Page Route and Data

> **Roadmap:** [PBI 3.3.2.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3321-colophon-page-route-and-data)

```gherkin
Feature: Colophon Page Assembly
  As a visitor
  I want to see the complete colophon page
  So that I can learn about the portfolio's creation

  Scenario: All four sections render
    When the colophon page loads
    Then the About section is visible
    And the Technologies section is visible
    And the Design Philosophy section is visible
    And the Buta Story section is visible

  Scenario: 10 TypeScript interfaces are defined
    When the colophon types module is inspected
    Then exactly 10 interfaces are defined with JSDoc

  Scenario: Responsive mobile-first layout
    Given the viewport is mobile width
    When the colophon page renders
    Then all sections stack vertically
    And content is readable without horizontal scrolling

  Scenario: Buta images load from correct path
    When the colophon page renders
    Then Buta images load from v2/public/images/buta/

  Scenario: Zero TypeScript and ESLint errors
    When the colophon page module is linted and type-checked
    Then zero errors are reported
```

---

## Epic 3.4: Shared Components

### Feature 3.4.1: Image Lightbox

#### PBI 3.4.1.1: Lightbox Component

> **Roadmap:** [PBI 3.4.1.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3411-lightbox-component)

```gherkin
Feature: Image Lightbox
  As a portfolio visitor
  I want a full-screen image viewer
  So that I can examine project screenshots in detail

  Background:
    Given a lightbox with 12 project images starting at index 3

  Scenario: Dialog semantics are correct
    When the Lightbox opens
    Then the container has role="dialog"
    And the container has aria-modal="true"

  Scenario: Navigate to next image via right arrow key
    Given the Lightbox is open showing image 3
    When the user presses the right arrow key
    Then image 4 is displayed

  Scenario: Navigate to previous image via left arrow key
    Given the Lightbox is open showing image 3
    When the user presses the left arrow key
    Then image 2 is displayed

  Scenario: Navigate via next/previous buttons
    When the user clicks the next button
    Then the next image is displayed
    When the user clicks the previous button
    Then the previous image is displayed

  Scenario: Close via Escape key
    Given the Lightbox is open
    When the user presses Escape
    Then the Lightbox closes
    And the onClose callback fires

  Scenario: Close via close button
    Given the Lightbox is open
    When the user clicks the close button
    Then the Lightbox closes

  Scenario: Close button has aria-label
    When the Lightbox is open
    Then the close button has a descriptive aria-label

  Scenario: Focus is trapped within the modal
    Given the Lightbox is open
    When the user presses Tab repeatedly
    Then focus cycles only within the Lightbox elements
    And focus never leaves the modal

  Scenario: Focus returns to trigger on close
    Given the Lightbox was opened from a gallery thumbnail
    When the Lightbox closes
    Then focus returns to the gallery thumbnail that triggered it

  Scenario: Touch swipe navigates images on mobile
    Given the Lightbox is open on a touch device
    When the user swipes left
    Then the next image is displayed
    When the user swipes right
    Then the previous image is displayed

  Scenario: Image counter displays position
    Given the Lightbox is showing image 3 of 12
    When the Lightbox renders
    Then the counter displays "3 of 12"

  Scenario: Caption is announced via aria-describedby
    Given the current image has a caption
    When the Lightbox renders
    Then the image has aria-describedby pointing to the caption element

  Scenario: Navigation buttons meet touch target minimum
    When the Lightbox renders
    Then all navigation buttons are at least 44x44px

  Scenario: Passes axe accessibility audit
    When the Lightbox is open
    Then an axe-core audit reports zero WCAG 2.2 AA violations
```

---

### Feature 3.4.2: Loading States

#### PBI 3.4.2.1: LoadingSkeleton Component

> **Roadmap:** [PBI 3.4.2.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3421-loadingskeleton-component)

```gherkin
Feature: Loading Skeleton
  As a visitor
  I want to see placeholder shapes while content loads
  So that I know the page is working and can anticipate the layout

  Scenario: Skeleton shapes match content layout
    Given a skeleton configured for "text" variant
    When the LoadingSkeleton renders
    Then placeholder shapes approximate text line layout

  Scenario: Rectangle variant renders
    Given a skeleton configured for "rectangle" variant
    When the LoadingSkeleton renders
    Then a rectangular placeholder shape is visible

  Scenario: Circle variant renders
    Given a skeleton configured for "circle" variant
    When the LoadingSkeleton renders
    Then a circular placeholder shape is visible

  Scenario: Shimmer animation plays by default
    Given prefers-reduced-motion is not set to "reduce"
    When the LoadingSkeleton renders
    Then the shimmer animation is active

  Scenario: Shimmer disabled for reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the LoadingSkeleton renders
    Then no shimmer animation plays
    And a static gray placeholder is shown instead

  Scenario: Loading container has aria-busy
    When the LoadingSkeleton renders
    Then the container has aria-busy="true"

  Scenario: Smooth transition to real content
    Given the LoadingSkeleton is displayed
    When loading completes and real content renders
    Then the transition from skeleton to content is smooth
```

#### PBI 3.4.2.2: LoadingSpinner Component

> **Roadmap:** [PBI 3.4.2.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3422-loadingspinner-component)

```gherkin
Feature: Loading Spinner
  As a visitor
  I want to see an inline loading indicator
  So that I know an action is in progress

  Scenario: Spinner renders with configurable size
    Given a size of "large"
    When the LoadingSpinner renders
    Then the spinner matches the specified size

  Scenario: Screen reader label is present
    Given an aria-label of "Loading projects"
    When the LoadingSpinner renders
    Then the spinner has aria-label="Loading projects"

  Scenario: Animation respects reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the LoadingSpinner renders
    Then the spinning animation is paused or replaced with a static indicator
```

---

### Feature 3.4.3: Common UI Components

#### PBI 3.4.3.1: TagChip Component

> **Roadmap:** [PBI 3.4.3.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3431-tagchip-component)

```gherkin
Feature: Tag Chip
  As a visitor
  I want to see technology tags as styled chips
  So that I can quickly identify relevant technologies

  Scenario: Display-only mode renders without interactivity
    Given a TagChip with label "React" and no onClick handler
    When the TagChip renders
    Then "React" is displayed as a chip
    And the chip is not keyboard focusable
    And the chip does not respond to click events

  Scenario: Interactive mode responds to clicks
    Given a TagChip with label "React" and an onClick handler
    When the user clicks the chip
    Then the onClick callback fires

  Scenario: Selected state has visual differentiation
    Given a TagChip with selected=true
    When the TagChip renders
    Then the chip has a visually distinct selected appearance

  Scenario: Interactive chip meets touch target minimum
    Given a TagChip with an onClick handler
    When the TagChip renders
    Then the interactive area is at least 44x44px

  Scenario: Count displays alongside label
    Given a TagChip with label "React" and count=5
    When the TagChip renders
    Then "React" and the count "5" are both visible

  Scenario: Small size variant renders
    Given a TagChip with size="small"
    When the TagChip renders
    Then the chip renders in the small size variant
```

#### PBI 3.4.3.2: ThoughtBubble Component

> **Roadmap:** [PBI 3.4.3.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3432-thoughtbubble-component)

```gherkin
Feature: Thought Bubble
  As a visitor
  I want to see text in a styled thought bubble
  So that it conveys personality through the Buta mascot voice

  Scenario: Content renders inside styled bubble
    Given content text "That's all the projects!"
    When the ThoughtBubble renders
    Then the text is displayed inside a styled bubble container

  Scenario: Bubble uses Gochi Hand font
    When the ThoughtBubble renders
    Then the text is styled in Gochi Hand font

  Scenario: Bubble has correct background
    When the ThoughtBubble renders
    Then the bubble has a #F5F5F5 background

  Scenario: Connecting circles are visible
    When the ThoughtBubble renders
    Then decorative connecting circles are visible below the bubble

  Scenario: Reusable across components
    When the ThoughtBubble is used in ButaNavigation
    And the ThoughtBubble is used in Footer
    Then both instances render correctly with their respective content
```

#### PBI 3.4.3.3: ErrorBoundary Component

> **Roadmap:** [PBI 3.4.3.3 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3433-errorboundary-component)

```gherkin
Feature: Error Boundary
  As a visitor
  I want to see a friendly error message if something breaks
  So that the entire page doesn't crash

  Scenario: Child render error is caught
    Given a child component that throws a render error
    When the ErrorBoundary renders
    Then the error is caught
    And a user-friendly fallback message is displayed

  Scenario: Retry button resets the error state
    Given the ErrorBoundary is showing its fallback
    When the user clicks the retry button
    Then the ErrorBoundary clears the error
    And the child component attempts to re-render

  Scenario: Error is logged for debugging
    Given a child component throws a render error
    When the ErrorBoundary catches the error
    Then the error details are logged for debugging

  Scenario: Non-erroring children render normally
    Given a child component that renders without error
    When the ErrorBoundary renders
    Then the children render normally with no fallback visible
```

---

### Feature 3.4.4: Enhanced Navigation

#### PBI 3.4.4.1: Header Mobile Menu

> **Roadmap:** [PBI 3.4.4.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3441-header-mobile-menu)

```gherkin
Feature: Header Mobile Menu
  As a mobile visitor
  I want a hamburger menu for navigation
  So that I can access all pages on small screens

  Scenario: Hamburger button meets touch target size
    When the header renders on mobile
    Then the hamburger menu button is at least 44x44px

  Scenario: Drawer opens from hamburger button
    When the user taps the hamburger button
    Then a drawer slides in from the right
    And the drawer contains full-height navigation links
    And navigation links have large touch targets

  Scenario: Drawer closes via close button
    Given the mobile drawer is open
    When the user taps the close button
    Then the drawer closes

  Scenario: Close button has aria-label
    Given the mobile drawer is open
    Then the close button has a descriptive aria-label

  Scenario: Drawer closes via Escape key
    Given the mobile drawer is open
    When the user presses Escape
    Then the drawer closes

  Scenario: Focus is trapped while drawer is open
    Given the mobile drawer is open
    When the user presses Tab repeatedly
    Then focus cycles only within the drawer elements

  Scenario: Hamburger button has aria-expanded
    When the drawer is closed
    Then the hamburger button has aria-expanded="false"
    When the drawer is open
    Then the hamburger button has aria-expanded="true"

  Scenario: Focus returns to hamburger on close
    Given the mobile drawer was opened via the hamburger button
    When the drawer closes
    Then focus returns to the hamburger button
```

#### PBI 3.4.4.2: Footer Enhancement

> **Roadmap:** [PBI 3.4.4.2 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3442-footer-enhancement)

```gherkin
Feature: Footer Enhancement
  As a visitor
  I want a footer with personality and accessibility
  So that I can navigate and see the Buta mascot

  Scenario: ThoughtBubble renders in footer
    When the footer renders
    Then a ThoughtBubble component is visible

  Scenario: Buta image has meaningful alt text
    When the footer renders
    Then the Buta character image has a descriptive non-empty alt attribute

  Scenario: Responsive positioning
    Given the viewport changes between mobile and desktop
    When the footer renders
    Then footer elements reposition appropriately for the viewport

  Scenario: Heading hierarchy is proper
    When the footer renders
    Then headings within the footer follow the page's heading hierarchy

  Scenario: Navigation links have descriptive text
    When the footer renders
    Then navigation links have descriptive visible text
    And links do not use generic text like "click here"
```

---

### Feature 3.4.5: Touch Gesture Support

#### PBI 3.4.5.1: useSwipe Hook

> **Roadmap:** [PBI 3.4.5.1 Acceptance Criteria](PHASE_3_PRODUCT_ROADMAP.md#pbi-3451-useswipe-hook)

```gherkin
Feature: Swipe Gesture Detection
  As a mobile user
  I want to swipe to navigate images
  So that I can browse the lightbox naturally on touch devices

  Scenario: Left swipe detected
    Given the swipe threshold is 50px
    When the user swipes left by 60px
    Then the hook returns direction "left"
    And the hook returns the swipe distance

  Scenario: Right swipe detected
    Given the swipe threshold is 50px
    When the user swipes right by 60px
    Then the hook returns direction "right"
    And the hook returns the swipe distance

  Scenario: Swipe below threshold is ignored
    Given the swipe threshold is 50px
    When the user swipes left by 30px
    Then no swipe direction is returned

  Scenario: Configurable threshold
    Given the swipe threshold is set to 100px
    When the user swipes left by 80px
    Then no swipe direction is returned
    When the user swipes left by 110px
    Then the hook returns direction "left"

  Scenario: Default scroll prevented during horizontal swipe
    When the user performs a horizontal swipe gesture
    Then the default scroll behavior is prevented
    And the swipe gesture is handled by the hook
```

---

## Cross-Cutting: Quality Standards

```gherkin
Feature: Cross-Cutting Quality Standards
  As a developer
  I want all Phase 3 components to meet baseline quality
  So that the codebase is consistent, accessible, and maintainable

  Scenario: JSDoc on all exported items
    Given any exported component, function, interface, or type in Phase 3
    Then comprehensive JSDoc documentation is present

  Scenario: TypeScript strict mode compliance
    When the full Phase 3 codebase is type-checked with strict mode
    Then zero TypeScript errors are reported

  Scenario: ESLint compliance including a11y rules
    When the full Phase 3 codebase is linted
    Then zero ESLint errors are reported
    And jsx-a11y rules report zero violations

  Scenario: Unit test coverage meets threshold
    When test coverage is measured for Phase 3 code
    Then coverage is at least 80% for lines, functions, branches, and statements

  Scenario: All interactive elements are WCAG 2.2 AA compliant
    Given any interactive element in a Phase 3 component
    Then it is keyboard navigable
    And it has visible focus indicators
    And it meets color contrast requirements
    And it passes an axe-core audit

  Scenario: All animations respect prefers-reduced-motion
    Given prefers-reduced-motion is set to "reduce"
    When any Phase 3 component with animation renders
    Then the animation is disabled or replaced with a static alternative

  Scenario: All interactive touch targets meet 44x44px minimum
    Given any interactive element in a Phase 3 component
    Then the touch target is at least 44x44px
```
