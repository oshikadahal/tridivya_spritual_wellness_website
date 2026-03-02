
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';


function EsewaSuccessPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const pid = params.get('pid');

  useEffect(() => {
    if (pid) {
      // Redirect to booking details after short delay
      const timeout = setTimeout(() => {
        router.push(`/booking/${pid}`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [pid, router]);

  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1>Payment Successful!</h1>
      <p>Your booking (ID: {pid}) has been confirmed and paid via eSewa.</p>
      <div style={{ marginTop: 20 }}>
        <a href={`/booking/${pid}`} style={{ color: '#4f46e5', textDecoration: 'underline' }}>
          View Booking Details
        </a>
        <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          Redirecting to booking details...
        </div>
      </div>
    </div>
  );
}

export default function EsewaSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EsewaSuccessPageInner />
    </Suspense>
  );
}
