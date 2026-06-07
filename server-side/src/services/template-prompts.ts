import type { GenerateLessonPlanRequest } from "./openai.service";

export type LessonPlanTemplateId =
  | "detailed-lesson-plan"
  | "daily-lesson-log"
  | "matatag";

export function buildTemplatePrompt(
  request: GenerateLessonPlanRequest,
  _user: any,
): string {
  const templateId = request.templateId || "lessora-ai";

  if (templateId === "detailed-lesson-plan") {
    return buildDetailedLessonPlanPrompt(request);
  }

  if (templateId === "daily-lesson-log") {
    return buildDailyLessonLogPrompt(request);
  }

  if (templateId === "matatag") {
    return buildMatatagPrompt(request);
  }

  throw new Error(
    `Unsupported template for shared template helper: ${templateId}. Lessora AI and DepEd prompts are handled in openai.service.ts.`,
  );
}

function buildDetailedLessonPlanPrompt(request: GenerateLessonPlanRequest) {
  return [
    ...buildCriticalPromptPreamble(request),
    `Template focus: Detailed Lesson Plan.`,
    `Follow the section order and block structure exactly.`,
    `Topic / Subject: ${request.title}`,
    `Subject: ${request.subject}`,
    `Grade Level: ${request.gradeLevel}`,
    `Duration: ${request.duration} minutes`,
    `Language: ${request.language || "english"}`,
    request.userDraftText
      ? `Teacher Notes: ${request.userDraftText}`
      : "Teacher Notes: Not provided",
    `Required sections: Objectives, Content, Learning Resources, Procedures, Reflection.`,
    `The Procedures section must be detailed, classroom-ready, and step-by-step.`,
    `The Reflection section must include teacher reflection prompts, not placeholders.`,
    JSON.stringify({
      type: "lesson_plan_document",
      format: "json",
      version: 1,
      title: request.title,
      blocks: [
        { type: "heading", level: 1, text: request.title },
        { type: "heading", level: 2, text: "Objectives" },
        {
          type: "paragraph",
          text: "Write the learning objectives, competencies, and performance expectations for this lesson.",
        },
        { type: "heading", level: 2, text: "Content" },
        {
          type: "paragraph",
          text: "Write the lesson content, concepts, examples, and explanation for this topic.",
        },
        { type: "heading", level: 2, text: "Learning Resources" },
        {
          type: "list",
          style: "bullet",
          items: ["Teacher's Guide", "Learner's Materials", "References"],
        },
        { type: "heading", level: 2, text: "Procedures" },
        {
          type: "list",
          style: "numbered",
          items: ["string"],
        },
        { type: "heading", level: 2, text: "Reflection" },
        {
          type: "list",
          style: "bullet",
          items: [
            "Learners who mastered the lesson",
            "Learners who need remediation",
            "Teaching strategy reflection",
          ],
        },
      ],
      exportTargets: ["doc"],
    }),
    `Return only valid JSON matching the blocks structure above.`,
  ].join("\n");
}

function buildDailyLessonLogPrompt(request: GenerateLessonPlanRequest) {
  return [
    ...buildCriticalPromptPreamble(request),
    `Template focus: Daily Lesson Log.`,
    `Follow the official log-style section order and keep the output JSON-based.`,
    `Topic / Subject: ${request.title}`,
    `Subject: ${request.subject}`,
    `Grade Level: ${request.gradeLevel}`,
    `Duration: ${request.duration} minutes`,
    `Language: ${request.language || "english"}`,
    request.userDraftText
      ? `Teacher Notes: ${request.userDraftText}`
      : "Teacher Notes: Not provided",
    `Required sections: Objectives, Content, Learning Resources, Procedures, Remarks, Reflection.`,
    `Remarks and Reflection must contain real teaching notes, not placeholder text.`,
    JSON.stringify({
      type: "lesson_plan_document",
      format: "json",
      version: 1,
      title: request.title,
      blocks: [
        { type: "heading", level: 1, text: request.title },
        { type: "heading", level: 2, text: "I. Objectives" },
        {
          type: "paragraph",
          text: "Write the content standard, performance standard, and learning competencies for this lesson.",
        },
        { type: "heading", level: 2, text: "II. Content" },
        {
          type: "paragraph",
          text: "Write the daily lesson content and the specific concept being taught.",
        },
        { type: "heading", level: 2, text: "III. Learning Resources" },
        {
          type: "list",
          style: "bullet",
          items: ["Teacher's Guide", "Learner's Materials", "References"],
        },
        { type: "heading", level: 2, text: "IV. Procedures" },
        {
          type: "list",
          style: "numbered",
          items: [
            "Review prior learning with a specific question or activity.",
            "Motivate students with an engaging introduction.",
            "Present the lesson with clear teacher explanation and examples.",
            "Conduct the lesson proper through guided and independent activities.",
            "Evaluate learning with a concrete assessment task.",
            "Record remarks on learner progress or class pacing.",
          ],
        },
        { type: "heading", level: 2, text: "V. Remarks" },
        {
          type: "paragraph",
          text: "Write the teacher remarks for this class period.",
        },
        { type: "heading", level: 2, text: "VI. Reflection" },
        {
          type: "list",
          style: "bullet",
          items: [
            "Learners who mastered the lesson",
            "Learners who need remediation",
            "Teaching strategy reflection",
          ],
        },
      ],
      exportTargets: ["doc"],
    }),
    `Return only valid JSON matching the blocks structure above.`,
  ].join("\n");
}

