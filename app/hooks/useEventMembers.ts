import { useEffect, useState } from "react";
import { fetchEventMembers } from "~/services/fetchEventMembers";

export interface EventMember {
  id: number;
  name: string;
  firebase_uid: string;
}

interface UseEventMembersResult {
  members: EventMember[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch event members by eventId.
 * Handles loading and error states.
 */
export function useEventMembers(eventId?: string): UseEventMembersResult {
  const [members, setMembers] = useState<EventMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setMembers([]);
      setError("eventId is required");
      return;
    }
    setIsLoading(true);
    setError(null);
    fetchEventMembers(eventId)
      .then(setMembers)
      .catch((err) => {
        setError(err.message || "取得成員失敗");
        setMembers([]);
      })
      .finally(() => setIsLoading(false));
  }, [eventId]);

  return { members, isLoading, error };
}
