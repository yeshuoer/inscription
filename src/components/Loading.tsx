export default function Loading() {
  return (
    <div className="fixed z-50 left-0 top-0 w-screen h-screen bg-base-100 translate-y-16 flex justify-center items-center">
      <span className="loading loading-dots loading-lg text-primary"></span>
    </div>
  );
}
