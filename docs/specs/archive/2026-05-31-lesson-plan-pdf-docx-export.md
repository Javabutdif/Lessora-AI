# Spec: PDF and DOCX Export for Lesson Plans

## Purpose

Add professional PDF and DOCX export capabilities to the LessonPlanPreview screen, allowing users to export lesson plans in industry-standard formats with proper formatting, while maintaining backward compatibility with the existing HTML-based DOC export.

## Scope

- in scope:
  - PDF export using `expo-print` library
  - DOCX export using `docx` library
  - Professional formatting with consistent styling across all formats
  - UI for selecting export format (PDF, DOCX, or DOC)
  - Error handling for export failures
  - User feedback during export process (loading states, success/error toasts)
  - Cross-platform support (iOS and Android)
  - Backward compatibility with existing DOC export
- out of scope:
  - Web platform support
  - Cloud storage integration
  - Email sharing functionality
  - Custom font selection by users
  - Image embedding in documents
  - Batch export of multiple lesson plans
  - Document templates or themes
  - Export history tracking

## Proposed behavior

### Export Format Selection

When the user taps the export button, they will be presented with three format options:
1. **PDF** - Portable Document Format (recommended for viewing and printing)
2. **DOCX** - Microsoft Word format (recommended for editing)
3. **DOC** - Legacy HTML-based format (existing functionality)

The format selection will be implemented using React Native's ActionSheet or a custom modal with three clearly labeled buttons.

### PDF Export Workflow

1. User selects "Export as PDF" from format options
2. System shows loading indicator with "Generating PDF..." message
3. System uses `expo-print` to generate PDF from lesson plan content
4. PDF is saved to device cache directory
5. System opens native share sheet with the PDF file
6. Success toast displays: "PDF export ready: [filename].pdf"
7. User can share via any installed app (email, cloud storage, messaging, etc.)

### DOCX Export Workflow

1. User selects "Export as DOCX" from format options
2. System shows loading indicator with "Generating DOCX..." message
3. System uses `docx` library to create structured DOCX document
4. DOCX is saved to device cache directory
5. System opens native share sheet with the DOCX file
6. Success toast displays: "DOCX export ready: [filename].docx"
7. User can share via any installed app

### DOC Export Workflow (Existing)

1. User selects "Export as DOC" from format options
2. System maintains current HTML-based export behavior
3. Success toast displays: "DOC export prepared: [filename].doc"

### Document Formatting Specifications

All export formats must maintain consistent professional styling:

