export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel} role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <p className="text-text mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-full border border-gray-300 text-text">Отмена</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-hover">Подтвердить</button>
                </div>
            </div>
        </div>
    );
}