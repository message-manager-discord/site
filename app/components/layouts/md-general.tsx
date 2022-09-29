// Layout component

// Takes react children from props
// For markdown pages - adds correct margin and padding

export default function MDGeneral({ children }: { children: React.ReactNode }) {
  return (
    <div className="container shrink mx-auto pl-14 pr-5 md:px-6 lg:px-14 min-w-0 pt-5 grow">
      {children}
    </div>
  );
}
