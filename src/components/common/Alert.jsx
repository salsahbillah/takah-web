import { CheckCircle2, Info, X, XCircle } from "lucide-react";

function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      icon: CheckCircle2,
      box: "border-white/20 bg-[#0f766e]/95 text-white",
    },
    error: {
      icon: XCircle,
      box: "border-white/20 bg-[#991b1b]/95 text-white",
    },
    info: {
      icon: Info,
      box: "border-white/20 bg-[#1d4ed8]/95 text-white",
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div className="fixed left-1/2 top-8 z-[9999] w-[90%] max-w-md -translate-x-1/2 animate-[slideDown_0.25s_ease-out]">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold shadow-2xl backdrop-blur-md ${current.box}`}
      >
        <Icon size={18} className="shrink-0" />

        <p className="flex-1 leading-relaxed">{message}</p>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;