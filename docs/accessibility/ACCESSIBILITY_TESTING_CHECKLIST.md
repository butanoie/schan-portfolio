# Accessibility Testing Checklist

**Date:** February 6, 2026
**WCAG Standard:** WCAG 2.2 Level AA
**Website:** https://portfolio.singchan.com

---

## Quick Reference

This checklist provides step-by-step instructions for manually testing accessibility on the portfolio website. Use this alongside automated testing to ensure comprehensive accessibility compliance.

**Test Duration:** ~30-45 minutes for complete manual testing

---

## Pre-Testing Setup

### Browser and Tools

- [ ] Open the website in a modern browser (Chrome, Firefox, Safari, or Edge)
- [ ] Install browser accessibility extensions:
  - [ ] axe DevTools (https://www.deque.com/axe/devtools/)
  - [ ] WAVE (https://wave.webaim.org/extension/)
- [ ] Have DevTools open for inspection
- [ ] Prepare testing notes/results document

### Test Environment

- [ ] Clear browser cache to see fresh page load
- [ ] Disable browser extensions (except accessibility tools)
- [ ] Test on both desktop and mobile devices
- [ ] Test in multiple browsers (minimum 2)
- [ ] Test in all available themes (Light, Dark, High Contrast)

### Documentation

**Results Template:**
```markdown
# Accessibility Test Results - [DATE]

## Browser: [Browser Name] [Version]
## Theme: [Light/Dark/High Contrast]
## Tester: [Name]

### Keyboard Navigation
- [ ] Tab through entire site
- [ ] All interactive elements reachable
- [ ] Tab order logical
- [ ] No keyboard traps

**Issues Found:** [None/List issues]

### Visual Testing
- [ ] Focus indicators visible
- [ ] Contrast sufficient
- [ ] Touch targets adequate
- [ ] Text readable at 200% zoom

**Issues Found:** [None/List issues]

### Overall Status
- [ ] PASSED
- [ ] FAILED - [Issues listed below]
```

---

## Section 1: Keyboard Navigation Testing

### 1.1 Basic Keyboard Navigation

**Goal:** Verify all interactive elements are accessible via keyboard

**Steps:**

1. [ ] Press **Tab** key repeatedly from page top to bottom
   - Note each element that receives focus
   - Verify order is logical (left-to-right, top-to-bottom)
   - Check that focus indicator is visible on each element

2. [ ] Press **Shift+Tab** to navigate backwards
   - Verify tab order is reversed
   - All elements reachable in both directions

3. [ ] Test **Home** and **End** keys
   - Should move to beginning/end of page
   - If in a list or menu, should move to start/end of list

4. [ ] Look for keyboard traps
   - No element should trap focus indefinitely
   - If trapped, Escape key should release (e.g., in modals)

**Expected Results:**
- [ ] All interactive elements receive focus
- [ ] Focus order follows visual layout
- [ ] No keyboard traps found
- [ ] Focus indicators visible throughout

**Issues Found:** ________________

---

### 1.2 Header Navigation

**Goal:** Test Header component accessibility

**Location:** Top of page

**Steps:**

1. [ ] Tab to Header area
   - Verify focus indicators appear on:
     - [ ] Navigation links
     - [ ] LinkedIn icon button
     - [ ] GitHub icon button
     - [ ] Settings button

2. [ ] Test Logo/Title
   - [ ] Tab reaches logo (if link)
   - [ ] Label appropriate
   - [ ] Link destination correct

3. [ ] Test LinkedIn Button
   - [ ] Tab reaches button
   - [ ] Focus indicator visible
   - [ ] Button size adequate (44×44px minimum)
   - [ ] Press **Enter** or **Space** to activate
   - [ ] Opens LinkedIn profile

4. [ ] Test GitHub Button
   - [ ] Tab reaches button
   - [ ] Focus indicator visible
   - [ ] Button size adequate
   - [ ] Activates correctly

5. [ ] Test Settings Button
   - [ ] Tab reaches button
   - [ ] Press **Space** or **Enter** opens menu
   - [ ] Menu focuses automatically (optional)
   - [ ] Press **Escape** closes menu
   - [ ] Focus returns to Settings button

**Expected Results:**
- [ ] All header elements keyboard navigable
- [ ] All buttons respond to Enter/Space
- [ ] Settings menu opens/closes with keyboard
- [ ] Focus returns appropriately

**Issues Found:** ________________

---

### 1.3 Main Content Navigation

**Goal:** Test main content area navigation

**Steps:**

1. [ ] Skip to Main Content (if available)
   - [ ] Press Tab immediately on page load
   - [ ] First focusable element should be "Skip to main content" link
   - [ ] Pressing Enter skips to main content
   - [ ] Focus moves to main area directly

2. [ ] Tab through projects/content
   - [ ] All links reachable via Tab
   - [ ] Tab order logical
   - [ ] Load More button (if present) reachable and functional

3. [ ] Test Project Lightbox
   - [ ] Tab to project image
   - [ ] Press **Enter** or **Space** to open lightbox
   - [ ] [ ] Arrow keys navigate images (if supported)
   - [ ] Press **Escape** to close lightbox
   - [ ] Focus returns to project image

**Expected Results:**
- [ ] All content navigable via keyboard
- [ ] Interactive images functional
- [ ] Lightbox keyboard operable

**Issues Found:** ________________

---

### 1.4 Settings Menu Navigation

**Goal:** Test Settings menu keyboard functionality

**Steps:**

1. [ ] Open Settings menu
   - [ ] Tab to Settings button
   - [ ] Press Enter/Space to open

2. [ ] Test Theme Selector
   - [ ] Use **Tab** to move between theme buttons
   - [ ] Use **Arrow keys** to navigate theme options
   - [ ] Press **Enter** or **Space** to select theme
   - [ ] Selected theme has visual indicator (ARIA pressed state)
   - [ ] Selected theme applies immediately

3. [ ] Test Language Selector
   - [ ] Use Tab/Arrow keys to navigate
   - [ ] Press Enter/Space to select language
   - [ ] Page language changes immediately
   - [ ] Content updates to selected language

4. [ ] Test Animations Toggle
   - [ ] Tab to toggle switch
   - [ ] Press **Space** or **Enter** to toggle
   - [ ] Toggle state changes visually
   - [ ] Animation behavior respects setting

5. [ ] Close Settings Menu
   - [ ] Press **Escape** to close menu
   - [ ] Focus returns to Settings button
   - [ ] Menu closes

**Expected Results:**
- [ ] All settings keyboard operable
- [ ] Settings apply immediately
- [ ] Menu closes with Escape
- [ ] Focus management correct

**Issues Found:** ________________

---

### 1.5 Footer Navigation

**Goal:** Test footer links and content

**Steps:**

1. [ ] Tab to Footer area
   - [ ] All footer links reachable
   - [ ] Tab order correct within footer

2. [ ] Test Footer Links
   - [ ] All links labeled clearly
   - [ ] Links lead to correct destinations
   - [ ] External links indicated (if applicable)

3. [ ] Test Social Links (if in footer)
   - [ ] Icons have accessible labels
   - [ ] Buttons activate correctly

**Expected Results:**
- [ ] All footer content keyboard accessible
- [ ] Link destinations correct
- [ ] No keyboard traps

**Issues Found:** ________________

---

### 1.6 Edge Cases

**Goal:** Test special keyboard scenarios

**Steps:**

1. [ ] Test with Screen Reader (optional)
   - If NVDA/JAWS available:
   - [ ] Screen reader announces all elements
   - [ ] Announcements match visual content
   - [ ] Button roles announced correctly

2. [ ] Test Focus Visibility in Different Themes
   - [ ] Light theme: Focus indicator visible
   - [ ] Dark theme: Focus indicator visible
   - [ ] High contrast theme: Focus indicator prominent

3. [ ] Test Rapid Tab Navigation
   - [ ] Tab rapidly through site
   - [ ] Focus updates smoothly
   - [ ] No performance issues
   - [ ] No focus jumps

**Expected Results:**
- [ ] Screen reader integration works
- [ ] Focus visible in all themes
- [ ] Performance acceptable

**Issues Found:** ________________

---

## Section 2: Visual Testing

### 2.1 Color Contrast Testing

**Tools Needed:**
- WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
- Browser DevTools color picker
- Browser accessibility inspector

**Steps:**

1. [ ] Test Text Contrast - Light Mode
   - [ ] Use DevTools to pick main text color
   - [ ] Compare to background color
   - [ ] Result should be ≥ 4.5:1 (normal text)
   - Record ratio: ___:___

2. [ ] Test Text Contrast - Dark Mode
   - [ ] Switch to Dark theme
   - [ ] Test main text color
   - [ ] Result should be ≥ 4.5:1
   - Record ratio: ___:___

3. [ ] Test Text Contrast - High Contrast Mode
   - [ ] Switch to High Contrast theme
   - [ ] Test main text color
   - [ ] Result should be ≥ 4.5:1
   - Record ratio: ___:___

4. [ ] Test Link Colors
   - [ ] Compare link colors to background
   - [ ] Normal state: ≥ 4.5:1 contrast
   - [ ] Hover state: ≥ 4.5:1 contrast
   - All themes: ✓

5. [ ] Test Button Colors
   - [ ] Button background to text: ≥ 4.5:1
   - [ ] Button border to background: ≥ 3:1
   - All button states tested

6. [ ] Test Secondary Text
   - [ ] Subtitle/description text: ≥ 4.5:1
   - [ ] All themes tested

**Expected Results:**
- [ ] All text contrast ≥ 4.5:1
- [ ] All UI components ≥ 3:1 contrast
- [ ] Consistency across all themes

**Issues Found:** ________________

---

### 2.2 Focus Indicator Testing

**Goal:** Verify focus indicators visible in all themes

**Steps:**

1. [ ] Light Theme Focus Testing
   - [ ] Enable Light mode in Settings
   - [ ] Tab through all interactive elements
   - [ ] Focus outline visible on every element
   - [ ] Outline color contrasts with background
   - [ ] Outline width adequate (≥ 2px recommended)

2. [ ] Dark Theme Focus Testing
   - [ ] Switch to Dark mode
   - [ ] Repeat focus visibility checks
   - [ ] Focus indicator visible throughout

3. [ ] High Contrast Theme Focus Testing
   - [ ] Switch to High Contrast mode
   - [ ] Focus indicator prominent
   - [ ] Exceeds minimum requirements

4. [ ] Focus Indicator Consistency
   - [ ] All buttons have consistent focus style
   - [ ] All links have consistent focus style
   - [ ] All inputs have consistent focus style

**Expected Results:**
- [ ] Focus visible in all themes
- [ ] High contrast focus indicators
- [ ] Consistent focus styling

**Issues Found:** ________________

---

### 2.3 Touch Target Size Testing

**Goal:** Verify interactive elements meet 44×44px minimum

**Steps:**

1. [ ] Inspect Button Sizes (DevTools)
   - [ ] Header buttons (LinkedIn, GitHub, Settings)
   - [ ] Settings menu buttons
   - [ ] Theme selector buttons
   - [ ] Language selector buttons
   - [ ] Animation toggle

   For each button:
   - [ ] Right-click → Inspect
   - [ ] Check computed size in DevTools
   - [ ] Record: Width × Height
   - [ ] Verify: ≥ 44×44px

2. [ ] Mobile Touch Testing (if available)
   - [ ] Test on actual mobile device (phone/tablet)
   - [ ] Buttons easily tappable
   - [ ] No accidental taps of nearby buttons
   - [ ] Spacing between targets adequate

3. [ ] Link Size Testing
   - [ ] Navigation links adequate size
   - [ ] Footer links tappable on mobile
   - [ ] Social media links in header adequate

**Expected Results:**
- [ ] All interactive elements ≥ 44×44px
- [ ] Mobile touch targets adequate
- [ ] No spacing issues

**Issues Found:** ________________

---

### 2.4 Zoom and Scaling Testing

**Goal:** Test readability at 200% zoom

**Steps:**

1. [ ] Browser Zoom at 100%
   - [ ] Content readable
   - [ ] Layout intact
   - [ ] No text cutoff

2. [ ] Browser Zoom at 150%
   - [ ] Content readable
   - [ ] Layout adapts (single column if needed)
   - [ ] No horizontal scroll unless necessary

3. [ ] Browser Zoom at 200%
   - [ ] Content still readable
   - [ ] Layout reflows properly
   - [ ] All functionality still accessible
   - [ ] Text doesn't overlap

4. [ ] Test in All Themes at 200%
   - [ ] Light mode readable
   - [ ] Dark mode readable
   - [ ] High contrast readable

**Expected Results:**
- [ ] Content readable at 200% zoom
- [ ] No loss of functionality
- [ ] Proper layout reflow

**Issues Found:** ________________

---

### 2.5 Image and Icon Testing

**Goal:** Verify images have proper alt text and contrast

**Steps:**

1. [ ] Inspect Project Images
   - [ ] All images have alt text (DevTools → alt attribute)
   - [ ] Alt text describes image content
   - [ ] Alt text is not redundant with visible text

2. [ ] Check Icon Buttons
   - [ ] All icon buttons have aria-label or visible label
   - [ ] Labels describe button action
   - [ ] Icons have sufficient contrast (≥ 3:1)

3. [ ] Test Image Opacity
   - [ ] Project thumbnails visible (not too faded)
   - [ ] Thumbnails have adequate contrast
   - [ ] Hover states distinguish clearly

**Expected Results:**
- [ ] All images have meaningful alt text
- [ ] Icon buttons properly labeled
- [ ] Images have adequate contrast

**Issues Found:** ________________

---

## Section 3: Automated Testing with Browser Extensions

### 3.1 axe DevTools Testing

**Goal:** Run axe automated accessibility audit

**Installation:** https://www.deque.com/axe/devtools/

**Steps:**

1. [ ] Open axe DevTools
   - [ ] Open DevTools (F12)
   - [ ] Click axe DevTools tab
   - [ ] Click "Scan ALL of my page"

2. [ ] Review Results
   - [ ] **Expected: 0 violations**
   - [ ] **Expected: 0 critical issues**
   - [ ] Record any violations found

3. [ ] Test Each Page State
   - [ ] Home page
   - [ ] With Settings menu open
   - [ ] With Lightbox open (if applicable)
   - [ ] All different themes

4. [ ] Document Results
   - [ ] Screenshot results if violations found
   - [ ] Record violation details
   - [ ] Severity level noted

**Expected Results:**
- [ ] 0 Critical violations
- [ ] 0 Serious violations
- [ ] 0 Moderate violations (ideally)
- [ ] Any minor issues documented

**axe Results:**
```
Date: ________
Browser: ________
Violations: ________
Critical: [ ] 0 violations
Serious: [ ] 0 violations
```

**Issues Found:** ________________

---

### 3.2 WAVE Testing

**Goal:** Run WAVE accessibility evaluation

**Installation:** https://wave.webaim.org/extension/

**Steps:**

1. [ ] Open WAVE
   - [ ] Click WAVE extension icon
   - [ ] Review results panel

2. [ ] Review Errors (Red)
   - [ ] **Expected: 0 errors**
   - [ ] Record any errors found
   - [ ] Error type: ___________

3. [ ] Review Warnings (Yellow)
   - [ ] Review for false positives
   - [ ] Acceptable warnings documented
   - [ ] Recommend fixes if needed

4. [ ] Check Structure Report
   - [ ] Heading hierarchy correct
   - [ ] Landmarks present (header, nav, main, footer)
   - [ ] List structures correct

**Expected Results:**
- [ ] 0 Errors detected
- [ ] Few or no warnings
- [ ] Proper landmark structure
- [ ] Correct heading hierarchy

**WAVE Results:**
```
Date: ________
Browser: ________
Errors: ________
Warnings: ________
Landmarks: ________
```

**Issues Found:** ________________

---

### 3.3 Lighthouse Testing

**Goal:** Run Google Lighthouse accessibility audit

**Steps:**

1. [ ] Open Chrome DevTools
   - [ ] Press F12
   - [ ] Click "Lighthouse" tab
   - [ ] Select "Accessibility"
   - [ ] Click "Analyze page load"

2. [ ] Review Results
   - [ ] **Expected: 100/100 score**
   - [ ] Record actual score: ___/100

3. [ ] Review Failed Audits
   - [ ] Any failures documented
   - [ ] Severity assessed
   - [ ] Remediation planned if needed

4. [ ] Test All Themes
   - [ ] Light mode audit
   - [ ] Dark mode audit
   - [ ] High contrast audit

**Expected Results:**
- [ ] Accessibility score: 100/100
- [ ] All audits passed
- [ ] No failed accessibility tests

**Lighthouse Results:**
```
Light Mode: ___/100
Dark Mode: ___/100
High Contrast: ___/100
Average: ___/100
```

**Issues Found:** ________________

---

## Section 4: Screen Reader Testing (Optional but Recommended)

**Note:** This section requires a screen reader. NVDA (Windows) is free and recommended.

### 4.1 Setup

- [ ] Download and install screen reader
  - NVDA: https://www.nvaccess.org/download/
  - JAWS: https://www.freedomscientific.com/products/software/jaws/
  - VoiceOver: Built-in on Mac/iOS

- [ ] Test in quiet environment
- [ ] Document findings

### 4.2 Basic Screen Reader Testing

1. [ ] Enable screen reader
   - NVDA: Ctrl+Alt+N
   - VoiceOver: Cmd+F5 (Mac)
   - Browser VoiceOver: Cmd+Option+U

2. [ ] Listen to Page Title
   - [ ] Page title announced correctly
   - [ ] Indicates what site is

3. [ ] Navigate by Headings
   - [ ] Use **H** key to move between headings
   - [ ] Heading structure clear
   - [ ] Headings make sense

4. [ ] Navigate by Links
   - [ ] Use **K** key to move between links
   - [ ] Link purposes clear from text
   - [ ] No "click here" or "link" links

5. [ ] Navigate by Buttons
   - [ ] Use **B** key to move between buttons
   - [ ] Button purposes announced
   - [ ] Button states announced

6. [ ] Test Form Fields
   - [ ] Labels announced with inputs
   - [ ] Required fields indicated
   - [ ] Error messages clear

**Expected Results:**
- [ ] All content announced properly
- [ ] Navigation elements clear
- [ ] Form usage intuitive
- [ ] No confusing announcements

**Issues Found:** ________________

---

## Section 5: Browser Compatibility Testing

### Supported Browsers

Test in each browser (minimum screen size 1024×768):

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome | Latest | [ ] | [ ] | [ ] Pass |
| Firefox | Latest | [ ] | [ ] | [ ] Pass |
| Safari | Latest | [ ] | [ ] | [ ] Pass |
| Edge | Latest | [ ] | [ ] | [ ] Pass |

### 5.1 Chrome/Chromium Testing

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] All colors render correctly
- [ ] Touch targets adequate
- [ ] Zoom at 200% works
- [ ] All features functional

**Result:** ☐ PASS ☐ FAIL

---

### 5.2 Firefox Testing

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] All colors render correctly
- [ ] Touch targets adequate
- [ ] Zoom at 200% works
- [ ] All features functional

