export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 hover:bg-slate-100"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