#### Typography
- **Title (H1)**: 24pt, Poppins Bold (or Arial Bold fallback), Navy (#1E3A8A)
- **Section Headings (H2)**: 18pt, Poppins Bold (or Arial Bold fallback), Navy (#1E3A8A)
- **Subsection Headings (H3)**: 16pt, Poppins SemiBold (or Arial Bold fallback), Navy (#1E3A8A)
- **Body Text**: 12pt, Poppins Regular (or Arial fallback), Dark Gray (#4B5563)
- **List Items**: 12pt, Poppins Regular (or Arial fallback), Dark Gray (#4B5563)

#### Spacing
- **Page Margins**: 1 inch (72pt) on all sides
- **Title Bottom Margin**: 24pt
- **Heading Top Margin**: 18pt (H2), 14pt (H3)
- **Heading Bottom Margin**: 12pt (H2), 10pt (H3)
- **Paragraph Bottom Margin**: 12pt
- **List Item Spacing**: 6pt between items
- **Line Height**: 1.5 for body text, 1.3 for headings

#### Lists
- **Bulleted Lists**: Use standard bullet points (•)
- **Numbered Lists**: Use decimal numbering (1., 2., 3.)
- **List Indentation**: 0.5 inch (36pt) from left margin
- **Nested Lists**: Not supported in current document structure

#### Page Layout
- **Page Size**: Letter (8.5" × 11")
- **Orientation**: Portrait
- **Header**: None
- **Footer**: Page numbers centered (for PDF only)

### Error Handling

The system must handle the following error scenarios:

1. **Library Initialization Failure**
   - Error: "Export feature unavailable"
   - Action: Log error, show toast, fall back to DOC export

2. **Insufficient Storage Space**
   - Error: "Not enough storage space"
   - Action: Show toast with suggestion to free up space

3. **File System Permission Denied**
   - Error: "Storage permission required"
   - Action: Show toast with instructions to grant permission

4. **Document Generation Failure**
   - Error: "Failed to generate [format]"
   - Action: Show toast with retry option

5. **Share Sheet Cancellation**
   - Behavior: Silent (no error), return to preview screen

### UI Changes

#### Current State
- Single "Export DOC" button at bottom of preview card
- Button shows loading state during export
- No format selection

#### New State
- "Export" button (without format suffix) at bottom of preview card
- Tapping button opens format selection interface
- Format selection shows three options with icons:
  - 📄 Export as PDF (recommended for viewing)
  - 📝 Export as DOCX (recommended for editing)
  - 📋 Export as DOC (legacy format)
- Each option shows loading state when selected
- Format selection can be dismissed by tapping outside or cancel button

## Acceptance criteria

- [x] User can select between PDF, DOCX, and DOC export formats
- [x] PDF exports are generated using `expo-print` with specified formatting
- [x] DOCX exports are generated using `docx` library with specified formatting
- [x] All formats maintain consistent typography and spacing
- [x] Export button opens format selection interface
- [x] Each format option shows appropriate loading state during export
- [x] Success toasts display correct filename and format
- [x] Error toasts display helpful messages for all error scenarios
- [x] Existing DOC export functionality works unchanged
- [x] PDF exports work correctly on iOS devices
- [x] PDF exports work correctly on Android devices
- [x] DOCX exports work correctly on iOS devices
- [x] DOCX exports work correctly on Android devices
- [x] Share sheet opens with correct file for each format
- [x] Exported files can be opened in respective applications
- [x] File naming follows pattern: `[slugified-title].[extension]`
- [x] Files are saved to cache directory (not permanent storage)

## Implementation Status

**Status:** ✅ Completed and Verified (2026-06-01)

All acceptance criteria have been met. The implementation is working correctly with:
- expo-print v13.0.1 (compatible with Expo SDK 54.0.0)
- docx v8.5.0 (works in React Native without polyfills)
- Build compiles successfully
- All three export formats functional on both platforms

## Constraints

- technical:
  - Must use `expo-print` for PDF generation (Expo SDK compatibility)
  - Must use `docx` library for DOCX generation
  - Must work with Expo SDK ~54.0.0
  - Must support React Native 0.81.5
  - Cannot use native modules that require custom native code
  - Must use Expo's managed workflow
  - Font embedding limited to system fonts or Expo-compatible fonts
- product:
  - Must maintain existing user experience for DOC export
  - Must not require additional user permissions beyond existing
  - Must provide clear feedback during export process
  - Export should complete within 5 seconds for typical lesson plans
- delivery:
  - Must be implemented in mobile app only (iOS and Android)
  - Must not break existing functionality
  - Must include error handling for all failure scenarios
  - Must be testable on both platforms before release

## Risks and open questions

- risk 1: `expo-print` may not support all desired formatting options (fonts, colors)
- risk 2: `docx` library may have large bundle size impact on app
- risk 3: PDF generation may be slow on older devices
- risk 4: DOCX files may not render identically across different Word versions
- risk 5: Font fallbacks may not match Poppins styling exactly
- question 1: Should we cache format preference for future exports?
- question 2: Should we add a "Preview" option before sharing?
- question 3: Should we support custom filename editing?
- question 4: Should we add analytics tracking for export format usage?

## Related docs

- plan: [`docs/plans/2026-05-31-lesson-plan-pdf-docx-export.md`](../plans/2026-05-31-lesson-plan-pdf-docx-export.md)
- task brief: [`docs/ai/tasks/2026-05-31-lesson-plan-pdf-docx-export.md`](../ai/tasks/2026-05-31-lesson-plan-pdf-docx-export.md)