'use client';
import { useMemo, Suspense } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  createSupportDonationCheckout,
  fetchSupportDonationConfig,
  fetchSupportDonationStatus,
} from '@/app/lib/api-client';
import SiteHeader from '@/app/components/site-header';
import LoadingSkeleton from '@/app/components/loading-skeleton';
import styles from "@/portal-theme.module.css";

// Donation amounts are stored in centavos (PayMongo's smallest unit)
function formatCentavos(amount: number): string {
  return (amount / 100).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function SupportContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const referenceNumber = searchParams.get('reference') || '';

  const configQuery = useQuery({
    queryKey: ['supportDonationConfig'],
    queryFn: fetchSupportDonationConfig,
    staleTime: 30_000,
    retry: 1,
  });

  const donationStatusQuery = useQuery({
    queryKey: ['supportDonationStatus', referenceNumber],
    queryFn: () => fetchSupportDonationStatus(referenceNumber),
    enabled: Boolean(referenceNumber && status === 'success'),
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
    <main className={`${styles.infoPageShell} ${styles.supportPage}`}>
      <div className={styles.infoPageInner}>
        <SiteHeader current="support" />

        <div className={styles.supportDonationContent}>
          <div className={styles.supportDonationCard}>
            <h1 className={styles.supportDonationTitle}>{config?.title || 'Support Lessora AI'}</h1>
            <p className={styles.supportDonationDescription}>
              {config?.description || (configQuery.isLoading ? '' : 'Help us keep building for teachers.')}
            </p>

            {status === 'success' && successDonation && (
              <div className={styles.successPanel}>
                <p className={styles.successTitle}>Thank you. Your donation was received.</p>
                <p className={styles.successText}>
                  Amount: {config?.currency || 'PHP'}{' '}
                  {formatCentavos(successDonation.amount)}
                </p>
                <p className={styles.successMessage}>{config?.successMessage || ''}</p>
              </div>
            )}

            {status === 'cancelled' && (
              <div className={styles.errorPanel}>
                <p className={styles.centerTitle}>The donation was cancelled</p>
                <p className={styles.centerText}>No payment was taken. Pick an amount below to try again.</p>
              </div>
            )}

            {configQuery.isLoading && <LoadingSkeleton lines={3} label="Loading donation options" />}

            <div className={styles.tierGrid}>
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => handleDonate(tier.amount)}
                  disabled={checkoutMutation.isPending}
                  className={`${styles.tierCard} ${tier.recommended ? styles.tierCardRecommended : ''}`}
                >
                  {tier.recommended && !checkoutMutation.isPending && <span className={styles.recommendedBadge}>Recommended</span>}
                  <p className={styles.tierLabel}>{tier.label}</p>
                  <p className={styles.tierAmount}>
                    {config?.currency || 'PHP'}{' '}
                    {formatCentavos(tier.amount)}
                  </p>
                  <p className={styles.tierDescription}>{checkoutMutation.isPending ? 'Opening checkout…' : tier.description}</p>
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
  return (
    <Suspense fallback={<main className={`${styles.infoPageShell} ${styles.supportPage}`}><div className={styles.infoPageInner}><SiteHeader current="support" /><LoadingSkeleton lines={4} /></div></main>}>
      <SupportContent />
    </Suspense>
  );
}
