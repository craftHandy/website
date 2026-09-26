# Checkout & Razorpay Loading Issues — Fix Plan

## Context
The checkout page at `src/app/(storefront)/checkout/page.tsx` uses `react-razorpay` for payment processing. Users report the page "sometimes shows loading taking a lot of time." The backend API is hosted at `https://backend-4gle.onrender.com` (Render free tier) and the Razorpay SDK is loaded dynamically via `react-razorpay`.

## Root Causes Identified

### Critical
1. **`useRazorpay` `isLoading` stuck bug** (`node_modules/react-razorpay/dist/index.js:68-86`): `setIsLoading(true)` runs on every mount, but `setIsLoading(false)` only fires inside `.finally()` of `loadScript()`. When `window.Razorpay` is already cached, `loadScript` is skipped and `isLoading` stays `true` forever — permanently disabling the checkout button.

2. **No fetch timeouts on backend calls** (`checkout/page.tsx:848,894,999`): All `fetch()` calls to `backend-4gle.onrender.com` have no `AbortController` or timeout. Render free tier cold starts can take 30-60s, causing indefinite hangs.

### High
3. **`waitForRazorpay` interval leak** (`checkout/page.tsx:731-756`): `setInterval` inside `waitForRazorpay` never gets cleared on component unmount.

4. **`waitForRazorpay` stale closure** (`checkout/page.tsx:731-756`): `razorpayError` is captured once at call time; changes during polling are invisible.

5. **`fetchKey` useEffect has no timeout** (`checkout/page.tsx:625-680`): If `/api/razorpay` hangs, `isKeyLoading` stays `true` forever.

### Medium
6. **Sequential API calls** (`checkout/page.tsx:848→894→999`): Checkout order → Razorpay order → Verify are strictly sequential; cold start delays compound.

7. **`selectedItems` no-op memo** (`checkout/page.tsx:682`): `useMemo(() => items, [items])` is a useless reference pass-through.

## Implementation Plan

### Task 1: Fix `useRazorpay` `isLoading` stuck bug
- **Approach**: Wrap `useRazorpay()` in a custom hook that fixes the `isLoading` state. When the effect runs and `checkScriptLoaded()` returns `true`, explicitly set `isLoading` to `false`.
- **Create**: `src/hooks/useRazorpaySafe.ts` — a wrapper around `useRazorpay` that ensures `isLoading` is properly managed.
- **Alternative**: Inline the `useRazorpay` logic directly in the checkout component to avoid the library bug.
- **Validation**: Test by loading the page with `window.Razorpay` already present (e.g., after navigating away and back). Button should become enabled after key loads.

### Task 2: Add AbortController and timeout to all fetch calls in `onSubmit`
- **File**: `src/app/(storefront)/checkout/page.tsx`
- **Changes**:
  - Wrap each `fetch` call with `AbortController` and a timeout (e.g., 15s for checkout, 15s for razorpay order, 30s for verify since the user is interacting with the Razorpay modal).
  - On timeout, reject with a clear error message and `finishPaymentAttempt()`.
- **Validation**: Test by simulating slow responses. Button should re-enable after timeout with appropriate error toast.

### Task 3: Fix `waitForRazorpay` interval leak and stale closure
- **File**: `src/app/(storefront)/checkout/page.tsx`
- **Changes**:
  - Use `useRef` for the interval so it can be cleared on unmount.
  - Read `razorpayError` from a ref inside the interval to avoid stale closure.
  - Return a cleanup function or use `useEffect` to clear the interval.
- **Validation**: Navigate away during checkout and verify no interval warnings in console.

### Task 4: Add timeout to `fetchKey` useEffect
- **File**: `src/app/(storefront)/checkout/page.tsx`
- **Changes**:
  - Add a `setTimeout` in the `fetchKey` effect (e.g., 10s). If it fires before the fetch completes, set `keyError` and `isKeyLoading` to `false`.
  - Clear the timeout on unmount.
- **Validation**: Simulate slow `/api/razorpay` response. Error should appear after timeout.

### Task 5: Minor cleanups
- **File**: `src/app/(storefront)/checkout/page.tsx`
- **Changes**:
  - Remove the no-op `useMemo` for `selectedItems`.
  - Use `useCallback` for `onSubmit` to prevent unnecessary re-renders of child components.
- **Validation**: Verify no functional regression.

## Files to Modify
- `src/app/(storefront)/checkout/page.tsx` — main fixes
- `src/hooks/useRazorpaySafe.ts` — new file (or inline fix)
- `node_modules/react-razorpay/dist/index.js` — **do NOT modify** (library file)

## Risk Assessment
- The `useRazorpay` library bug means the button can be permanently disabled. This is the most impactful user-facing issue.
- Fetch timeouts should be added carefully to avoid canceling legitimate slow requests during the Razorpay modal interaction phase.
- The `waitForRazorpay` fix must ensure `razorpayError` is read reactively, not from a stale closure.
