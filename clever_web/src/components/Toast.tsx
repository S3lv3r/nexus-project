import React, { useEffect } from 'react'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ toast: ToastData; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  let bgClass = 'bg-[var(--text)] text-[var(--bg)] shadow-lg'
  let iconClass = 'fa-solid fa-circle-info text-[var(--primary)]'

  if (toast.type === 'success') {
    bgClass = 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
    iconClass = 'fa-solid fa-circle-check text-white'
  } else if (toast.type === 'error') {
    bgClass = 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
    iconClass = 'fa-solid fa-circle-exclamation text-white'
  }

  return (
    <div
      className={`pointer-events-auto p-3 rounded flex items-center justify-between gap-3 text-xs font-medium border border-black/5 ${bgClass}`}
    >
      <div className="flex items-center gap-2.5">
        <i className={`${iconClass} text-sm`}></i>
        <span>{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer opacity-80"
      >
        <i className="fa-solid fa-xmark text-xs"></i>
      </button>
    </div>
  )
}
