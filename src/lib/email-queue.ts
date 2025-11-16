/**
 * Email Queue System
 * Handles rate limiting by queuing emails and sending them with delays
 */

interface QueuedEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  timestamp: number;
  retries: number;
}

class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;
  private readonly RATE_LIMIT_DELAY = 600; // 600ms = ~1.6 emails/second (safe margin)
  private readonly MAX_RETRIES = 3;

  /**
   * Add email to queue
   */
  async enqueue(to: string, subject: string, html: string): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const email: QueuedEmail = {
      id,
      to,
      subject,
      html,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(email);

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }

    return id;
  }

  /**
   * Process queue with rate limiting
   */
  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const email = this.queue.shift();
      if (!email) break;

      try {
        // Send email
        await this.sendEmail(email);
        console.log(`✅ Email sent: ${email.id} to ${email.to}`);
      } catch (error) {
        console.error(`❌ Email failed: ${email.id}`, error);

        // Retry logic
        if (email.retries < this.MAX_RETRIES) {
          email.retries++;
          this.queue.push(email); // Re-queue
          console.log(
            `🔄 Retrying email: ${email.id} (attempt ${email.retries})`
          );
        } else {
          console.error(`💀 Email permanently failed: ${email.id}`);
          // TODO: Log to error tracking system
        }
      }

      // Wait before next email (rate limiting)
      if (this.queue.length > 0) {
        await this.delay(this.RATE_LIMIT_DELAY);
      }
    }

    this.processing = false;
  }

  /**
   * Send email using Resend
   */
  private async sendEmail(email: QueuedEmail) {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email.to,
        subject: email.subject,
        html: email.html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      oldestEmail: this.queue[0]?.timestamp,
    };
  }
}

// Singleton instance
export const emailQueue = new EmailQueue();

/**
 * Helper function to queue an email
 */
export async function queueEmail(to: string, subject: string, html: string) {
  return emailQueue.enqueue(to, subject, html);
}
