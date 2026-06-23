import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="miposting">
      <img src="/miposting-favi.svg" alt="miposting" className="h-7 w-7" />
      <span className="text-lg font-bold text-gray-800">miposting</span>
    </Link>
  );
}
