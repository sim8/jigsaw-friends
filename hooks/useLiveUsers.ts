import { useMemo } from 'react';
import useGame from './useGame';
import { UserState } from '../types';
import { COLOR_OPTIONS } from '../constants/colors';

export default function useLiveUsers() {
  const { liveUsers } = useGame();

  const orderedLiveUserIds = useMemo(
    () =>
      Object.entries(liveUsers)
        .sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
        .map(([uid]) => uid),
    [liveUsers],
  );

  const liveUsersWithColors = useMemo(() => {
    const withColors: Record<string, UserState & { color: string }> = {};
    return Object.entries(liveUsers).reduce((acc, [uid, liveUser], index) => {
      acc[uid] = {
        ...liveUser,
        color: COLOR_OPTIONS[index % COLOR_OPTIONS.length],
      };
      return acc;
    }, withColors);
  }, [liveUsers]);

  return { orderedLiveUserIds, liveUsersWithColors };
}
