import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-1" aria-label="miposting">
      <img src="/miposting-favi.png" alt="miposting" className="h-full w-12" />
      <span className="text-lg font-bold text-gray-800">MIPOSTING</span>
    </Link>
  );
}
