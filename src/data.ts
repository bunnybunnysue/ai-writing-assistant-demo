export interface TranscriptLine {
  speaker: string;
  initials: string;
  text: string;
  avatarColor: string;
}

export interface WritingTask {
  id: string;
  type: 'message' | 'email' | 'doc_update';
  title: string;
  prompt: string;
  transcript: TranscriptLine[];
}

export const meetingNotification = {
  meetingTitle: 'Sprint Planning',
  meetingFullTitle: "Alex Chen's Zoom Meeting 2026-04-15 09:00 (GMT-7:00)",
  meetingTime: '9:00 – 10:00',
  meetingHost: 'Sarah Chen',
  tasks: [
    {
      id: '1',
      type: 'message' as const,
      title: 'Post sprint update to #engineering channel',
      prompt: 'Share a brief sprint update covering auth module progress, dashboard PR status, and notification redesign deprioritization with the team.',
      transcript: [
        { speaker: 'Sarah Chen', initials: 'SC', text: 'Alex, can you post the sprint summary to engineering channel? Include the auth refactor timeline and the dashboard PR.', avatarColor: 'from-pink-400 to-rose-500' },
        { speaker: 'Alex Chen', initials: 'AC', text: "Sure, I'll send it out right after this.", avatarColor: 'from-blue-400 to-blue-600' },
      ],
    },
    {
      id: '2',
      type: 'email' as const,
      title: 'Send follow-up email to stakeholders',
      prompt: 'Draft a stakeholder update email covering Q1 review highlights, revenue growth, customer retention, and new enterprise accounts onboarded.',
      transcript: [
        { speaker: 'Sarah Chen', initials: 'SC', text: 'Make sure to send a follow-up to all stakeholders with the Q1 numbers we discussed. Revenue, retention, new accounts — the full picture.', avatarColor: 'from-pink-400 to-rose-500' },
      ],
    },
    {
      id: '3',
      type: 'doc_update' as const,
      title: 'Update design specifications based on team review',
      prompt: 'Update the design specs document to include the new 12-column grid layout, revised button radius, and accessibility guidelines from team feedback.',
      transcript: [
        { speaker: 'Michael Sun', initials: 'MS', text: 'We need to update the design specs with everything we discussed — the grid changes, button radius, and ARIA labels.', avatarColor: 'from-emerald-400 to-teal-500' },
        { speaker: 'Alex Chen', initials: 'AC', text: "Got it, I'll draft those updates.", avatarColor: 'from-blue-400 to-blue-600' },
      ],
    },
    {
      id: '4a',
      type: 'message' as const,
      title: 'Share meeting recap with attendees',
      prompt: 'Summarize the key discussion points, decisions, and action items from the sprint planning meeting and share with all attendees.',
      transcript: [
        { speaker: 'Sarah Chen', initials: 'SC', text: 'Can someone send a recap to everyone? Not everyone could attend the full session.', avatarColor: 'from-pink-400 to-rose-500' },
      ],
    },
  ] as WritingTask[],
};

export const autoCompletedOutputs = [
  {
    taskId: '1',
    type: 'message' as const,
    title: 'Post sprint update to #engineering channel',
    targetChannel: '#engineering',
    recipient: null as null | { name: string; email?: string },
    output: `Hey team! Quick update from sprint planning:\n\n• Auth module refactor is on track — aiming for completion by Thursday\n• Dashboard performance PR is ready for review (PR #342)\n• We're deprioritizing the notification redesign to next sprint to focus on the API migration\n\nNext check-in: Wednesday standup. Flag me if anything is blocked.`,
  },
  {
    taskId: '2',
    type: 'email' as const,
    title: 'Send follow-up email to stakeholders',
    targetChannel: null,
    recipient: { name: 'Sarah Chen', email: 'sarah.chen@company.com' },
    output: `Subject: Q1 Business Review — Key Takeaways & Next Steps\n\nHi team,\n\nThanks for joining today's Q1 review. Here's a quick recap:\n\n• Revenue grew 18% QoQ, exceeding our target by 3%\n• Customer retention improved to 94.2%\n• Three new enterprise accounts onboarded\n\nNext steps: Department leads, please share your Q2 OKRs by Friday EOD.\n\nBest,\nAlex`,
  },
  {
    taskId: '3',
    type: 'doc_update' as const,
    title: 'Update design specifications based on team review',
    targetChannel: null,
    recipient: null as null | { name: string; email?: string },
    output: '',
    docName: 'Design Specifications — Q1 Update',
    docSections: [
      { title: 'Grid Layout', detail: 'Updated to 12-column grid system' },
      { title: 'Button Radius', detail: 'Revised from 4px to 8px globally' },
      { title: 'Accessibility', detail: 'Added ARIA label guidelines' },
    ],
  },
  {
    taskId: '4a',
    type: 'message' as const,
    title: 'Share meeting recap with attendees',
    targetChannel: null,
    recipient: null as null | { name: string; email?: string },
    output: `Hi everyone,\n\nQuick recap from our sprint planning session:\n\n• Agreed on Q2 priorities: API migration, auth module, and dashboard performance\n• Timeline: Auth module wraps Thursday, dashboard PR under review\n• Notification redesign moved to next sprint\n\nLet me know if I missed anything. Thanks!`,
  },
];

export const clarificationTask = {
  taskId: '4',
  type: 'message' as const,
  title: 'Share Q2 product roadmap summary with leadership',
  meetingFullTitle: "Alex Chen's Zoom Meeting 2026-04-15 11:00 (GMT-7:00)",
  meetingTime: '11:00 – 12:00',
  meetingHost: 'Michael Sun',
  questions: [
    'Should this include both confirmed and tentative initiatives, or confirmed only?',
    'Which leadership distribution list — VP-level, C-suite, or both?',
    'Is there a preferred format (bullet points, narrative, or table)?',
  ],
};
