function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-[1180px]">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;