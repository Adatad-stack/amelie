export default function IntroMessage({ visible }) {
  return (
    <div
      className={`transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } flex items-center justify-center gap-4 p-8`}
    >
      <img
        src="/amelie_grand.png"
        alt="Amélie"
        className="w-20 h-20 rounded-full shadow-md object-cover"
      />
      <h1 className="text-2xl font-semibold text-gray-800">
        En quoi puis-je vous aider ?
      </h1>
    </div>
  );
}
