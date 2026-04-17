import Image from "next/image";
import Link from "next/link";
import {
  type Friend,
  formatFriendStatus,
  getFriendStatusClasses,
} from "@/lib/friends";

const FriendsInfoCard = ({ friend }: { friend: Friend }) => {
  return (
    <Link href={`/friends/${friend.id}`} className="bg-white rounded-xl p-6 w-full flex flex-col justify-center items-center shadow-md border border-gray-200 transition-transform hover:-translate-y-1">
      <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden mb-4">
        <Image
          src={friend.picture}
          alt={friend.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-[17px] text-[#1C2024] font-bold">{friend.name}</h3>
      <p className="text-xs text-gray-400 mt-1 italic">{friend.days_since_contact}d ago</p>
      
      <div className="flex gap-2 mt-3 mb-4 flex-wrap justify-center">
        {friend.tags?.map((tag) => (
            <span
            key={tag}
            className="bg-[#E6F4EA] text-[#0A7A57] text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                {tag}
            </span>
        ))}
      </div>
      
      <span className={`${getFriendStatusClasses(friend.status)} text-xs px-4 py-1.5 rounded-full font-semibold capitalize`}>
        {formatFriendStatus(friend.status)}
      </span>
    </Link>
  );
};

export default FriendsInfoCard;
