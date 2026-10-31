import { supabase } from './supabase';

// Reuse an existing initialization request if one is running.
let guestPromise = null;

export function getOrCreateGuest() {
  if (guestPromise) return guestPromise;

  guestPromise = initializeGuest().finally(() => {
    guestPromise = null;
  });

  return guestPromise;
}

async function initializeGuest() {
  // Check for an existing session.
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  if (data.session) {
    return data.session.user;
  }

  // Create an anonymous guest if no session exists.
  const { data: guestData, error: guestError } =
    await supabase.auth.signInAnonymously();

  if (guestError) throw guestError;

  return guestData.user;
}
