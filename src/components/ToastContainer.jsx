import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { removeNotification, selectNotifications } from '../store/notificationSlice.js';
import { useLanguage } from '../i18n/useLanguage';

const TOAST_AUTO_DISMISS_MS = 3500;

function SingleToastItem({ notification, onRequestCloseToast }) {
    const { t } = useLanguage();

    useEffect(() => {
        const timer = setTimeout(() => onRequestCloseToast(notification.id), TOAST_AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [notification.id, onRequestCloseToast]);

    const typeStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-primary',
    };

    return (
        <div className={`${typeStyles[notification.type] || typeStyles.info} text-white rounded-lg px-4 py-3 shadow-lg flex items-center justify-between gap-4 min-w-[260px]`} role="status">
            <span>{notification.message}</span>
            <button onClick={() => onRequestCloseToast(notification.id)} aria-label={t('toast.closeAria')} className="text-white/80 hover:text-white">×</button>
        </div>
    );
}

export default function ToastContainer() {
    const notifications = useAppSelector(selectNotifications);
    const dispatch = useAppDispatch();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((n) => (
                <SingleToastItem key={n.id} notification={n} onRequestCloseToast={(id) => dispatch(removeNotification(id))} />
            ))}
        </div>
    );
}
