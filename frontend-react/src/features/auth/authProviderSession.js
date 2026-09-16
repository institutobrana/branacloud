export function shouldRunAuthRenewal({ authenticated, loggingOut, token }) {
  return Boolean(authenticated && !loggingOut && token);
}
