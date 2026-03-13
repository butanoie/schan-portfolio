/**
 * HomePage POM — the portfolio home page (/).
 *
 * Provides locators and actions for the project list, progressive loading,
 * gallery images, video embeds, project tags, completion state, and the
 * project lightbox. Composes the ProjectLightbox sub-POM for lightbox
 * interactions.
 *
 * @module e2e/pages/HomePage
 */
import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProjectLightbox } from '../components/ProjectLightbox';

/** HomePage POM for the portfolio home route (/). */
export class HomePage extends BasePage {
  /** ProjectLightbox sub-POM for image lightbox interactions. */
  readonly lightbox: ProjectLightbox;

  /**
   * "Load more projects" button for progressive loading.
   *
   * Scoped via the ThoughtBubble's `aria-label` ("Load more projects button")
   * rather than by button text, because the button text changes to
   * "Loading projects..." / "Chargement des projets..." during fetch.
   * The ThoughtBubble's aria-label is hardcoded in English regardless of
   * locale, so this locator works for both English and French.
   *
   * Uses a DOM locator (not `getByRole('button')`) because the ThoughtBubble
   * has `role="img"`, which makes all children presentational and invisible
   * to ARIA role queries.
   */
  readonly loadMoreButton: Locator;

  /**
   * Completion thought bubble shown when all projects are loaded.
   *
   * The Footer renders a `ThoughtBubble` with `role="img"` and an
   * `aria-label` containing "All projects loaded" when `allLoaded` is true.
   * Scoped to `page` (not `mainContent`) because the bubble is in `<footer>`.
   */
  readonly completionBubble: Locator;

  /**
   * Initialize home page locators and compose the ProjectLightbox sub-POM.
   *
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    this.lightbox = new ProjectLightbox(page);
    // Scope to ThoughtBubble's aria-label (stable across loading states and locales)
    // then find the button inside it.
    this.loadMoreButton = page
      .getByRole('img', { name: /load more projects button/i })
      .locator('button');
    this.completionBubble = page.getByRole('img', {
      name: /all projects loaded/i,
    });
  }

  /**
   * Navigate to the home page.
   */
  async goto(): Promise<void> {
    await super.goto('/');
  }

  /**
   * Get all project section headings (h2 elements from ProjectDetail).
   *
   * @returns Locator for all project heading elements
   */
  projectSections(): Locator {
    return this.mainContent.getByRole('heading', { level: 2 });
  }

  /**
   * Get a specific project section container by index.
   *
   * Each `ProjectDetail` renders as `<section class="project-detail">`.
   * Use this to scope child queries (tags, video) to a specific project.
   *
   * **Selector exception:** Uses `.project-detail` CSS class instead of
   * a semantic ARIA selector because `<section>` without an accessible name
   * maps to `generic` role, not `region`. This parallels the legacy
   * `data-testid="project-gallery"` exception in `galleryImages()`.
   *
   * @param projectIndex - Zero-based index of the project
   * @returns Locator for the project section element
   */
  projectSection(projectIndex: number): Locator {
    return this.mainContent.locator('.project-detail').nth(projectIndex);
  }

  /**
   * Get gallery images within a specific project section.
   *
   * Uses the legacy `data-testid="project-gallery"` for scoping
   * (see architecture note on data-testid).
   *
   * @param projectIndex - Zero-based index of the project
   * @returns Locator for images within the project's gallery
   */
  galleryImages(projectIndex: number): Locator {
    return this.page
      .locator('[data-testid="project-gallery"]')
      .nth(projectIndex)
      .getByRole('img');
  }

  /**
   * Get tag chips within a specific project section.
   *
   * Tags are rendered as MUI `Chip` components inside `ProjectTagsContainer`.
   * Uses `.MuiChip-root` class selector since Chips have no semantic ARIA role.
   *
   * @param projectIndex - Zero-based index of the project
   * @returns Locator for all Chip elements within the project section
   */
  projectTags(projectIndex: number): Locator {
    return this.projectSection(projectIndex).locator('.MuiChip-root');
  }

  /**
   * Get the Vimeo video embed iframe within a specific project section.
   *
   * The `VideoEmbed` component renders an `<iframe>` with a `title`
   * attribute (e.g., "Vimeo video player") for accessibility.
   *
   * @param projectIndex - Zero-based index of the project
   * @returns Locator for the iframe element within the project section
   */
  videoEmbed(projectIndex: number): Locator {
    return this.projectSection(projectIndex).locator('iframe');
  }

  /**
   * Get gallery thumbnail buttons within a specific project section.
   *
   * Each thumbnail image is wrapped in a `<button>` with an aria-label
   * like "View {caption} in lightbox". These are the keyboard-focusable
   * interactive elements that open the lightbox.
   *
   * @param projectIndex - Zero-based index of the project
   * @returns Locator for thumbnail buttons within the project's gallery
   */
  galleryThumbnailButtons(projectIndex: number): Locator {
    // Matches the `projectImage.viewInLightbox` aria-label across locales:
    //   en: "View {caption} in lightbox" → matches "lightbox"
    //   fr: "Afficher {caption} dans la visionneuse" → matches "visionneuse"
    // When adding a new locale, add its keyword to this regex.
    return this.page
      .locator('[data-testid="project-gallery"]')
      .nth(projectIndex)
      .getByRole('button', { name: /lightbox|visionneuse/i });
  }

  /**
   * Click a gallery thumbnail to open the lightbox.
   *
   * Clicks the specified thumbnail button and waits for the lightbox dialog
   * to become visible (accounts for `next/dynamic` chunk loading).
   *
   * @param projectIndex - Zero-based index of the project
   * @param imageIndex - Zero-based index of the image within the gallery
   */
  async openLightboxForImage(
    projectIndex: number,
    imageIndex: number
  ): Promise<void> {
    await this.galleryThumbnailButtons(projectIndex).nth(imageIndex).click();
    await this.lightbox.waitForOpen();
  }
}