function buildMatatagPrompt(request: GenerateLessonPlanRequest) {
  return [
    ...buildCriticalPromptPreamble(request),
    `Template focus: Matatag Curriculum Lesson Plan.`,
    `Follow the Matatag structure exactly and adapt the content to the subject and grade level.`,
    `Do not fill in teacher answer keys or completed responses in the template skeleton.`,
    `Include guided questions, blank fill-up spaces, and teacher-completion columns where the reference layout expects them.`,
    `Topic / Subject: ${request.title}`,
    `Subject: ${request.subject}`,
    `Grade Level: ${request.gradeLevel}`,
    `Duration: ${request.duration} minutes`,
    `Language: ${request.language || "english"}`,
    request.userDraftText
      ? `Teacher Notes: ${request.userDraftText}`
      : "Teacher Notes: Not provided",
    `Required sections: Curriculum Content, Standards, Lesson Competencies, Learning Resources, Teaching and Learning Procedure, Evaluating Learning, Teacher Remarks, and Teacher Reflection.`,
    `The procedure section should be lesson-specific and should not reuse a fixed pattern across all subjects or grade levels.`,
    `Keep every block specific, instructional, and free of placeholder text.`,
    JSON.stringify({
      type: "lesson_plan_document",
      format: "json",
      version: 1,
      title: request.title,
      blocks: [
        { type: "heading", level: 1, text: request.title },
        {
          type: "heading",
          level: 2,
          text: "I. Curriculum Content, Standards, and Lesson Competencies",
        },
        {
          type: "paragraph",
          text: "A. Content Standard",
        },
        {
          type: "paragraph",
          text: "________________________________________",
        },
        {
          type: "paragraph",
          text: "B. Performance Standards",
        },
        {
          type: "paragraph",
          text: "________________________________________",
        },
        {
          type: "paragraph",
          text: "C. Learning Competencies and Objectives",
        },
        {
          type: "paragraph",
          text: "________________________________________",
        },
        {
          type: "paragraph",
          text: "D. Content",
        },
        {
          type: "paragraph",
          text: "________________________________________",
        },
        {
          type: "paragraph",
          text: "E. Integration",
        },
        {
          type: "paragraph",
          text: "________________________________________",
        },
        {
          type: "paragraph",
          text: "Leave the teacher-fill portions blank and do not include answer keys in this section.",
        },
        { type: "heading", level: 2, text: "II. Learning Resources" },
        {
          type: "paragraph",
          text: "Offline: ____________________",
        },
        {
          type: "paragraph",
          text: "Online: ____________________",
        },
        {
          type: "heading",
          level: 2,
          text: "III. Teaching and Learning Procedure",
        },
        { type: "heading", level: 3, text: "A. Activating Prior Knowledge" },
        { type: "paragraph", text: "Review: ____________________" },
        { type: "paragraph", text: "Motivation: ____________________" },
        { type: "paragraph", text: "Activity 1: Picture Analysis" },
        {
          type: "paragraph",
          text: "The teacher will present subject-appropriate visuals and leave the learner response column blank for teacher completion.",
        },
        { type: "paragraph", text: "Guided Questions:" },
        {
          type: "list",
          style: "numbered",
          items: [
            "What do you notice in the first set of visuals?",
            "How are the two examples similar or different?",
            "What skill or concept do you think the lesson will focus on?",
          ],
        },
        { type: "heading", level: 3, text: "B. Establishing Lesson Purpose" },
        {
          type: "paragraph",
          text: "Introduce the objectives: ____________________",
        },
        {
          type: "heading",
          level: 3,
          text: "C. Developing and Deepening Understanding (Tasks and Thought)",
        },
        { type: "paragraph", text: "Activity 2: ____________________" },
        {
          type: "paragraph",
          text: "Procedure: the teacher will guide a subject-specific activity and leave the steps adaptable to the lesson topic and grade level.",
        },
        {
          type: "paragraph",
          text: "Guide Questions: ____________________",
        },
        {
          type: "paragraph",
          text: "General Question: ____________________",
        },
        { type: "paragraph", text: "Discussion: ____________________" },
        {
          type: "paragraph",
          text: "Return Demonstration: ____________________",
        },
        {
          type: "paragraph",
          text: "Materials: ____________________",
        },
        {
          type: "paragraph",
          text: "The answer spaces must remain blank in the generated lesson plan.",
        },
        { type: "heading", level: 3, text: "D. Making Generalizations" },
        { type: "paragraph", text: "Guide Questions:" },
        {
          type: "list",
          style: "numbered",
          items: [
            "What happened when the wrong tool or method was used?",
            "How can the lesson concept be applied correctly?",
            "Why is accuracy or proper procedure important?",
            "How confident do you feel applying this lesson on your own?",
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "IV. Evaluating Learning: Formative Assessment and Teacher's Reflection",
        },
        { type: "heading", level: 3, text: "A. Evaluating Learning (Test)" },
        {
          type: "paragraph",
          text: "Directions: Fill in the blanks or answer the items below. Do not include the key answers in the generated template.",
        },
        {
          type: "paragraph",
          text: "Item 1. ____________________",
        },
        {
          type: "paragraph",
          text: "Item 2. ____________________",
        },
        {
          type: "paragraph",
          text: "Item 3. ____________________",
        },
        {
          type: "paragraph",
          text: "Item 4. ____________________",
        },
        {
          type: "paragraph",
          text: "Item 5. ____________________",
        },
        {
          type: "heading",
          level: 3,
          text: "B. Teacher's Remarks (Annotation)",
        },
        {
          type: "paragraph",
          text: "________________________________________",
        },
        { type: "heading", level: 3, text: "C. Teacher's Reflection" },
        {
          type: "paragraph",
          text: "________________________________________",
        },
      ],
      exportTargets: ["doc"],
    }),
    `Return only valid JSON matching the blocks structure above.`,
  ].join("\n");
}

function buildCriticalPromptPreamble(request: GenerateLessonPlanRequest) {
  return [
    `CRITICAL LANGUAGE REQUIREMENT:`,
    `The entire lesson plan MUST be written in "${request.language || "english"}".`,
    `Do not mix in a second language unless it is a proper noun, technical term, or curriculum code.`,
    `Grade-Level Adaptation Requirement:`,
    `Adjust activities based on learner age and developmental level.`,
    `Younger learners should receive more games, movement, visuals, storytelling, and guided activities.`,
    `Older learners should receive more discussions, problem-solving, investigations, projects, analysis, and real-world applications.`,
    `Do NOT leave any instructional content in English unless it is a proper noun, technical term, or curriculum code.`,
    `Apply this rule to every part of the lesson plan, including the headings, explanations, procedures, assessments, and teacher notes.`,
    `Do not copy any sample procedure pattern literally; tailor the procedure sequence to the topic, subject, and grade level.`,
    `CRITICAL ANTI-HALLUCINATION RULES:`,
    `1. Do NOT invent standards, codes, teacher notes, school details, or lesson facts that were not provided.`,
    `2. Do NOT leave placeholder text like [insert], [specify], [add here], or "TBD".`,
    `3. Do NOT generate media, images, or non-JSON output.`,
    `4. Every block must contain real instructional content that matches the template structure.`,
    `5. Keep the output classroom-ready, specific, and aligned to the selected subject and grade level.`,
    `6. If a detail is not provided, infer only what is necessary from the template structure and keep the wording generic but real.`,
    `STRUCTURE REQUIREMENTS:`,
    `- Follow the exact heading order in the provided JSON skeleton.`,
    `- Do not add unrelated headings or remove required sections.`,
    `- Keep the lesson plan valid JSON only.`,
  ];
}

// Lessora AI and DepEd prompts live in openai.service.ts as the single source of truth.
