"use client";
import { BarChart3, History, Home, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/timeline", label: "Timeline", icon: History },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1">
          <Link href="/">
            <Image src="/assets/logo.png" alt="KeenKeeper" width={150} height={40} className="object-contain" />
          </Link>
        </div>
        <div className="flex-none">
          <ul className="flex items-center gap-2 md:gap-4">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-800 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden md:inline">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
