# PDF and DOCX Export Implementation Plan

**Goal:** Add professional PDF and DOCX export functionality to the LessonPlanPreview screen with format selection UI, while maintaining backward compatibility with existing DOC export.

**Architecture:** Extend the existing export utility with new functions for PDF (using `expo-print`) and DOCX (using `docx` library) generation. Update the preview screen to include format selection UI (ActionSheet or modal) and route to appropriate export handler based on user choice.

**Tech Stack:** 
- `expo-print` for PDF generation
- `docx` library for DOCX generation
- React Native ActionSheet or custom modal for format selection
- Expo File System for file management
- React Native Share API for file distribution

---

## References

- spec: [`docs/specs/2026-05-31-lesson-plan-pdf-docx-export.md`](../specs/2026-05-31-lesson-plan-pdf-docx-export.md)
- task brief: [`docs/ai/tasks/2026-05-31-lesson-plan-pdf-docx-export.md`](../ai/tasks/2026-05-31-lesson-plan-pdf-docx-export.md)

## Steps

### Phase 1: Library Compatibility Verification

- [ ] **Step 1.1:** Check `expo-print` compatibility with Expo SDK 54.0.0
  - Visit npm page: https://www.npmjs.com/package/expo-print
  - Check Expo documentation: https://docs.expo.dev/versions/latest/sdk/print/
  - Verify SDK version compatibility in documentation
  - Note any known issues or limitations

- [ ] **Step 1.2:** Check `docx` library compatibility with React Native
  - Visit npm page: https://www.npmjs.com/package/docx
  - Check for React Native compatibility notes
  - Review GitHub issues for React Native-related problems
  - Identify any required polyfills or peer dependencies
  - Note bundle size impact (library is ~500KB)

- [ ] **Step 1.3:** Document compatibility findings
  - Create compatibility notes in task brief
  - Identify any blockers or workarounds needed
  - Determine if alternative libraries are needed

### Phase 2: Dependency Installation

- [ ] **Step 2.1:** Install `expo-print`
  ```bash
  cd client-side
  npx expo install expo-print
  ```

- [ ] **Step 2.2:** Install `docx` library
  ```bash
  npm install docx
  ```

- [ ] **Step 2.3:** Install any required polyfills (if needed based on Step 1.2)
  - Example: `buffer`, `stream`, etc. for Node.js APIs
  ```bash
  npm install buffer stream-browserify
  ```

- [ ] **Step 2.4:** Update `package.json` and verify installation
  - Confirm versions are added to dependencies
  - Run `npm install` to ensure clean install
  - Check for peer dependency warnings

- [ ] **Step 2.5:** Configure Metro bundler (if polyfills needed)
  - Update [`client-side/metro.config.js`](../../client-side/metro.config.js)
  - Add resolver configuration for Node.js polyfills
  - Example:
    ```javascript
    resolver: {
      extraNodeModules: {
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
      },
    }
    ```

### Phase 3: PDF Export Implementation

- [ ] **Step 3.1:** Create PDF export utility function in [`documentExport.ts`](../../client-side/src/utils/documentExport.ts)
  - Add function: `exportLessonPlanToPDF(document: LessonPlanDocument): Promise<ExportedLessonPlanDocument>`
  - Import `expo-print` and `expo-file-system`
  - Build HTML template with professional styling matching spec
  - Use `Print.printToFileAsync()` to generate PDF
  - Return file URI and metadata

