import { Plus } from 'lucide-react';

const Banner = () => {
  return (
    <div className="container mx-auto mt-8 flex flex-col items-center justify-center gap-6 px-4 md:mt-16">
      <h1 className="text-center text-4xl font-bold tracking-tight text-[#1C2024] md:text-[44px]">Friends to keep close in your life</h1>
      <p className="max-w-2xl text-center text-lg text-gray-500 md:text-xl">Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.</p>
      <button className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-900">
        <Plus size={20} /> Add a Friend
      </button>
    </div>
  );
};

export default Banner;
