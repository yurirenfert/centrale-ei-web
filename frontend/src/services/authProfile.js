export function buildProfile({ user }) {
  return {
    userId: user.id,
    email: user.email,
    displayName: user.nickname,
  };
}
