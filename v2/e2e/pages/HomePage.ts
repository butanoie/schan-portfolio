/**
 * HomePage POM — the portfolio home page (/).
 *
 * Provides locators and actions for the project list, progressive loading,
 * gallery images, and the project lightbox. Composes the ProjectLightbox
 * sub-POM for lightbox interactions.
 *
 * @module e2e/pages/HomePage
 */
import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProjectLightbox } from '../components/ProjectLightbox';

export class HomePage extends BasePage {
  /** ProjectLightbox sub-POM for image lightbox interactions. */
  readonly lightbox: ProjectLightbox;

  /** "Load more projects" button for progressive loading. */
  readonly loadMoreButton: Locator;

  constructor(page: Page) {
    super(page);
    this.lightbox = new ProjectLightbox(page);
    this.loadMoreButton = page.getByRole('button', { name: /load more/i });
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
   * Click a gallery thumbnail to open the lightbox.
   *
   * Clicks the specified image and waits for the lightbox dialog
   * to become visible (accounts for `next/dynamic` chunk loading).
   *
   * @param projectIndex - Zero-based index of the project
   * @param imageIndex - Zero-based index of the image within the gallery
   */
  async openLightboxForImage(
    projectIndex: number,
    imageIndex: number
  ): Promise<void> {
    await this.galleryImages(projectIndex).nth(imageIndex).click();
    await this.lightbox.waitForOpen();
  }
}
