import React, { useState } from 'react'
import { MENTOR_SUGGESTIONS } from '../data/catalog'
import { usePlatform } from '../context/PlatformContext'

export const MentorWidget: React.FC = () => {
  const { isMentorOpen, setIsMentorOpen, mentorMessages, sendMentorMessage } = usePlatform()
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (!inputText.trim()) return
    sendMentorMessage(inputText.trim())
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      <button
        onClick={() => setIsMentorOpen(!isMentorOpen)}
        className="fixed bottom-5 right-5 w-10 h-10 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] flex items-center justify-center shadow-lg transition-colors z-50 cursor-pointer text-xs"
        title="Mentor IA"
      >
        <i className={`fa-solid ${isMentorOpen ? 'fa-xmark' : 'fa-robot'}`}></i>
      </button>

      {isMentorOpen && (
        <div className="fixed bottom-16 right-5 w-80 max-w-[calc(100vw-2rem)] h-96 bg-[var(--surface)] border border-[var(--border)] rounded shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="px-4 py-2.5 bg-[var(--bg-alt)] border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[var(--text)]">Mentor IA</span>
            <button
              onClick={() => setIsMentorOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer text-xs"
            >
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {mentorMessages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded p-2.5 text-xs leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-[var(--primary)] text-[var(--primary-text)] font-medium'
                      : 'bg-[var(--bg-alt)] text-[var(--text)] border border-[var(--border)]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 border-t border-[var(--border)] bg-[var(--bg-alt)] space-y-2">
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {MENTOR_SUGGESTIONS.slice(0, 2).map((sugg, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMentorMessage(sugg)}
                  className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] whitespace-nowrap cursor-pointer"
                >
                  {sugg}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta algo..."
                className="platform-input text-xs py-1 px-2"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="platform-btn-primary py-1 px-2.5 text-xs disabled:opacity-40"
              >
                <i className="fa-solid fa-paper-plane text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
