import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  createSupportDonationCheckoutSession,
  fetchSupportDonationConfig,
  fetchSupportDonationStatus,
} from "../services/api";
import { setSeoMetadata } from "../utils/seo";
import styles from "../styles/PortalTheme.module.css";

export default function SupportDonationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    mutationFn: createSupportDonationCheckoutSession,
    onSuccess: ({ checkoutUrl }) => {
      window.location.assign(checkoutUrl);
    },
  });

  useEffect(() => {
    setSeoMetadata({
      title: "Support Lessora AI | Paymongo Donation",
      description:
        "Support Lessora AI with a one-time donation through Paymongo-hosted checkout.",
    });
  }, []);

  const config = configQuery.data;
  const tiers = useMemo(() => config?.tiers ?? [], [config?.tiers]);

  async function handleDonate(amount: number) {
    await checkoutMutation.mutateAsync({ amount });
  }

  const successDonation = donationStatusQuery.data;

  return (
    <main className={styles.userAppPage}>
      <header className={styles.supportDonationHeader}>
        <nav className={styles.supportDonationNav} aria-label="Public navigation">
          <Link to="/">
            Home
          </Link>
          <Link to="/about">
            About
          </Link>
          <Link to="/support" aria-current="page">
            Support
          </Link>
          <Link to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link to="/terms-and-conditions">
            Terms &amp; Conditions
          </Link>
        </nav>
      </header>

      <div className={styles.userAppContainerDoc}>
        <section className={styles.planCardSpacious}>
          <p className={styles.planCardTitle}>Support Donation</p>
          <h1 className={styles.planCardHeading}>
            {config?.title || "Support Lessora AI"}
          </h1>
          <p className={styles.userAppHeroDescription}>
            {config?.description ||
              "Help keep Lessora AI focused on lesson planning by sending a small one-time donation."}
          </p>
        </section>

        {status === "success" && (
          <section className={styles.planCardBody}>
            <div className={styles.successBanner}>
              <strong>Thank you.</strong>{" "}
              {config?.successMessage ||
                "Your support helps keep Lessora AI moving forward."}
            </div>
            <div className={styles.workspaceCard}>
              <p className={styles.planCardTitle}>Donation status</p>
              <p className={styles.workspaceCardText}>
                {successDonation?.status === "paid"
                  ? "Payment confirmed by Paymongo."
                  : "Payment received. Confirmation is still syncing from Paymongo."}
              </p>
              {referenceNumber && (
                <p className={styles.planCardMeta}>
                  Reference: {referenceNumber}
                </p>
              )}
            </div>
          </section>
        )}

        {status === "cancelled" && (
          <section className={styles.planCardBody}>
            <div className={styles.noteBanner}>
              Donation cancelled. You can choose a different amount below.
            </div>
          </section>
        )}

        {status !== "success" && (
          <section className={styles.planCardBody}>
            <div className={styles.supportDonationTierGrid}>
              {tiers.map((tier) => (
                <article key={tier.id} className={styles.supportDonationTier}>
                  <p className={styles.planCardTitle}>{tier.label}</p>
                  <h2 className={styles.workspaceCardTitle}>
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: config?.currency || "PHP",
                      maximumFractionDigits: 0,
                    }).format(tier.amount / 100)}
                  </h2>
                  <p className={styles.workspaceCardText}>{tier.description}</p>
                  <p
                    className={styles.supportDonationTierMeta}
                    aria-hidden={!tier.recommended}
                  >
                    {tier.recommended ? "Recommended" : "\u00a0"}
                  </p>
                  <button
                    type="button"
                    className={styles.flatButton}
                    disabled={checkoutMutation.isPending}
                    onClick={() => handleDonate(tier.amount)}
                  >
                    {checkoutMutation.isPending ? "Opening Paymongo..." : "Donate now"}
                  </button>
                </article>
              ))}
            </div>

            {(configQuery.isLoading || checkoutMutation.isPending) && (
              <div className={styles.noteBanner} style={{ marginTop: 24 }}>
                {checkoutMutation.isPending
                  ? "Redirecting you to Paymongo checkout."
                  : "Loading donation options..."}
              </div>
            )}

            {configQuery.error && (
              <div className={styles.errorBanner}>
                Unable to load donation options. Please try again later.
              </div>
            )}
          </section>
        )}

        <div className={styles.userAppActionRow}>
          <button
            type="button"
            className={styles.softSecondary}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