**Result:** ☐ PASS ☐ FAIL

---

### 5.3 Safari Testing

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] All colors render correctly
- [ ] Touch targets adequate
- [ ] Zoom at 200% works
- [ ] All features functional

**Result:** ☐ PASS ☐ FAIL

---

### 5.4 Mobile Browser Testing

**Device:** ________________
**Browser:** ________________

- [ ] Touch targets easily tappable
- [ ] Text readable without horizontal scroll
- [ ] Forms functional
- [ ] All interactive elements work
- [ ] No performance issues

**Result:** ☐ PASS ☐ FAIL

---

## Section 6: Theme Testing

### 6.1 Light Theme

- [ ] Text color: Dark on light background
- [ ] Contrast adequate (≥ 4.5:1)
- [ ] Links distinguishable
- [ ] Focus indicators visible
- [ ] Images visible (not too bright)

**Status:** ☐ PASS ☐ FAIL

---

### 6.2 Dark Theme

- [ ] Text color: Light on dark background
- [ ] Contrast adequate (≥ 4.5:1)
- [ ] Links distinguishable
- [ ] Focus indicators visible
- [ ] Images visible (not too dark)

**Status:** ☐ PASS ☐ FAIL

---

### 6.3 High Contrast Theme

- [ ] Maximum contrast applied
- [ ] All elements clearly distinguishable
- [ ] Focus indicators prominent
- [ ] Text highly readable

