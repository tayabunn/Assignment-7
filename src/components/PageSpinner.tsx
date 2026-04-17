interface PageSpinnerProps {
  label?: string;
  fullHeight?: boolean;
}

const PageSpinner = ({
  label = "Loading...",
  fullHeight = true,
}: PageSpinnerProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 px-4 text-center ${
        fullHeight ? "min-h-[60vh]" : "min-h-[280px]"
      }`}
    >
      <span className="loading loading-spinner loading-lg text-[#22574A]" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
};

export default PageSpinner;
