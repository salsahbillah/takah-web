function PageHeader({
  label,
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
}) {
  return (
    <div className="mb-4 flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-[#002248] to-[#2680BE] px-6 py-5 text-white shadow-md lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        {label && <p className="text-xs text-white/75">{label}</p>}

        <h1 className="mt-1 text-xl font-extrabold leading-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-[720px] text-xs leading-relaxed text-white/75">
            {description}
          </p>
        )}
      </div>

      {buttonText && (
        <button
          type="button"
          onClick={onButtonClick}
          className="flex h-11 w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-[#002248] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
        >
          {ButtonIcon && <ButtonIcon size={16} />}
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default PageHeader;