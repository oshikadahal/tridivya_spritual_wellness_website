
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';


function EsewaFailurePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const pid = params.get('pid');

  useEffect(() => {
    // Optionally, handle retry or show more info
  }, [pid]);

  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1>Payment Failed</h1>
      <p>Your payment for booking (ID: {pid}) was not successful via eSewa.</p>
      <a href="/booking">Return to Bookings</a>
    </div>
  );
}

export default function EsewaFailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EsewaFailurePageInner />
    </Suspense>
  );
}
