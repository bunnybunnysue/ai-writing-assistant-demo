import React, { useState } from 'react';
import {
  meetingNotification,
  autoCompletedOutputs,
  clarificationTask,
  mfuCases,
  conversations,
} from './data';

/* ──────────────────────────────────────────────────────────
   Shared small components
   ────────────────────────────────────────────────────────── */

const DemoBotAvatar = ({ size = 'sm' }: any) => {
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

const SenderLine = ({ time }: any) => (
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

const DateDivider = () => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-[11px] text-gray-400 font-medium">Today</span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

const InputBar = () => (
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
);

/* Scenario annotation divider — labels which case a message demonstrates */
const ScenarioLabel = ({ n, text }: any) => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
      <span className="text-blue-500">{n}</span>{text}
    </span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const FullBotAvatar = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  </div>
);

const jumpArrow = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const PrimaryAction = ({ onClick, children, icon }: any) => (
  <button onClick={onClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
    {icon}{children}
  </button>
);

const ChatBubbleIcon = () => <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const EmailIcon = () => <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

/* ──────────────────────────────────────────────────────────
   Jump-to overlay views (open chat / channel / email / group)
   ────────────────────────────────────────────────────────── */

const ChannelJumpView = ({ target, onBack }: any) => (
  <div className="fixed inset-0 bg-white z-50 flex flex-col">
    <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
      <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 text-sm font-bold">#</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-bold text-gray-900">{target.name.replace('#', '')}</h3>
        <p className="text-[11px] text-gray-400">24 members</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" /><span className="text-[11px] text-gray-400 font-medium">Yesterday</span><div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="mb-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5">SC</div>
        <div>
          <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-gray-900">Sarah Chen</span><span className="text-[11px] text-gray-400">4:30 PM</span></div>
          <p className="text-[13px] text-gray-700 leading-relaxed">Hey team, just a reminder — please wrap up any pending PR reviews by EOD. We're aiming to cut a release tomorrow morning. 🚀</p>
        </div>
      </div>
      <div className="mb-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5">MS</div>
        <div>
          <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-gray-900">Michael Sun</span><span className="text-[11px] text-gray-400">4:45 PM</span></div>
          <p className="text-[13px] text-gray-700 leading-relaxed">Got it! I'll finish reviewing the dashboard PR tonight. 👍</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 mt-6">
        <div className="flex-1 h-px bg-gray-200" /><span className="text-[11px] text-gray-400 font-medium">Today</span><div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="mb-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5">LW</div>
        <div>
          <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-gray-900">Lisa Wang</span><span className="text-[11px] text-gray-400">9:02 AM</span></div>
          <p className="text-[13px] text-gray-700 leading-relaxed">Good morning! FYI the CI pipeline is green again after last night's fix.</p>
        </div>
      </div>
    </div>

    <div className="px-4 pb-4">
      <div className="border-2 border-blue-300 rounded-xl px-4 py-3 bg-blue-50/30 ring-2 ring-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Draft pre-filled — review and send</span>
        </div>
        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line mb-3">{target.message}</p>
        <div className="flex items-center justify-between pt-2 border-t border-blue-200/50">
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
            <button className="text-gray-400 hover:text-gray-600"><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium transition-colors">
            Send
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EmailJumpView = ({ target, onBack }: any) => {
  const emailLines: string[] = target.message.split('\n');
  const subjectLine = (emailLines.find((l) => l.startsWith('Subject:')) || '').replace('Subject: ', '');
  const bodyContent = emailLines.filter((l) => !l.startsWith('Subject:')).join('\n').trim();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-gray-900">New Email</h3>
          <p className="text-[11px] text-gray-400">Compose</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 rounded-lg text-[12px] font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors">Discard</button>
          <button className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            Send
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <span className="text-[12px] text-blue-600 font-medium">Pre-filled by Writing Tasks — review and send when ready</span>
          </div>

          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <span className="text-[13px] text-gray-400 font-medium w-16">To</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-[8px] font-bold">SC</div>
                <span className="text-[12px] text-gray-700 font-medium">{target.recipientEmail}</span>
                <button className="text-gray-400 hover:text-gray-600"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <span className="text-[13px] text-gray-400 font-medium w-16">Cc</span>
            <input type="text" placeholder="Add recipients" className="flex-1 text-[13px] text-gray-700 placeholder-gray-300 outline-none" readOnly />
          </div>

          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <span className="text-[13px] text-gray-400 font-medium w-16">Subject</span>
            <p className="flex-1 text-[13px] text-gray-900 font-medium">{subjectLine}</p>
          </div>

          <div className="py-4">
            <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{bodyContent}</div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex items-center gap-1">
            {['B', 'I', 'U'].map((fmt) => (
              <button key={fmt} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500 transition-colors">{fmt}</button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h10" /></svg></button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DMJumpView = ({ target, onBack }: any) => {
  const isChannel = target.type === 'channel' || target.name.startsWith('#');
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        {isChannel ? (
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 text-sm font-bold">#</div>
        ) : (
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${target.color || 'from-gray-300 to-gray-400'} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold`}>{target.initials}</div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-gray-900">{target.name}</h3>
          <p className="text-[11px] text-gray-400">{isChannel ? '18 members' : 'Active now'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" /><span className="text-[11px] text-gray-400 font-medium">Today</span><div className="flex-1 h-px bg-gray-200" />
        </div>
        {isChannel ? (
          <React.Fragment>
            <div className="mb-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5">EZ</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-gray-900">Emily Zhang</span><span className="text-[11px] text-gray-400">8:45 AM</span></div>
                <p className="text-[13px] text-gray-700 leading-relaxed">Morning everyone! Quick question — is the product sync still at 2pm today?</p>
              </div>
            </div>
            <div className="mb-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5">MS</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-gray-900">Michael Sun</span><span className="text-[11px] text-gray-400">8:52 AM</span></div>
                <p className="text-[13px] text-gray-700 leading-relaxed">Yes, confirmed! Same Zoom link as last week.</p>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="mb-4 flex gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${target.color || 'from-gray-300 to-gray-400'} flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5`}>{target.initials}</div>
            <div>
              <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-gray-900">{target.name}</span><span className="text-[11px] text-gray-400">9:05 AM</span></div>
              <p className="text-[13px] text-gray-700 leading-relaxed">Hey Alex, just saw the meeting notes. Looks like a productive session! Let me know if you need anything from my side.</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="border-2 border-blue-300 rounded-xl px-4 py-3 bg-blue-50/30 ring-2 ring-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <span className="text-[11px] text-blue-600 font-medium">Draft pre-filled — review and send</span>
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line mb-3">{target.message}</p>
          <div className="flex items-center justify-between pt-2 border-t border-blue-200/50">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
              <button className="text-gray-400 hover:text-gray-600"><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium transition-colors">
              Send
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Step 1 — Create-group dialog (mirrors Zoom's existing create UI) */
const GroupCreateDialog = ({ target, onCancel, onCreate }: any) => {
  const suggested = target.participants.map((p: any) => p.name.split(' ')[0]).slice(0, 2).join(' & ');
  const [name, setName] = useState(suggested);
  const [type, setType] = useState('private');
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[460px] max-h-[88vh] overflow-hidden flex flex-col">
        <div className="px-6 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
          <h3 className="text-[18px] font-bold text-gray-900">Create group chat</h3>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="px-6 pb-2 overflow-y-auto">
          <p className="text-[13px] font-semibold text-gray-900 mb-2">Group icon</p>
          <div className="flex -space-x-2 mb-5">
            {target.participants.slice(0, 4).map((p: any, i: number) => (
              <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-[13px] font-bold ring-2 ring-white`}>{p.initials}</div>
            ))}
          </div>

          <p className="text-[13px] font-semibold text-gray-900 mb-2">Group name</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sprint planning crew" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-[14px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all mb-5" autoFocus />

          <p className="text-[13px] font-semibold text-gray-900 mb-2">Description <span className="font-normal text-gray-400">(optional)</span></p>
          <textarea placeholder="Let people know what this conversation is about" rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-[14px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none mb-5" />

          <p className="text-[13px] font-semibold text-gray-900 mb-2.5">Group type</p>
          <div className="space-y-3 mb-5">
            <button onClick={() => setType('public')} className="w-full flex items-start gap-2.5 text-left">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${type === 'public' ? 'border-blue-600' : 'border-gray-300'}`}>{type === 'public' && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}</span>
              <span><span className="text-[14px] font-medium text-gray-900">Public</span> <span className="text-[13px] text-gray-500">Anyone in your organization can find and join</span></span>
            </button>
            <button onClick={() => setType('private')} className="w-full flex items-start gap-2.5 text-left">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${type === 'private' ? 'border-blue-600' : 'border-gray-300'}`}>{type === 'private' && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}</span>
              <span><span className="text-[14px] font-medium text-gray-900">Private</span> <span className="text-[13px] text-gray-500">Only invited members can join</span></span>
            </button>
          </div>

          <p className="text-[13px] font-semibold text-gray-900 mb-2">Members <span className="font-normal text-gray-400">· added from the meeting</span></p>
          <div className="flex flex-wrap gap-2 mb-1">
            {target.participants.map((p: any, i: number) => (
              <span key={i} className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-[8px] font-bold`}>{p.initials}</span>
                <span className="text-[12.5px] text-gray-700 font-medium">{p.name}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-2.5 border-t border-gray-100 flex-shrink-0">
          <button onClick={onCancel} className="px-4 h-9 rounded-lg border border-gray-300 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onCreate} disabled={!name.trim()} className="px-4 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-[13px] font-medium transition-colors">Create group chat</button>
        </div>
      </div>
    </div>
  );
};

const GroupCreateJumpView = ({ target, onBack }: any) => {
  const [created, setCreated] = useState(false);
  const groupName = target.participants.map((p: any) => p.name.split(' ')[0]).slice(0, 2).join(' & ');

  if (!created) return <GroupCreateDialog target={target} onCancel={onBack} onCreate={() => setCreated(true)} />;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex -space-x-2 flex-shrink-0">
          {target.participants.slice(0, 3).map((p: any, i: number) => (
            <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white`}>{p.initials}</div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-gray-900 truncate">{groupName}</h3>
          <p className="text-[11px] text-gray-400 truncate">{target.participants.map((p: any) => p.name.split(' ')[0]).join(', ')} · {target.participants.length} people</p>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-green-50/70 border-b border-green-100 flex items-center gap-2">
        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-[12px] text-green-700">Group chat created — your draft is ready below. <span className="font-semibold">Nothing sends until you do.</span></p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-8 flex flex-col items-center justify-center text-center">
        <div className="flex -space-x-3 mb-4">
          {target.participants.map((p: any, i: number) => (
            <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-[13px] font-bold ring-4 ring-white`}>{p.initials}</div>
          ))}
        </div>
        <p className="text-[14px] font-semibold text-gray-900">Start of {groupName}</p>
        <p className="text-[12px] text-gray-400 mt-1 max-w-xs">With {target.participants.map((p: any) => p.name).join(', ')}. No messages yet — your draft below kicks it off.</p>
      </div>

      <div className="px-4 pb-4">
        <div className="border-2 border-blue-300 rounded-xl px-4 py-3 bg-blue-50/30 ring-2 ring-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <span className="text-[11px] text-blue-600 font-medium">Draft pre-filled — review and send</span>
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line mb-3">{target.message}</p>
          <div className="flex items-center justify-between pt-2 border-t border-blue-200/50">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
              <button className="text-gray-400 hover:text-gray-600"><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium transition-colors">
              Send
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Inline clarification card
   ────────────────────────────────────────────────────────── */

const ClarificationCard = ({ task, onSubmit }: any) => {
  const [answers, setAnswers] = useState<string[]>(task.questions.map(() => ''));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a.trim().length > 0);
  const setAnswer = (i: number, v: string) => setAnswers((prev) => prev.map((a, idx) => (idx === i ? v : a)));
  const submit = () => { setSubmitted(true); onSubmit(answers); };

  return (
    <div className="ml-11 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-4">
      <div className="px-4 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center gap-2.5">
        <svg className="w-4 h-4 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth={2} /><line x1="10" y1="9" x2="10" y2="15" strokeWidth={2} strokeLinecap="round" /><line x1="14" y1="9" x2="14" y2="15" strokeWidth={2} strokeLinecap="round" /></svg>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 truncate">{task.title}</p>
          <p className="text-[11px] text-gray-400">{task.meetingTime} · Hosted by {task.meetingHost}</p>
        </div>
      </div>

      {!submitted ? (
        <div className="px-4 py-3.5">
          <p className="text-[11px] text-gray-400 font-medium mb-3 uppercase tracking-wide">Answer here — no need to leave chat</p>
          <div className="space-y-4">
            {task.questions.map((q: string, i: number) => (
              <div key={i}>
                <p className="text-[12.5px] text-gray-700 font-medium mb-2">{i + 1}. {q}</p>
                {task.options && task.options[i] && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {task.options[i].map((opt: string) => {
                      const active = answers[i] === opt;
                      return (
                        <button key={opt} onClick={() => setAnswer(i, active ? '' : opt)} className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>{opt}</button>
                      );
                    })}
                  </div>
                )}
                <input type="text" value={answers[i]} onChange={(e) => setAnswer(i, e.target.value)} placeholder="Type an answer…" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[12.5px] text-gray-700 placeholder-gray-300 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/60" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-[11px] text-gray-400">{answers.filter((a) => a.trim()).length}/{task.questions.length} answered</span>
            <button onClick={submit} disabled={!allAnswered} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${allAnswered ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              Submit answers
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2 text-green-600 mb-2.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[12.5px] font-semibold">Answers submitted</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {answers.map((a, i) => (<span key={i} className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-200">{a}</span>))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2.5">Writing Tasks will reply with your draft in a new message below.</p>
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Full version — rich, interactive task cards
   ────────────────────────────────────────────────────────── */

const FullVersionView = () => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['1']));
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [runAllState, setRunAllState] = useState('idle');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMessage, setForwardMessage] = useState('');
  const [forwardSearch, setForwardSearch] = useState('');
  const [jumpTarget, setJumpTarget] = useState<any>(null);
  const [clarifPhase, setClarifPhase] = useState('pending'); // pending | working | done
  const submitClarification = () => { setClarifPhase('working'); setTimeout(() => setClarifPhase('done'), 1600); };

  const handleRunAll = () => { setRunAllState('loading'); setTimeout(() => setRunAllState('done'), 2000); };
  const handleCopy = (id: string) => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const toggleTask = (id: string) => setExpandedTasks((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const jumpToChannel = (channelName: string, message: string) => setJumpTarget({ type: 'channel', name: channelName, message });
  const jumpToPerson = (recipient: any, message: string) => setJumpTarget({ type: 'dm', name: recipient.name, initials: recipient.initials, color: recipient.color, message });
  const jumpToEmail = (output: any) => setJumpTarget({ type: 'email', name: (output.recipient && output.recipient.name) || '', message: output.output, recipientEmail: (output.recipient && output.recipient.email) || '' });
  const jumpToGroup = (participants: any, message: string) => setJumpTarget({ type: 'group-create', participants, message });
  const openSelector = (message: string) => { setForwardMessage(message); setForwardSearch(''); setShowForwardModal(true); };
  const closeSelector = () => { setShowForwardModal(false); setForwardSearch(''); };

  const forwardContacts = [
    { id: 'c1', name: 'Sarah Chen', type: 'person', initials: 'SC', color: 'from-pink-400 to-rose-500' },
    { id: 'c2', name: 'Michael Sun', type: 'person', initials: 'MS', color: 'from-emerald-400 to-teal-500' },
    { id: 'c3', name: 'Engineering Team', type: 'channel', initials: '#', color: 'from-blue-400 to-blue-600' },
    { id: 'c4', name: 'Product Updates', type: 'channel', initials: '#', color: 'from-purple-400 to-purple-600' },
    { id: 'c5', name: 'Emily Zhang', type: 'person', initials: 'EZ', color: 'from-amber-400 to-orange-500' },
  ];

  const handleSelect = (contact: any) => {
    closeSelector();
    if (contact.type === 'channel') jumpToChannel(`#${contact.name.toLowerCase().replace(/\s+/g, '-')}`, forwardMessage);
    else jumpToPerson(contact, forwardMessage);
  };

  const handleCreateGroup = (query: string) => {
    closeSelector();
    jumpToGroup([{ name: query || 'New group', initials: (query || 'NG').slice(0, 2).toUpperCase(), color: 'from-indigo-400 to-violet-600' }], forwardMessage);
  };

  const filteredContacts = forwardContacts.filter((c) => c.name.toLowerCase().includes(forwardSearch.toLowerCase()));

  const OutputCard = ({ title, icon, headerExtra, body, footer, noIndent }: any) => (
    <div className={`${noIndent ? '' : 'ml-11 mb-4'} rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden`}>
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-gray-900 truncate">{title}</p></div>
        <button className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          View result
        </button>
      </div>
      {headerExtra}
      <div className="px-4 py-3">
        <div className="text-[12.5px] text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg px-3.5 py-3 border border-gray-100 max-h-[180px] overflow-y-auto">{body}</div>
      </div>
      <div className="px-4 py-2.5 border-t border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">{footer}</div>
      </div>
    </div>
  );

  const CopyBtn = ({ id }: any) => {
    const isCopied = copiedId === id;
    return (
      <button onClick={() => handleCopy(id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${isCopied ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
        {isCopied ? (<React.Fragment><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Copied</React.Fragment>) : (<React.Fragment><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</React.Fragment>)}
      </button>
    );
  };

  const BotLine = ({ time }: any) => (
    <div className="flex items-center gap-3 mb-2"><FullBotAvatar /><div><span className="text-[13px] font-semibold text-gray-900">Writing Tasks</span><span className="text-[11px] text-gray-400 ml-2">{time}</span></div></div>
  );

  const renderWritingTaskCard = (task: any) => {
    const isExpanded = expandedTasks.has(task.id);
    return (
      <div key={task.id} className="border-b border-gray-100 last:border-b-0">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <button onClick={() => toggleTask(task.id)} className="flex-1 min-w-0 text-left flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-gray-900 truncate">{task.title}</span>
            <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {runAllState === 'done' ? (
            <button className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>View result</button>
          ) : runAllState === 'loading' ? (
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-gray-400"><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Running…</span>
          ) : (
            <button className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-600 hover:bg-blue-50 transition-colors"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>Get Started</button>
          )}
        </div>
        {isExpanded && (
          <div className="px-4 pb-4">
            <div className="ml-10">
              <div className="bg-blue-50/60 rounded-xl px-4 py-3 border border-blue-100/60">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
                  <p className="text-[12.5px] text-gray-700 leading-relaxed">{task.prompt}</p>
                </div>
                <div className="flex items-center justify-end mt-3 pt-2 border-t border-blue-100/50">
                  <button className="text-[11px] text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>Edit Prompt</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* jump overlays */
  if (jumpTarget) {
    if (jumpTarget.type === 'email') return <EmailJumpView target={jumpTarget} onBack={() => setJumpTarget(null)} />;
    if (jumpTarget.type === 'channel') return <ChannelJumpView target={jumpTarget} onBack={() => setJumpTarget(null)} />;
    if (jumpTarget.type === 'group-create') return <GroupCreateJumpView target={jumpTarget} onBack={() => setJumpTarget(null)} />;
    return <DMJumpView target={jumpTarget} onBack={() => setJumpTarget(null)} />;
  }

  const known = mfuCases.knownPerson;
  const unknown = mfuCases.unknown;
  const group = mfuCases.groupCreate;
  const split = mfuCases.splitMessages;
  const channelOut = autoCompletedOutputs[0];
  const emailOut = autoCompletedOutputs[1];
  const docOut = autoCompletedOutputs[2];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
        <div><h3 className="text-[14px] font-bold text-gray-900">Writing Tasks</h3><p className="text-[11px] text-gray-400">Handles writing tasks assigned to you from meetings</p></div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <DateDivider />

        {/* Task detection */}
        <div className="mb-6">
          <BotLine time="9:15 AM" />
          <div className="ml-11">
            <p className="text-[13px] text-gray-700 leading-relaxed mb-3"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✨ {meetingNotification.tasks.length} new writing tasks are ready to go:</p>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900">{meetingNotification.meetingFullTitle}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{meetingNotification.meetingTime} · Hosted by {meetingNotification.meetingHost}</p>
                </div>
                {runAllState === 'idle' && <button onClick={handleRunAll} className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Run All</button>}
                {runAllState === 'loading' && <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-500 bg-gray-100 border border-gray-200"><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Running…</span>}
              </div>
              {meetingNotification.tasks.map(renderWritingTaskCard)}
            </div>
          </div>
        </div>

        {/* ① KNOWN RECIPIENT */}
        <ScenarioLabel n="①" text="Known recipient" />
        <div className="mb-6">
          <BotLine time="9:16 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Your reply to <span className="font-medium text-gray-900">{known.recipient.name}</span> is drafted:</p></div>
          <OutputCard
            title={known.title}
            icon={<ChatBubbleIcon />}
            headerExtra={<div className="px-4 py-2 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100"><span className="text-[11px] text-gray-400">To</span><div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-gray-200"><div className={`w-4 h-4 rounded-full bg-gradient-to-br ${known.recipient.color} flex items-center justify-center text-white text-[7px] font-bold`}>{known.recipient.initials}</div><span className="text-[11.5px] text-gray-700 font-medium">{known.recipient.name}</span></div></div>}
            body={known.output}
            footer={<React.Fragment><CopyBtn id={known.taskId} /><PrimaryAction onClick={() => jumpToPerson(known.recipient, known.output)} icon={jumpArrow}>Open chat with {known.recipient.name}</PrimaryAction></React.Fragment>}
          />
        </div>

        {/* ② KNOWN CHANNEL */}
        <ScenarioLabel n="②" text="Known channel" />
        <div className="mb-6">
          <BotLine time="9:17 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Your message for <span className="font-medium">#engineering</span> is drafted:</p></div>
          <OutputCard
            title={channelOut.title}
            icon={<ChatBubbleIcon />}
            body={channelOut.output}
            footer={<React.Fragment><CopyBtn id={channelOut.taskId} /><PrimaryAction onClick={() => jumpToChannel(channelOut.targetChannel, channelOut.output)} icon={jumpArrow}>Open {channelOut.targetChannel}</PrimaryAction></React.Fragment>}
          />
        </div>

        {/* ③ UNKNOWN RECIPIENT */}
        <ScenarioLabel n="③" text="Unknown recipient" />
        <div className="mb-6">
          <BotLine time="9:19 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Your message is drafted. I <span className="font-medium text-gray-900">couldn't tell who it's for</span>:</p></div>
          <OutputCard
            title={unknown.title}
            icon={<ChatBubbleIcon />}
            headerExtra={<div className="px-4 py-2 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100"><svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="text-[11.5px] text-gray-400">No recipient detected — you choose where it goes</span></div>}
            body={unknown.output}
            footer={<React.Fragment><CopyBtn id={unknown.taskId} /><PrimaryAction onClick={() => openSelector(unknown.output)} icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>Choose which chat to open</PrimaryAction></React.Fragment>}
          />
        </div>

        {/* ④ GROUP CHAT THAT DOESN'T EXIST */}
        <ScenarioLabel n="④" text="New group chat" />
        <div className="mb-6">
          <BotLine time="9:20 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Your recap is drafted for <span className="font-medium text-gray-900">all {group.participants.length} attendees</span>:</p></div>
          <OutputCard
            title={group.title}
            icon={<ChatBubbleIcon />}
            headerExtra={
              <div className="px-4 py-2.5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2.5">
                <div className="flex -space-x-1.5">{group.participants.map((p: any, i: number) => (<div key={i} className={`w-5 h-5 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-[7px] font-bold ring-2 ring-white`}>{p.initials}</div>))}</div>
                <span className="text-[11.5px] text-gray-500">No group chat exists for these {group.participants.length} people yet</span>
              </div>
            }
            body={group.output}
            footer={<React.Fragment><CopyBtn id={group.taskId} /><PrimaryAction onClick={() => jumpToGroup(group.participants, group.output)} icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>Create group chat</PrimaryAction></React.Fragment>}
          />
        </div>

        {/* ⑤ ONE REQUEST → TWO MESSAGES TO TWO PEOPLE */}
        <ScenarioLabel n="⑤" text="Two messages · two recipients" />
        <div className="mb-6">
          <BotLine time="9:21 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ This one goes to <span className="font-medium text-gray-900">two people</span>, so I split it into <span className="font-medium text-gray-900">two separate drafts</span> — review and open each on its own:</p></div>
          <div className="ml-11 space-y-3">
            {split.drafts.map((d: any, i: number) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold">{i + 1}</span>
                  <span className="text-[11px] text-gray-400 font-medium">Message {i + 1} of {split.drafts.length}</span>
                </div>
                <OutputCard
                  noIndent
                  title={split.title}
                  icon={<ChatBubbleIcon />}
                  headerExtra={<div className="px-4 py-2 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100"><span className="text-[11px] text-gray-400">To</span><div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-gray-200"><div className={`w-4 h-4 rounded-full bg-gradient-to-br ${d.recipient.color} flex items-center justify-center text-white text-[7px] font-bold`}>{d.recipient.initials}</div><span className="text-[11.5px] text-gray-700 font-medium">{d.recipient.name}</span></div></div>}
                  body={d.output}
                  footer={<React.Fragment><CopyBtn id={`${split.taskId}-${i}`} /><PrimaryAction onClick={() => jumpToPerson(d.recipient, d.output)} icon={jumpArrow}>Open chat with {d.recipient.name}</PrimaryAction></React.Fragment>}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ⑥ EMAIL (known) */}
        <ScenarioLabel n="⑥" text="Email · known recipient" />
        <div className="mb-6">
          <BotLine time="9:21 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Your email to <span className="font-medium text-gray-900">{emailOut.recipient.email}</span> is drafted:</p></div>
          <OutputCard
            title={emailOut.title}
            icon={<EmailIcon />}
            body={<React.Fragment><p className="text-[11.5px] text-gray-500 mb-2 pb-2 border-b border-gray-200/70">To: {emailOut.recipient.name} &lt;{emailOut.recipient.email}&gt;</p>{emailOut.output}</React.Fragment>}
            footer={<React.Fragment><CopyBtn id={emailOut.taskId} /><PrimaryAction onClick={() => jumpToEmail(emailOut)} icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>Open email to {emailOut.recipient.name}</PrimaryAction></React.Fragment>}
          />
        </div>

        {/* ⑦ DOCUMENT UPDATE */}
        <ScenarioLabel n="⑦" text="Document update" />
        <div className="mb-6">
          <BotLine time="9:21 AM" />
          <div className="ml-11 mb-3">
            <p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Your document has been updated with {(docOut.docSections && docOut.docSections.length) || 3} changes:</p>
            <div className="mt-1.5 space-y-0.5">{docOut.docSections && docOut.docSections.map((s: any, i: number) => (<p key={i} className="text-[12.5px] text-gray-600 leading-relaxed">{i + 1}. <span className="font-medium text-gray-700">{s.title}</span> — {s.detail}</p>))}</div>
          </div>
          <div className="ml-11 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-4">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-gray-900 truncate">{docOut.title}</p></div>
              <button className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"><svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>View result</button>
            </div>
            <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg></div>
              <div className="flex-1 min-w-0"><p className="text-[12.5px] font-semibold text-gray-900 truncate">{docOut.docName}</p></div>
              <button className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Open document</button>
            </div>
          </div>
        </div>

        {/* ⑧ NEEDS CLARIFICATION — answer inline, result delivered as a new message */}
        <ScenarioLabel n="⑧" text="Needs clarification · answer inline" />
        <div className="mb-6">
          <BotLine time="9:22 AM" />
          <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ⚠️ Before I draft this, a few quick questions — <span className="font-medium text-gray-900">answer right here</span>:</p></div>
          <ClarificationCard task={clarificationTask} onSubmit={submitClarification} />
        </div>

        {clarifPhase !== 'pending' && (
          <div className="mb-6">
            <BotLine time="9:23 AM" />
            {clarifPhase === 'working' ? (
              <div className="ml-11 inline-flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 text-gray-500">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                <span className="text-[12.5px] font-medium">Thanks — drafting your roadmap summary now…</span>
              </div>
            ) : (
              <React.Fragment>
                <div className="ml-11 mb-3"><p className="text-[13px] text-gray-700 leading-relaxed"><span className="text-blue-600 font-semibold">@Alex Chen</span> — ✅ Based on your answers, your draft for <span className="font-medium">{clarificationTask.preparedDraft.target}</span> is ready:</p></div>
                <OutputCard
                  title={clarificationTask.title}
                  icon={<ChatBubbleIcon />}
                  body={clarificationTask.preparedDraft.output}
                  footer={<React.Fragment><CopyBtn id="clarif-draft" /><PrimaryAction onClick={() => jumpToChannel(clarificationTask.preparedDraft.target, clarificationTask.preparedDraft.output)} icon={jumpArrow}>Open {clarificationTask.preparedDraft.target}</PrimaryAction></React.Fragment>}
                />
              </React.Fragment>
            )}
          </div>
        )}
      </div>

      <InputBar />

      {/* Choose which chat to open / create group modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeSelector}>
          <div className="bg-white rounded-2xl shadow-2xl w-[380px] max-h-[480px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[15px] font-bold text-gray-900">Choose which chat to open</h4>
                <button onClick={closeSelector} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <p className="text-[12px] text-gray-400">Pick a person or channel — nothing sends.</p>
            </div>
            <div className="px-4 py-3">
              <div className="relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search or type a new group name…" value={forwardSearch} onChange={(e) => setForwardSearch(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50" autoFocus />
              </div>
            </div>
            <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed">{forwardMessage}</p>
            </div>
            <div className="px-2 pb-2">
              <p className="px-3 py-1.5 text-[11px] text-gray-400 font-medium uppercase tracking-wide">Suggested</p>
              <div className="overflow-y-auto max-h-[200px]">
                {filteredContacts.map((c) => (
                  <button key={c.id} onClick={() => handleSelect(c)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left group">
                    {c.type === 'channel' ? (<div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-bold flex-shrink-0">#</div>) : (<div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>{c.initials}</div>)}
                    <div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-gray-900 truncate">{c.name}</p><p className="text-[11px] text-gray-400">{c.type === 'channel' ? 'Channel' : 'Direct message'}</p></div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
                {/* Empty-state: create a new group chat */}
                {filteredContacts.length === 0 && (
                  <button onClick={() => handleCreateGroup(forwardSearch)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left group">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0"><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                    <div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-gray-900 truncate">Create group chat{forwardSearch ? ` “${forwardSearch}”` : ''}</p><p className="text-[11px] text-gray-400">Doesn't exist yet — create &amp; pre-fill the draft</p></div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Markdown version — links-only rendering
   ────────────────────────────────────────────────────────── */

const DemoVersionView = () => (
  <div className="flex-1 flex flex-col min-w-0">
    <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
      <DemoBotAvatar size="md" />
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-gray-900">Writing Tasks</h3>
          <span className="text-[10px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">MARKDOWN</span>
        </div>
        <p className="text-[11px] text-gray-400">Markdown + clickable links only</p>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto px-5 py-5">
      <DateDivider />

      {/* Task Detection */}
      <div className="mb-6 flex gap-3">
        <DemoBotAvatar />
        <div className="flex-1 min-w-0">
          <SenderLine time="9:15 AM" />
          <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed">
            <p className="font-bold text-gray-900 mb-1">✨ 4 new writing tasks are ready to go</p>
            <p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Writing tasks from <span className="font-semibold">Sprint Planning</span> <span className="text-gray-300 mx-1">|</span> <span className="text-[12px] text-gray-400">9:00–10:00 · Hosted by Sarah Chen</span></p>
            {meetingNotification.tasks.map((task: any, i: number) => (
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

      {/* Task Done: Chat message */}
      <div className="mb-6 flex gap-3"><DemoBotAvatar /><div className="flex-1 min-w-0"><SenderLine time="9:17 AM" /><div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed"><p className="font-bold text-gray-900 mb-1">✅ Task done: Post sprint update</p><p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your message for <span className="font-medium">#engineering</span> has been prepared:</p><div className="border-l-[3px] border-green-500 pl-3"><p className="text-[12.5px] text-gray-600 whitespace-pre-line">{autoCompletedOutputs[0].output}</p></div><ViewResultButton /></div></div></div>

      {/* Task Done: Email */}
      <div className="mb-6 flex gap-3"><DemoBotAvatar /><div className="flex-1 min-w-0"><SenderLine time="9:18 AM" /><div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed"><p className="font-bold text-gray-900 mb-1">✅ Task done: Stakeholder follow-up email</p><p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your email to <span className="font-medium">sarah.chen@company.com</span> has been prepared:</p><div className="border-l-[3px] border-green-500 pl-3"><p className="text-[12.5px] text-gray-600 whitespace-pre-line">{autoCompletedOutputs[1].output}</p></div><ViewResultButton /></div></div></div>

      {/* Task Done: Doc update */}
      <div className="mb-6 flex gap-3"><DemoBotAvatar /><div className="flex-1 min-w-0"><SenderLine time="9:18 AM" /><div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed"><p className="font-bold text-gray-900 mb-1">✅ Task done: Design specifications updated</p><p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your document has been updated with 3 changes:</p><p className="text-[12.5px] text-gray-600">1. <span className="font-medium text-gray-700">Grid Layout</span> — Updated to 12-column grid system</p><p className="text-[12.5px] text-gray-600">2. <span className="font-medium text-gray-700">Button Radius</span> — Revised from 4px to 8px globally</p><p className="text-[12.5px] text-gray-600 mb-2">3. <span className="font-medium text-gray-700">Accessibility</span> — Added ARIA label guidelines</p><div className="border-l-[3px] border-green-500 pl-3"><p className="text-[12.5px]">📄 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Design Specifications — Q1 Update</span></p></div><ViewResultButton /></div></div></div>

      {/* Task Done: Generic message */}
      <div className="mb-6 flex gap-3"><DemoBotAvatar /><div className="flex-1 min-w-0"><SenderLine time="9:19 AM" /><div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed"><p className="font-bold text-gray-900 mb-1">✅ Task done: Meeting recap</p><p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your message has been prepared:</p><div className="border-l-[3px] border-green-500 pl-3"><p className="text-[12.5px] text-gray-600 whitespace-pre-line">{autoCompletedOutputs[3].output}</p></div><ViewResultButton /></div></div></div>

      {/* Action Needed */}
      <div className="mb-6 flex gap-3"><DemoBotAvatar /><div className="flex-1 min-w-0"><SenderLine time="9:19 AM" /><div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed"><p className="font-bold text-gray-900 mb-1">⚠️ Action needed: {clarificationTask.title}</p><p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — This task needs more input before I can get started:</p><div className="border-l-[3px] border-amber-400 pl-3">{clarificationTask.questions.map((q: string, i: number) => (<p key={i} className="text-[12.5px] text-gray-600">{i + 1}. {q}</p>))}</div><div className="mt-3 pt-2 border-t border-gray-100"><button className="px-4 py-1.5 rounded-md text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Provide More Info</button></div></div></div></div>

      {/* Task Done: Multi-output */}
      <div className="mb-6 flex gap-3"><DemoBotAvatar /><div className="flex-1 min-w-0"><SenderLine time="9:22 AM" /><div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-[13px] text-gray-700 leading-relaxed"><p className="font-bold text-gray-900 mb-1">✅ Task done: Q1 business review package</p><p className="mb-2"><span className="text-blue-600 font-medium">@Alex Chen</span> — Your deliverables are ready. 3 files included:</p><div className="border-l-[3px] border-green-500 pl-3 space-y-1"><p className="text-[12.5px]">📊 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Q1 Business Review Deck</span></p><p className="text-[12.5px]">📋 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Q1 Revenue & Metrics Breakdown</span></p><p className="text-[12.5px]">📑 <span className="text-blue-600 hover:underline cursor-pointer font-medium">Customer Retention Data Table</span></p></div><ViewResultButton /></div></div></div>
    </div>
    <InputBar />
  </div>
);

/* ──────────────────────────────────────────────────────────
   App shell + sidebar
   ────────────────────────────────────────────────────────── */

const App = () => {
  const [selectedConvo, setSelectedConvo] = useState('full');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-gray-900">Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pt-2">
          {conversations.map((convo: any) => (
            <button key={convo.id} onClick={() => setSelectedConvo(convo.id)} className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors text-left ${selectedConvo === convo.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${convo.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {convo.id === 'full' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  )}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[13px] truncate ${convo.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{convo.name}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{convo.time}</span>
                </div>
                <p className={`text-[11.5px] truncate mt-0.5 ${convo.unread > 0 ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{convo.unread}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      {selectedConvo === 'full' ? <FullVersionView /> : <DemoVersionView />}
    </div>
  );
};

export default App;
