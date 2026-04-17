import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { RiInstagramFill } from 'react-icons/ri';

const socialLinks = [
  { href: '#', label: 'Facebook', icon: FaFacebookF, size: 18 },
  { href: '#', label: 'Instagram', icon: RiInstagramFill, size: 20 },
  { href: '#', label: 'X', icon: FaXTwitter, size: 18 },
];

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Cookies'];

const Footer = () => {
  return (
    <footer className="bg-emerald-800 pb-8 pt-16">
      <div className="container mx-auto flex flex-col items-center px-4 text-center">
        <div className="mb-6">
          <Link href="/"><Image src="/assets/logo-xl.png" alt="KeenKeeper" width={250} height={80} className="object-contain brightness-0 invert" /></Link>
        </div>
        <p className="mb-10 max-w-2xl text-sm text-emerald-50 md:text-base">Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.</p>

        <div className="mb-12 flex flex-col items-center">
          <p className="mb-4 font-bold text-white">Social Links</p>
          <ul className="flex gap-4">
            {socialLinks.map(({ href, label, icon: Icon, size }) => (
              <li key={label}>
                <Link href={href} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-gray-200">
                  <Icon size={size} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-emerald-800/50 pt-8 text-xs text-emerald-100 md:flex-row md:text-sm">
          <p>&copy; 2026 KeenKeeper. All rights reserved.</p>
          <div className="flex gap-6">
            {footerLinks.map((label) => (
              <Link key={label} href="#" className="transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
