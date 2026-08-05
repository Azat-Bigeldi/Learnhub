const WHATSAPP_NUMBER = '77755660919'

/**
 * Формирует ссылку wa.me с предзаполненным текстом.
 * @param {string} text — текст сообщения
 * @returns {string} готовый URL для открытия чата WhatsApp
 */
export function buildWhatsAppLink(text) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function openWhatsApp(text) {
    window.open(buildWhatsAppLink(text), '_blank', 'noopener,noreferrer')
}
