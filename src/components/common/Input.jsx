function Input({ label, rightIcon, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-bold uppercase text-white">
          {label}
        </label>
      )}

      <div className="flex items-center rounded-full bg-white/35 px-4">
        <input
          {...props}
          className="w-full bg-transparent py-3 text-sm font-semibold text-white placeholder:text-white/70 outline-none"
        />

        {rightIcon}
      </div>
    </div>
  );
}

export default Input;