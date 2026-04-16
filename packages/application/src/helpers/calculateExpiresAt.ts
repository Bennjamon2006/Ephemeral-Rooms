const TTLS = {
  empty: 60 * 1000, // 1 minute
  occupied: 60 * 60 * 1000, // 1 hour
};

type State = keyof typeof TTLS;

export default function calculateExpiresAt(state: State): number {
  return Date.now() + TTLS[state];
}
