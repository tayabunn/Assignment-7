"use client";
import FriendsInfoCard from "./FriendsInfoCard";
import {
  isOnTrackStatus,
  needsAttentionStatus,
} from "@/lib/friends";
import {
  type RelationshipState,
  useRelationshipData,
} from "@/lib/relationship-store";

const loadingSummary = {
  totalFriends: 10,
  onTrack: 3,
  needAttention: 6,
  interactionsThisMonth: 12,
};

interface FriendsProps {
  data?: RelationshipState | null;
}

const Friends = ({ data: providedData }: FriendsProps) => {
  const relationshipState = useRelationshipData();
  const data = providedData ?? relationshipState.data;
  const friends = data?.friends ?? [];

  const totalFriends = friends.length;
  const onTrack = friends.filter((friend) => isOnTrackStatus(friend.status)).length;
  const needAttention = friends.filter((friend) => needsAttentionStatus(friend.status)).length;
  const interactionsThisMonth =
    data?.timeline.filter((item) => {
      const interactionDate = new Date(item.timestamp);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      return interactionDate >= cutoffDate;
    }).length ?? 0;

  const summaryCards = [
    { label: "Total Friends", value: providedData ? totalFriends : loadingSummary.totalFriends },
    { label: "On Track", value: providedData ? onTrack : loadingSummary.onTrack },
    { label: "Need Attention", value: providedData ? needAttention : loadingSummary.needAttention },
    {
      label: "Interactions This Month",
      value: providedData ? interactionsThisMonth : loadingSummary.interactionsThisMonth,
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-12 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-md border border-gray-200">
            <span className="text-4xl font-bold text-[#1C2024]">{card.value}</span>
            <p className="text-gray-500 text-sm md:text-base mt-2 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#1C2024] text-center md:text-left mb-8">Your Friends</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {friends.map((friend) => (
            <FriendsInfoCard key={friend.id} friend={friend} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
