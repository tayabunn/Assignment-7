"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  FRIENDS_DATA_PATH,
  getFriendStatus,
  type Friend,
} from "@/lib/friends";

export type InteractionType = "Call" | "Message" | "Video";

export interface TimelineItem {
  id: string;
  friendId: number;
  type: InteractionType;
  with: string;
  date: string;
  icon: string;
  timestamp: string;
}

export interface RelationshipState {
  friends: Friend[];
  timeline: TimelineItem[];
}

const STORAGE_KEY = "keenkeeper-relationship-state-v1";
const interactionTypes: InteractionType[] = ["Call", "Message", "Video"];
const interactionIcons: Record<InteractionType, string> = {
  Call: "/assets/call.png",
  Message: "/assets/text.png",
  Video: "/assets/video.png",
};
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const listeners = new Set<() => void>();

let snapshot: RelationshipState | null = null;
let loadPromise: Promise<RelationshipState> | null = null;

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const toDateString = (date: Date) => dateFormatter.format(date);
const toIsoDate = (date: Date) => date.toISOString().split("T")[0];

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return null;
}

function normalizeInteractionType(type: string): InteractionType {
  if (type === "Text") {
    return "Message";
  }

  if (type === "Call" || type === "Message" || type === "Video") {
    return type;
  }

  return "Message";
}

function normalizeFriend(friend: Friend) {
  const daysSinceContact = Math.max(0, Math.floor(friend.days_since_contact));
  const nextDueDate = addDays(new Date(), friend.goal - daysSinceContact);

  return {
    ...friend,
    days_since_contact: daysSinceContact,
    next_due_date: toIsoDate(nextDueDate),
    status: getFriendStatus(daysSinceContact, friend.goal),
  };
}

function sortTimeline(timeline: TimelineItem[]) {
  return [...timeline].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  );
}

function createTimelineItem(friend: Friend, type: InteractionType, timestamp: Date, id: string) {
  return {
    id,
    friendId: friend.id,
    type,
    with: friend.name,
    date: toDateString(timestamp),
    icon: interactionIcons[type],
    timestamp: timestamp.toISOString(),
  };
}

function createSeedTimeline(friends: Friend[]) {
  return sortTimeline(
    [...friends]
      .sort((left, right) => left.days_since_contact - right.days_since_contact)
      .map((friend, index) => {
        const timestamp = addDays(new Date(), -friend.days_since_contact);
        const type = interactionTypes[index % interactionTypes.length];

        return createTimelineItem(friend, type, timestamp, `seed-${friend.id}`);
      }),
  );
}

function normalizeTimelineItem(item: TimelineItem) {
  const type = normalizeInteractionType(item.type);

  return {
    ...item,
    type,
    icon: interactionIcons[type],
  };
}

function isRelationshipState(value: unknown): value is RelationshipState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as RelationshipState;
  return Array.isArray(state.friends) && Array.isArray(state.timeline);
}

function readStoredState() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return null;
  }

  try {
    const parsedState = JSON.parse(rawState) as unknown;

    if (!isRelationshipState(parsedState)) {
      return null;
    }

    return {
      friends: parsedState.friends.map(normalizeFriend),
      timeline: sortTimeline(parsedState.timeline.map(normalizeTimelineItem)),
    };
  } catch {
    return null;
  }
}

function persistState(state: RelationshipState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function fetchInitialState() {
  const response = await fetch(FRIENDS_DATA_PATH);
  const data = (await response.json()) as Friend[];
  const friends = data.map(normalizeFriend);

  return {
    friends,
    timeline: createSeedTimeline(friends),
  };
}

export async function ensureRelationshipState() {
  if (snapshot) {
    return snapshot;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const storedState = readStoredState();

    if (storedState) {
      snapshot = storedState;
      persistState(storedState);
      notify();
      return storedState;
    }

    const initialState = await fetchInitialState();

    snapshot = initialState;
    persistState(initialState);
    notify();
    return initialState;
  })();

  try {
    return await loadPromise;
  } finally {
    loadPromise = null;
  }
}

export async function recordInteraction(friendId: number, type: InteractionType) {
  const currentState = await ensureRelationshipState();
  const interactionTime = new Date();
  let updatedFriend: Friend | null = null;

  const friends = currentState.friends.map((friend) => {
    if (friend.id !== friendId) {
      return friend;
    }

    updatedFriend = normalizeFriend({
      ...friend,
      days_since_contact: 0,
    });

    return updatedFriend;
  });

  if (!updatedFriend) {
    return currentState;
  }

  const timeline = [
    createTimelineItem(updatedFriend, type, interactionTime, `event-${interactionTime.getTime()}-${friendId}`),
    ...currentState.timeline,
  ];

  const nextState = {
    friends,
    timeline: sortTimeline(timeline),
  };

  snapshot = nextState;
  persistState(nextState);
  notify();

  return nextState;
}

export function useRelationshipData() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isLoading, setIsLoading] = useState(state === null);

  useEffect(() => {
    let isMounted = true;

    ensureRelationshipState()
      .catch((error) => {
        console.error("Failed to initialize relationship data", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data: state,
    isLoading: isLoading || state === null,
  };
}
