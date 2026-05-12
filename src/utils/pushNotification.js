import api from '../config/api';

/**
 * Convert VAPID public key to Uint8Array
 */
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

/**
 * Subscribe user to push notifications
 */
export const subscribeUser = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Check if already subscribed
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
            return existingSubscription;
        }

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
        };

        const subscription = await registration.pushManager.subscribe(subscribeOptions);
        console.log('User is subscribed:', subscription);

        // Send to backend
        await api.post('/push-subscribe', subscription);

        return subscription;
    } catch (error) {
        console.error('Failed to subscribe the user: ', error);
        throw error;
    }
};

/**
 * Unsubscribe user from push notifications
 */
export const unsubscribeUser = async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
            await subscription.unsubscribe();
            // Inform backend
            await api.post('/push-unsubscribe', { endpoint: subscription.endpoint });
            console.log('User is unsubscribed');
        }
    } catch (error) {
        console.error('Error unsubscribing', error);
    }
};

/**
 * Check subscription status
 */
export const getSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return false;
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
};
