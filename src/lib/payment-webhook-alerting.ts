type FailureChannel = 'stripe' | 'paypal';
type FailureCategory =
  | 'webhook_signature_invalid'
  | 'webhook_processing_failed'
  | 'payment_failed'
  | 'payment_denied';

type AlertDetails = {
  requestId?: string;
  message?: string;
  eventType?: string;
  paymentId?: string;
};

type CounterState = {
  count: number;
  firstFailureAt: number;
  lastFailureAt: number;
};

const counters = new Map<string, CounterState>();
const lastAlertTimes = new Map<string, number>();

const FAILURE_WINDOW_MS = Number(
  process.env.PAYMENT_ALERT_WINDOW_MS || 10 * 60 * 1000,
);
const FAILURE_THRESHOLD_COUNT = Number(
  process.env.PAYMENT_ALERT_THRESHOLD_COUNT || 3,
);
const ALERT_COOLDOWN_MS = Number(
  process.env.PAYMENT_ALERT_COOLDOWN_MS || 15 * 60 * 1000,
);
const ALERT_WEBHOOK_URL = process.env.PAYMENT_ALERT_WEBHOOK_URL || '';

function getCounterKey(channel: FailureChannel, category: FailureCategory) {
  return `${channel}:${category}`;
}

function getCounter(channel: FailureChannel, category: FailureCategory) {
  const now = Date.now();
  const key = getCounterKey(channel, category);
  const current = counters.get(key);

  if (!current || now - current.firstFailureAt > FAILURE_WINDOW_MS) {
    const reset = { count: 0, firstFailureAt: now, lastFailureAt: now };
    counters.set(key, reset);
    return { key, state: reset };
  }

  return { key, state: current };
}

function shouldTriggerAlert(key: string, count: number) {
  if (count < FAILURE_THRESHOLD_COUNT) return false;
  const lastAlertAt = lastAlertTimes.get(key);
  if (!lastAlertAt) return true;
  return Date.now() - lastAlertAt > ALERT_COOLDOWN_MS;
}

async function sendAlertWebhook(payload: Record<string, unknown>) {
  if (!ALERT_WEBHOOK_URL) return false;
  try {
    const response = await fetch(ALERT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function recordPaymentWebhookFailure(
  channel: FailureChannel,
  category: FailureCategory,
  details: AlertDetails = {},
) {
  const now = Date.now();
  const { key, state } = getCounter(channel, category);
  state.count += 1;
  state.lastFailureAt = now;
  counters.set(key, state);

  if (!shouldTriggerAlert(key, state.count)) {
    return { alertTriggered: false, count: state.count };
  }

  lastAlertTimes.set(key, now);
  const payload = {
    level: 'critical',
    type: 'payment_webhook_alert',
    channel,
    category,
    count: state.count,
    threshold: FAILURE_THRESHOLD_COUNT,
    windowMs: FAILURE_WINDOW_MS,
    requestId: details.requestId || null,
    eventType: details.eventType || null,
    paymentId: details.paymentId || null,
    message: details.message || null,
    timestamp: new Date(now).toISOString(),
  };

  const delivered = await sendAlertWebhook(payload);
  console.error(
    JSON.stringify({
      ...payload,
      delivery: delivered ? 'webhook_sent' : 'webhook_not_configured_or_failed',
    }),
  );

  return { alertTriggered: true, count: state.count, delivered };
}
