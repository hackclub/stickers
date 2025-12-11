import { writable, get } from 'svelte/store';

export const user = writable(null);
export const loading = writable(true);

let authChecked = false;

export async function checkAuth() {
  if (authChecked && get(user)) {
    loading.set(false);
    return true;
  }
  
  loading.set(true);
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const userData = await res.json();
      user.set(userData);
      authChecked = true;
      return true;
    } else {
      user.set(null);
      return false;
    }
  } catch (e) {
    user.set(null);
    return false;
  } finally {
    loading.set(false);
  }
}