**Status:** ☐ PASS ☐ FAIL

---

## Section 7: Summary and Results

### Overall Test Results

**Test Date:** _______________
**Tester Name:** _______________
**Browser(s) Tested:** _______________

### Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Keyboard Navigation | ☐ PASS ☐ FAIL | |
| Focus Indicators | ☐ PASS ☐ FAIL | |
| Color Contrast | ☐ PASS ☐ FAIL | |
| Touch Targets | ☐ PASS ☐ FAIL | |
| Zoom at 200% | ☐ PASS ☐ FAIL | |
| axe DevTools | ☐ PASS ☐ FAIL | Violations: ___ |
| WAVE | ☐ PASS ☐ FAIL | Errors: ___ |
| Lighthouse | ☐ PASS ☐ FAIL | Score: ___/100 |
| Screen Reader | ☐ PASS ☐ FAIL ☐ N/A | |
| Browser Compatibility | ☐ PASS ☐ FAIL | |
| All Themes | ☐ PASS ☐ FAIL | |

### Issues Found

**Critical Issues:** _____
1. ________________________________________
2. ________________________________________

**Major Issues:** _____
1. ________________________________________
2. ________________________________________

**Minor Issues:** _____
1. ________________________________________
2. ________________________________________

### Final Assessment

**Overall Status:** ☐ PASS ☐ FAIL

**Recommendation:**
- [ ] Ready for production (no critical issues)
- [ ] Address issues before release
- [ ] Schedule follow-up testing

**Notes:**
_____________________________________________

---

## Additional Resources

### Testing Tools

- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/
- **Lighthouse:** Built into Chrome DevTools
- **NVDA Screen Reader:** https://www.nvaccess.org/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/

### WCAG References

- **WCAG 2.2 Quickref:** https://www.w3.org/WAI/WCAG22/quickref/
- **WCAG Compliance Guide:** [WCAG_COMPLIANCE_GUIDE.md](WCAG_COMPLIANCE_GUIDE.md)
- **Accessibility Statement:** [ACCESSIBILITY_STATEMENT.md](ACCESSIBILITY_STATEMENT.md)

### Developer Resources

- **Testing Guide:** [ACCESSIBILITY_TESTING.md](ACCESSIBILITY_TESTING.md)
- **Test Files:** `/v2/src/__tests__/`
- **Component Documentation:** WCAG_COMPLIANCE_GUIDE.md

---

**Last Updated:** February 6, 2026
**WCAG Standard:** 2.2 Level AA
**Test Frequency:** Quarterly or after major changes