- [ ] **Step 3.2:** Implement PDF HTML template builder
  - Create function: `buildPDFHtml(document: LessonPlanDocument): string`
  - Include CSS for typography (24pt title, 18pt H2, 16pt H3, 12pt body)
  - Set page margins (1 inch all sides)
  - Configure line heights (1.5 body, 1.3 headings)
  - Add spacing rules per spec
  - Use system fonts (Arial as fallback for Poppins)
  - Apply color scheme (Navy #1E3A8A, Dark Gray #4B5563)

- [ ] **Step 3.3:** Add PDF-specific formatting
  - Configure page size (Letter 8.5" × 11")
  - Add page numbers in footer (centered)
  - Ensure proper page breaks
  - Test with multi-page lesson plans

- [ ] **Step 3.4:** Add error handling for PDF generation
  - Wrap in try-catch block
  - Handle `Print.printToFileAsync()` failures
  - Handle file system errors
  - Return meaningful error messages

### Phase 4: DOCX Export Implementation

- [ ] **Step 4.1:** Create DOCX export utility function in [`documentExport.ts`](../../client-side/src/utils/documentExport.ts)
  - Add function: `exportLessonPlanToDOCX(document: LessonPlanDocument): Promise<ExportedLessonPlanDocument>`
  - Import `docx` library components (Document, Paragraph, TextRun, etc.)
  - Build document structure using `docx` API
  - Save to file system using `expo-file-system`
  - Return file URI and metadata

- [ ] **Step 4.2:** Implement DOCX document builder
  - Create function: `buildDOCXDocument(document: LessonPlanDocument): Document`
  - Configure document properties (title, creator, etc.)
  - Set page margins (1 inch all sides)
  - Configure default styles (fonts, sizes, colors)
  - Build sections with proper styling

- [ ] **Step 4.3:** Map lesson plan blocks to DOCX elements
  - Title (H1): Heading1 style, 24pt, bold, Navy color
  - Section headings (H2): Heading2 style, 18pt, bold, Navy color
  - Subsection headings (H3): Heading3 style, 16pt, semibold, Navy color
  - Paragraphs: Normal style, 12pt, Dark Gray color
  - Bulleted lists: Bullet list style with proper indentation
  - Numbered lists: Numbered list style with decimal numbering

- [ ] **Step 4.4:** Handle DOCX file generation and saving
  - Use `Packer.toBuffer()` to generate DOCX buffer
  - Convert buffer to base64 for React Native compatibility
  - Write to cache directory using `FileSystem.writeAsStringAsync()`
  - Generate proper filename with `.docx` extension

- [ ] **Step 4.5:** Add error handling for DOCX generation
  - Wrap in try-catch block
  - Handle `docx` library errors
  - Handle file system errors
  - Handle buffer conversion errors
  - Return meaningful error messages

### Phase 5: Format Selection UI

- [ ] **Step 5.1:** Create format selection component
  - Option A: Use React Native ActionSheet (iOS-style)
  - Option B: Create custom modal component
  - Decision: Use custom modal for consistent cross-platform UX

- [ ] **Step 5.2:** Implement ExportFormatModal component
  - Create new file: `client-side/src/components/ui/ExportFormatModal.tsx`
  - Props: `visible: boolean`, `onClose: () => void`, `onSelectFormat: (format: 'pdf' | 'docx' | 'doc') => void`
  - UI: Three buttons with icons and descriptions
    - 📄 Export as PDF (recommended for viewing)
    - 📝 Export as DOCX (recommended for editing)
    - 📋 Export as DOC (legacy format)
  - Styling: Match existing app design (glass card, rounded corners)
  - Accessibility: Proper labels and roles

- [ ] **Step 5.3:** Add modal animations
  - Fade in/out animation for backdrop
  - Slide up animation for modal content
  - Use `react-native-reanimated` if available, otherwise `Animated` API

- [ ] **Step 5.4:** Add modal dismiss behavior
  - Tap outside to dismiss
  - Cancel button to dismiss
  - Back button (Android) to dismiss

### Phase 6: Screen Integration

- [ ] **Step 6.1:** Update [`LessonPlanPreviewScreen.tsx`](../../client-side/src/screens/Dashboard/LessonPlanPreviewScreen.tsx)
  - Import new export functions and modal component
  - Add state for modal visibility: `const [showExportModal, setShowExportModal] = useState(false)`
  - Add state for export format: `const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'doc' | null>(null)`

- [ ] **Step 6.2:** Update export button
  - Change button text from "Export DOC" to "Export"
  - Update `onPress` to open modal: `onPress={() => setShowExportModal(true)}`
  - Keep loading state logic

- [ ] **Step 6.3:** Implement format-specific export handlers
  - Create `handleExportPDF()` function
  - Create `handleExportDOCX()` function
  - Keep existing `handleExport()` for DOC format
  - Each handler should:
    - Set loading state
    - Call appropriate export function
    - Open share sheet with result
    - Show success toast
    - Handle errors with error toast
    - Clear loading state

- [ ] **Step 6.4:** Connect modal to export handlers
  - Add `onSelectFormat` callback to modal
  - Route to appropriate handler based on format
  - Close modal after selection
  - Show loading indicator during export

- [ ] **Step 6.5:** Update loading states
  - Show format-specific loading messages:
    - "Generating PDF..."
    - "Generating DOCX..."
    - "Exporting DOC..."
  - Disable modal during export
  - Show spinner in button

### Phase 7: Error Handling and User Feedback

- [ ] **Step 7.1:** Implement comprehensive error handling
  - Library initialization errors
  - File system permission errors
  - Insufficient storage errors
  - Document generation errors
  - Share sheet errors

- [ ] **Step 7.2:** Add user-friendly error messages
  - "Export feature unavailable" (library error)
  - "Not enough storage space" (storage error)
  - "Storage permission required" (permission error)
  - "Failed to generate [format]" (generation error)
  - Include actionable suggestions in error toasts

- [ ] **Step 7.3:** Add success feedback
  - Toast message: "PDF export ready: [filename].pdf"
  - Toast message: "DOCX export ready: [filename].docx"
  - Toast message: "DOC export prepared: [filename].doc"
  - Include filename in success message

- [ ] **Step 7.4:** Handle edge cases
  - Empty lesson plan (no blocks)
  - Very long lesson plans (performance)
  - Special characters in title (filename sanitization)
  - Network interruption during export (if applicable)

### Phase 8: Testing

- [ ] **Step 8.1:** Test PDF export on iOS
  - Generate PDF from sample lesson plan
  - Verify formatting matches spec
  - Open PDF in Files app
  - Share PDF via email/messaging
  - Test with long lesson plan (multiple pages)
  - Test with special characters in title

- [ ] **Step 8.2:** Test PDF export on Android
  - Generate PDF from sample lesson plan
  - Verify formatting matches spec
  - Open PDF in file manager
  - Share PDF via email/messaging
  - Test with long lesson plan (multiple pages)
  - Test with special characters in title

- [ ] **Step 8.3:** Test DOCX export on iOS
  - Generate DOCX from sample lesson plan
  - Verify formatting matches spec
  - Open DOCX in Microsoft Word (if available)
  - Share DOCX via email/messaging
  - Test with long lesson plan
  - Test with special characters in title

- [ ] **Step 8.4:** Test DOCX export on Android
  - Generate DOCX from sample lesson plan
  - Verify formatting matches spec
  - Open DOCX in Microsoft Word (if available)
  - Share DOCX via email/messaging
  - Test with long lesson plan
  - Test with special characters in title

- [ ] **Step 8.5:** Test DOC export (backward compatibility)
  - Verify existing DOC export still works
  - Confirm no regression in functionality
  - Test on both platforms

- [ ] **Step 8.6:** Test format selection UI
  - Open modal and verify all options visible
  - Test modal dismiss (tap outside, cancel button)
  - Test format selection flow
  - Verify loading states during export
  - Test on both platforms

- [ ] **Step 8.7:** Test error scenarios
  - Simulate low storage (if possible)
  - Test with invalid document data
  - Test share sheet cancellation
  - Verify error messages are helpful

- [ ] **Step 8.8:** Performance testing
  - Measure export time for typical lesson plan
  - Test on older devices (if available)
  - Monitor memory usage during export
  - Verify no memory leaks

### Phase 9: Documentation and Cleanup

- [ ] **Step 9.1:** Add code comments
  - Document export functions with JSDoc
  - Explain complex formatting logic
  - Note any workarounds or limitations

- [ ] **Step 9.2:** Update type definitions
  - Add types for export formats
  - Update `ExportedLessonPlanDocument` interface if needed
  - Ensure TypeScript compilation succeeds

- [ ] **Step 9.3:** Update README (if applicable)
  - Document new export features
  - List supported formats
  - Note any platform-specific behavior

- [ ] **Step 9.4:** Clean up unused code
  - Remove debug logs
  - Remove commented code
  - Verify no unused imports

## Validation

- [ ] Run TypeScript compilation: `cd client-side && npx tsc --noEmit`
- [ ] Test on iOS device or simulator
- [ ] Test on Android device or emulator
- [ ] Verify all export formats work correctly
- [ ] Verify backward compatibility with DOC export
- [ ] Verify error handling covers all scenarios
- [ ] Verify UI matches design specifications
- [ ] Code review for best practices and maintainability

## Risks

- risk 1: `expo-print` may not support custom fonts (Poppins) - **Mitigation:** Use system fonts (Arial) as fallback
- risk 2: `docx` library may increase bundle size significantly - **Mitigation:** Monitor bundle size, consider lazy loading if needed
- risk 3: PDF generation may be slow on older devices - **Mitigation:** Show clear loading indicator, optimize HTML template
- risk 4: DOCX files may not render identically in all Word versions - **Mitigation:** Test with multiple Word versions, document known issues
- risk 5: React Native compatibility issues with `docx` library - **Mitigation:** Test early, have fallback plan to use alternative library or web-based generation
- risk 6: File system permissions may be denied on some devices - **Mitigation:** Handle gracefully with clear error messages and instructions

## Rollback Strategy

If critical issues are discovered after implementation:

1. **Immediate rollback:** Revert changes to [`LessonPlanPreviewScreen.tsx`](../../client-side/src/screens/Dashboard/LessonPlanPreviewScreen.tsx) to restore original "Export DOC" button
2. **Keep utilities:** Leave new export functions in [`documentExport.ts`](../../client-side/src/utils/documentExport.ts) for future use
3. **Remove dependencies:** Optionally remove `expo-print` and `docx` from `package.json` if bundle size is a concern
4. **Document issues:** Add notes to task brief about what went wrong and what needs to be fixed

## Handoff notes

- The implementation should be done incrementally, testing each phase before moving to the next
- PDF export should be implemented and tested first (simpler than DOCX)
- DOCX export can be implemented independently after PDF is working
- Format selection UI should be implemented last, after both export functions are working
- All new code should follow existing code style and patterns in the project
- Use existing UI components (Button, Toast) for consistency
- Test thoroughly on both platforms before considering the task complete
- Document any platform-specific quirks or limitations discovered during implementation