export const AUTH_RENEW_INTERVAL_MS = 15 * 60 * 1000;
export const AUTH_RENEW_RETRY_DELAYS_MS = [30 * 1000, 60 * 1000];

function isTransientError(error) {
  if (!error) return false;
  if (error.status === 500) return true;
  if (error.status == null) return true;
  return Boolean(error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.name === 'TypeError');
}

function isDefinitiveError(error) {
  return Boolean(
    error &&
      (error.status === 401 ||
        error.status === 403 ||
        error.code === 'AUTH_REJECTED' ||
        error.code === 'AUTH_INVALID_RESPONSE'),
  );
}

export function createAuthRenewalController({
  renewToken,
  getToken,
  setToken,
  clearToken,
  onSessionInvalid = () => {},
  setTimeout: schedule = setTimeout,
  clearTimeout: cancelSchedule = clearTimeout,
} = {}) {
  if (typeof renewToken !== 'function') {
    throw new TypeError('renewToken e obrigatorio.');
  }
  if (typeof getToken !== 'function') {
    throw new TypeError('getToken e obrigatorio.');
  }
  if (typeof setToken !== 'function') {
    throw new TypeError('setToken e obrigatorio.');
  }
  if (typeof clearToken !== 'function') {
    throw new TypeError('clearToken e obrigatorio.');
  }

  let running = false;
  let sessionVersion = 0;
  let timerId = null;
  let currentPromise = null;
  let retryIndex = 0;
  let invalidated = false;
  let invalidationNotified = false;

  const clearTimer = () => {
    if (timerId !== null) {
      cancelSchedule(timerId);
      timerId = null;
    }
  };

  const scheduleRenewal = (delayMs = AUTH_RENEW_INTERVAL_MS) => {
    clearTimer();
    if (!running) return;
    const capturedVersion = sessionVersion;
    timerId = schedule(() => {
      timerId = null;
      if (!running || capturedVersion !== sessionVersion) return;
      void renewNow();
    }, delayMs);
  };

  const invalidateSession = () => {
    if (invalidationNotified) return;
    invalidationNotified = true;
    try {
      onSessionInvalid();
    } catch {
      // callback externo nao deve quebrar o controlador
    }
  };

  const stop = () => {
    running = false;
    invalidated = true;
    sessionVersion += 1;
    clearTimer();
    currentPromise = null;
  };

  const syncExternalToken = (nextToken) => {
    const normalizedToken = String(nextToken || '').trim();
    if (!normalizedToken) {
      return { synced: false, running, sessionVersion };
    }

    const wasRunning = running;
    if (!wasRunning) {
      running = true;
      invalidated = false;
      invalidationNotified = false;
    }

    retryIndex = 0;
    sessionVersion += 1;
    clearTimer();
    scheduleRenewal(AUTH_RENEW_INTERVAL_MS);
    setToken(normalizedToken);

    return {
      synced: true,
      running,
      started: !wasRunning,
      sessionVersion,
    };
  };

  const handleSuccess = (response, capturedVersion) => {
    if (!running || invalidated || capturedVersion !== sessionVersion) {
      return { ignored: true };
    }

    const nextToken = String(response?.accessToken || '').trim();
    if (!nextToken) {
      stop();
      clearToken();
      invalidateSession();
      return { invalid: true };
    }

    setToken(nextToken);
    retryIndex = 0;
    scheduleRenewal(AUTH_RENEW_INTERVAL_MS);
    return { accessToken: nextToken, tokenType: response.tokenType, expiresIn: response.expiresIn };
  };

  const handleFailure = (error, capturedVersion) => {
    if (!running || invalidated || capturedVersion !== sessionVersion) {
      return { ignored: true };
    }

    if (isDefinitiveError(error)) {
      stop();
      clearToken();
      invalidateSession();
      return { invalid: true, error };
    }

    if (!isTransientError(error) || retryIndex >= AUTH_RENEW_RETRY_DELAYS_MS.length) {
      retryIndex = 0;
      return { transient: false, error };
    }

    const delayMs = AUTH_RENEW_RETRY_DELAYS_MS[retryIndex];
    retryIndex += 1;
    scheduleRenewal(delayMs);
    return { transient: true, error, retryIn: delayMs };
  };

  const renewNow = () => {
    if (!running || invalidated) {
      return null;
    }

    if (currentPromise) {
      return currentPromise;
    }

    const capturedVersion = sessionVersion;
    const token = getToken();
    if (!token) {
      clearTimer();
      return null;
    }

    currentPromise = Promise.resolve()
      .then(() => renewToken(token))
      .then((response) => handleSuccess(response, capturedVersion))
      .catch((error) => {
        const handled = handleFailure(error, capturedVersion);
        if (handled && handled.invalid) {
          return handled;
        }
        if (handled && handled.transient) {
          return handled;
        }
        return handled;
      })
      .finally(() => {
        currentPromise = null;
      });

    return currentPromise;
  };

  const start = () => {
    if (running) {
      return { started: true, running: true, sessionVersion };
    }

    const token = getToken();
    if (!token) {
      clearTimer();
      return { started: false, running: false, sessionVersion };
    }

    running = true;
    invalidated = false;
    invalidationNotified = false;
    retryIndex = 0;
    sessionVersion += 1;
    scheduleRenewal(AUTH_RENEW_INTERVAL_MS);
    return { started: true, running: true, sessionVersion };
  };

  const isRunning = () => running;

  return {
    start,
    stop,
    renewNow,
    isRunning,
    syncExternalToken,
  };
}
