function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    rightIcon,
    className = "",
  }) {
    return (
      <div className={className}>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-white">
          {label}
        </label>
  
        <div className="flex h-9 items-center rounded-full bg-white/30 px-4">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-transparent text-[11px] font-medium text-white placeholder:text-white/80 outline-none"
          />
  
          {rightIcon && <div className="ml-2 flex text-white">{rightIcon}</div>}
        </div>
      </div>
    );
  }
  
  export default Input;