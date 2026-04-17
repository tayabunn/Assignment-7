"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Archive,
  Clock,
  MessageSquare,
  Phone,
  Trash2,
  Video,
  type LucideIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  formatFriendStatus,
  getFriendStatusClasses,
} from "@/lib/friends";
import PageSpinner from "@/components/PageSpinner";
import {
  recordInteraction,
  type InteractionType,
  useRelationshipData,
} from "@/lib/relationship-store";
import { usePageSpinner } from "@/lib/use-page-spinner";

const sideActions: { label: string; icon: LucideIcon; className?: string }[] = [
  { label: "Snooze 2 Weeks", icon: Clock },
  { label: "Archive", icon: Archive },
  { label: "Delete", icon: Trash2, className: "text-[#EF4444] hover:bg-red-50" },
];

const interactionActions: { label: string; icon: LucideIcon }[] = [
  { label: "Call", icon: Phone },
  { label: "Message", icon: MessageSquare },
  { label: "Video", icon: Video },
];

const FriendDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useRelationshipData();
  const isPageSpinnerActive = usePageSpinner();
  const [pendingAction, setPendingAction] = useState<InteractionType | null>(null);
  const friend = data?.friends.find((item) => String(item.id) === id) ?? null;

  if (isLoading || isPageSpinnerActive) {
    return <PageSpinner label="Loading friend details..." />;
  }

  if (!friend) {
    notFound();
  }

  return (
    <div className="container mx-auto mt-12 mb-20 max-w-5xl px-4">
      <Toaster position="top-center" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-1">
          <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8 shadow-md">
            <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-gray-100">
              <Image src={friend.picture} alt={friend.name} fill className="object-cover" />
            </div>
            <h2 className="mb-3 text-xl font-bold text-[#1C2024]">{friend.name}</h2>

            <span
              className={`${getFriendStatusClasses(friend.status)} mb-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase`}>
              {formatFriendStatus(friend.status)}
            </span>

            <div className="mb-6 flex flex-wrap justify-center gap-1">
              {friend.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-[#E6F4EA] px-2 py-1 text-[9px] font-bold uppercase text-[#0A7A57]">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mb-4 text-center text-sm italic text-gray-500">
              &quot;{friend.bio}&quot;
            </p>
            <p className="text-xs text-gray-400">Preferred: {friend.email}</p>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#1C2024] shadow-md">
            {sideActions.map(({ label, icon: Icon, className }) => (
              <button
                key={label}
                className={`flex items-center justify-center gap-2 py-4 transition-colors ${
                  label !== sideActions[sideActions.length - 1].label ? "border-b border-gray-100 hover:bg-gray-50" : ""
                } ${className ?? "hover:bg-gray-50"}`}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
              <span className="mb-1 text-3xl font-bold text-emerald-800">{friend.days_since_contact}</span>
              <span className="text-xs text-gray-500">Days Since Contact</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
              <span className="mb-1 text-3xl font-bold text-emerald-800">{friend.goal}</span>
              <span className="text-xs text-gray-500">Goal (Days)</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
              <span className="mb-2 text-xl font-bold text-emerald-800">
                {new Date(friend.next_due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs text-gray-500">Next Due</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-[#1C2024]">Relationship Goal</h3>
              <button className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100">
                Edit
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Connect every <span className="font-bold text-[#1C2024]">{friend.goal} days</span>
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="mb-4 text-[15px] font-medium text-[#1C2024]">Quick Check-In</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {interactionActions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={async () => {
                    setPendingAction(label as InteractionType);

                    try {
                      await recordInteraction(friend.id, label as InteractionType);
                      toast.success(`${label} with ${friend.name} added to your timeline.`);
                    } catch (error) {
                      console.error("Failed to record interaction", error);
                      toast.error("Could not save that interaction.");
                    } finally {
                      setPendingAction(null);
                    }
                  }}
                  disabled={pendingAction !== null}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 py-6 text-sm font-medium text-[#1C2024] transition-all hover:border-gray-200 hover:bg-gray-100"
                >
                  <Icon size={24} />
                  {pendingAction === label ? "Saving..." : label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDetails;
