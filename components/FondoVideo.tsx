export default function FondoVideo() {
  return (
    <div className="fixed inset-0 z-0 bg-[#050508]" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover opacity-60"
      >
        <source src="/fondo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
