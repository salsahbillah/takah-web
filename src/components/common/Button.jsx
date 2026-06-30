function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
  }) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded-full bg-[var(--color-primary)] px-7 py-2 text-sm font-bold text-white transition duration-200 hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {children}
      </button>
    );
  }
  
  export default Button;