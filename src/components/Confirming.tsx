export default function Confirming() {
  return (
    <div className="fixed z-50 left-0 top-0 w-screen h-screen bg-base-100 translate-y-16 flex justify-center items-center">
      <div className="flex items-center">
        <p className="text-2xl text-secondary mr-2">Confirming</p>
        <span className="loading loading-bars text-secondary loading-lg"></span>
      </div>
    </div>
  );
}
