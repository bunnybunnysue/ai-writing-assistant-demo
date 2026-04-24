import { meetingNotification, autoCompletedOutputs, clarificationTask } from './data';

const BotAvatar = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
  const cls = size === 'md' ? 'w-9 h-9 rounded-xl' : 'w-8 h-8 rounded-lg';
  const iconCls = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className={`${cls} bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 ${size === 'sm' ? 'mt-0.5' : ''}`}>
      <svg className={`${iconCls} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
  );
};

const SenderLine = ({ time }: { time: string }) => (
  <div className="flex items-center gap-2 mb-1">
    <span className="text-[13px] font-bold text-gray-900">Writing Tasks</span>
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 tracking-wider">APP</span>
    <span className="text-[11px] text-gray-400">{time}</span>
  </div>
);

const ViewResultButton = () => (
  <div className="mt-3 pt-2 border-t border-gray-100">
    <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">View Result</button>
  </div>
);

const App = () => {
  return (
    <div className="flex h-screen bg-white">
      {/* Chat header */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
          <BotAvatar size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-gray-900">Writing Tasks</h3>
              <span className="text-[10px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">DEMO</span>
            </div>
            <p className="text-[11px] text-gray-400">Supported capabilities only</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Date divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium">Today</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ═══ Task Detection: New writing tasks are ready ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:15 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">✨ 4 new writing tasks are ready to go</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Writing tasks from <span className="font-semibold">Sprint Planning</span> <span className="text-gray-300 mx-1">|</span> <span className="text-[12px] text-gray-400">9:00–10:00 · Hosted by Sarah Chen</span></p>
                {meetingNotification.tasks.map((task, i) => (
                  <div key={task.id} className={`py-2 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                    <p className="font-semibold text-gray-900 text-[12.5px]">{i + 1}. {task.title}</p>
                    <p className="text-[11.5px] text-gray-400 mt-0.5">{task.prompt}</p>
                    <p className="mt-1 text-[11px]">
                      <span className="text-blue-600 hover:underline cursor-pointer font-medium transition-colors">Get Started</span>
                      <span className="text-gray-300 mx-1.5">|</span>
                      <span className="text-gray-400 hover:underline cursor-pointer hover:text-gray-600 transition-colors">Edit Prompt</span>
                    </p>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-100 space-x-2">
                  <button className="px-4 py-1.5 rounded-md text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Run All</button>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">View in Writing Tasks</button>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Task Done: Chat message (with channel) ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:17 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">✅ Task done: Post sprint update</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your output for <span className="font-medium">#engineering</span> has been prepared:</p>
                <div className="border-l-[3px] border-green-500 pl-3">
                  <p className="text-[12.5px] text-gray-600 whitespace-pre-line">{autoCompletedOutputs[0].output}</p>
                </div>
                <ViewResultButton />
              </div>
            </div>
          </div>

          {/* ═══ Task Done: Email ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:18 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">✅ Task done: Stakeholder follow-up email</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your output to <span className="font-medium">sarah.chen@company.com</span> has been prepared:</p>
                <div className="border-l-[3px] border-green-500 pl-3">
                  <p className="text-[12.5px] text-gray-600 whitespace-pre-line">{autoCompletedOutputs[1].output}</p>
                </div>
                <ViewResultButton />
              </div>
            </div>
          </div>

          {/* ═══ Task Done: Document update ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:18 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">✅ Task done: Design specifications updated</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your document has been updated with 3 changes:</p>
                <p className="text-[12.5px] text-gray-600">1. <span className="font-medium text-gray-700">Grid Layout</span> — Updated to 12-column grid system</p>
                <p className="text-[12.5px] text-gray-600">2. <span className="font-medium text-gray-700">Button Radius</span> — Revised from 4px to 8px globally</p>
                <p className="text-[12.5px] text-gray-600 mb-2">3. <span className="font-medium text-gray-700">Accessibility</span> — Added ARIA label guidelines</p>
                <div className="border-l-[3px] border-green-500 pl-3">
                  <p className="text-[12.5px]">📄 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Design Specifications — Q1 Update</span></p>
                </div>
                <ViewResultButton />
              </div>
            </div>
          </div>

          {/* ═══ Task Done: Generic message (no recipient) ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:19 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">✅ Task done: Meeting recap</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your output has been prepared:</p>
                <div className="border-l-[3px] border-green-500 pl-3">
                  <p className="text-[12.5px] text-gray-600 whitespace-pre-line">{autoCompletedOutputs[3].output}</p>
                </div>
                <ViewResultButton />
              </div>
            </div>
          </div>

          {/* ═══ Action Needed: Clarification ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:19 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">⚠️ Action needed: {clarificationTask.title}</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — This task needs more input before I can get started:</p>
                <div className="border-l-[3px] border-amber-400 pl-3">
                  {clarificationTask.questions.map((q, i) => (
                    <p key={i} className="text-[12.5px] text-gray-600">{i + 1}. {q}</p>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <button className="px-4 py-1.5 rounded-md text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Provide More Info</button>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Task Done: Multi-output ═══ */}
          <div className="mb-6 flex gap-3">
            <BotAvatar />
            <div className="flex-1 min-w-0">
              <SenderLine time="9:22 AM" />
              <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">✅ Task done: Q1 business review package</p>
                <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your output has been prepared. 3 deliverables are ready:</p>
                <div className="border-l-[3px] border-green-500 pl-3 space-y-1">
                  <p className="text-[12.5px]">📊 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Q1 Business Review Deck</span></p>
                  <p className="text-[12.5px]">📋 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Q1 Revenue & Metrics Breakdown</span></p>
                  <p className="text-[12.5px]">📑 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Customer Retention Data Table</span></p>
                </div>
                <ViewResultButton />
              </div>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4">
          <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <input type="text" placeholder="Write a message or type / for more" className="flex-1 text-[13px] text-gray-700 placeholder-gray-400 outline-none bg-transparent" readOnly />
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center ml-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
