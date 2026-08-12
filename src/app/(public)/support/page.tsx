"use client";
import { useEffect, useMemo, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { createSupportDonationCheckout, fetchSupportDonationConfig, fetchSupportDonationStatus } from "@/app/lib/api-client";
import { setSeoMetadata } from "@/app/utils/seo";
import styles from "@/portal-theme.module.css";

function SupportContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const referenceNumber = searchParams.get("reference") || "";

  const configQuery = useQuery({
    queryKey: ["supportDonationConfig"],
    queryFn: fetchSupportDonationConfig,
    staleTime: 30_000,
    retry: 1,
  });

  const donationStatusQuery = useQuery({
    queryKey: ["supportDonationStatus", referenceNumber],
    queryFn: () => fetchSupportDonationStatus(referenceNumber),
    enabled: Boolean(referenceNumber && status === "success"),
    retry: 1,
  });

  const checkoutMutation = useMutation({
    mutationFn: createSupportDonationCheckout,
    onSuccess: (data: { checkoutUrl: string; referenceNumber: string }) => {
      window.location.assign(data.checkoutUrl);
    },
  });

  const config = configQuery.data;
  const tiers = useMemo(() => config?.tiers ?? [], [config?.tiers]);

  async function handleDonate(amount: number) {
    await checkoutMutation.mutateAsync({ amount });
  }

  const successDonation = donationStatusQuery.data;

  return (
    <main className={styles.infoPageShell}>
      <div className={styles.infoPageInner}>
      <header className={styles.supportDonationHeader}>
        <nav className={styles.supportDonationNav} aria-label="Public navigation">
          <a href="/home" className={styles.supportDonationNavLink}>Home</a>
          <a href="/about" className={styles.supportDonationNavLink}>About</a>
          <a href="/privacy-policy" className={styles.supportDonationNavLink}>Privacy</a>
          <a href="/terms-and-conditions" className={styles.supportDonationNavLink}>Terms</a>
        </nav>
      </header>

      <div className={styles.supportDonationContent}>
        <div className={styles.supportDonationCard}>
          <p className={styles.eyebrow}>Support</p>
          <h1 className={styles.supportDonationTitle}>{config?.title || "Support Lessora AI"}</h1>
          <p className={styles.supportDonationDescription}>{config?.description || "Help us keep building for teachers."}</p>

          {status === "success" && successDonation && (
            <div className={styles.successPanel}>
              <p className={styles.successTitle}>Thank you for your support!</p>
              <p className={styles.successText}>Your donation of {config?.currency || "PHP"} {successDonation.amount.toLocaleString()} has been received.</p>
              <p className={styles.successMessage}>{config?.successMessage || ""}</p>
            </div>
          )}

          {status === "cancelled" && (
            <div className={styles.errorPanel}>
              <p className={styles.centerTitle}>Donation cancelled</p>
              <p className={styles.centerText}>You can try again whenever you&apos;d like.</p>
            </div>
          )}

          <div className={styles.tierGrid}>
            {tiers.map((tier) => (
              <button key={tier.id} type="button" onClick={() => handleDonate(tier.amount)} className={`${styles.tierCard} ${tier.recommended ? styles.tierCardRecommended : ""}`}>
                {tier.recommended && <span className={styles.recommendedBadge}>Recommended</span>}
                <p className={styles.tierLabel}>{tier.label}</p>
                <p className={styles.tierAmount}>{config?.currency || "PHP"} {tier.amount.toLocaleString()}</p>
                <p className={styles.tierDescription}>{tier.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export default function SupportDonationPage() {
  useEffect(() => {
    setSeoMetadata({
      title: "Support Lessora AI | Paymongo Donation",
      description: "Support Lessora AI with a one-time donation through Paymongo-hosted checkout.",
    });
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupportContent />
    </Suspense>
  );
}
