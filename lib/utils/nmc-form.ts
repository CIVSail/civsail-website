const NMC_FORM_ENDPOINT =
  "https://forms.osi.apps.mil/formapi/api/369ba0d5-02cb-4d2f-94fd-9212cc24b78c/users/7291a6e4-71ac-478e-a368-70a62e714d0f/forms('1aCbNssCL02U_ZISzCS3jOSmkXKscY5Ho2hwpi5xTQ9UNFVSUjlHRkZNWktBMDdWSTg4QlpaVUMwUy4u')/responses";

const NMC_FORM_REFERER =
  "https://forms.osi.apps.mil/pages/responsepage.aspx?id=1aCbNssCL02U_ZISzCS3jOSmkXKscY5Ho2hwpi5xTQ9UNFVSUjlHRkZNWktBMDdWSTg4QlpaVUMwUy4u&route=shorturl";

// Question IDs captured from the live NMC credential verification form (March 2026).
// If the form ever stops working, re-capture via Chrome DevTools → Network tab.
const Q_LAST_NAME  = "rddeaa1e1d7cd4eb08a024cf20102bb7d";
const Q_REF_NUMBER = "r979777f728ad4b9ca1fa99e0f87b9d2b";
const Q_EMAIL      = "ra5b6b1728ccf4b88baae35c404695110";

/**
 * Submit the NMC Credential Verification Microsoft Form on behalf of a mariner.
 *
 * The NMC system emails results to the provided address. CIVSail uses a shared
 * inbox (credentials@civsail.com) so the cron job can match responses back to
 * the correct user via their reference number.
 *
 * This function is stateless and safe to call concurrently — each invocation
 * fires an independent HTTP request with no shared state.
 *
 * @param lastName  - Mariner's last name exactly as it appears on their MMC
 * @param refNumber - 7-digit NMC reference number
 * @param email     - Email address to receive the NMC response (credentials@civsail.com)
 */
export async function submitNMCForm(
  lastName: string,
  refNumber: string,
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const startDate = new Date();

  // Simulate a realistic form fill time (30–90 seconds). Without this the
  // submission arrives with startDate === submitDate, which looks like a bot.
  const fillSeconds = 30 + Math.floor(Math.random() * 60);
  const submitDate = new Date(startDate.getTime() + fillSeconds * 1000);

  // The MS Forms API expects `answers` as a JSON-stringified string, not a
  // nested object — this matches the payload shape captured from the live form.
  const answers = JSON.stringify([
    { questionId: Q_LAST_NAME,  answer1: lastName  },
    { questionId: Q_REF_NUMBER, answer1: refNumber },
    { questionId: Q_EMAIL,      answer1: email      },
  ]);

  try {
    const response = await fetch(NMC_FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin":        "https://forms.osi.apps.mil",
        "Referer":       NMC_FORM_REFERER,
      },
      body: JSON.stringify({
        startDate:  startDate.toISOString(),
        submitDate: submitDate.toISOString(),
        answers,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return { ok: false, error: `NMC form returned ${response.status}: ${text}` };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
}
