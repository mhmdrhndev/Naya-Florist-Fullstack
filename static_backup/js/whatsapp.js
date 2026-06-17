// Naya Florist — WhatsApp Consultation System

const NAYA_WHATSAPP_NUMBER = "6282113453467";

/**
 * Open WhatsApp with a pre-filled consultation message for a specific product.
 * @param {number} productId - The product ID to consult about.
 * @param {string} [colorName] - Optional selected color name.
 */
function consultWhatsApp(productId, colorName) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    const colorInfo = colorName ? ` (Warna: ${colorName})` : "";

    const message = `💐 Halo Admin Naya Florist!

Saya tertarik dengan buket berikut:

🌸 *${product.name}*${colorInfo}
📦 Material: ${product.material}

Bisa dibantu info mengenai detail harga, ketersediaan, dan pengirimannya? Terima kasih! 🙏`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${NAYA_WHATSAPP_NUMBER}&text=${encodedText}`;
    window.open(waUrl, '_blank');
}

/**
 * Open WhatsApp with a general inquiry (no specific product).
 */
function contactWhatsApp() {
    const message = `💐 Halo Admin Naya Florist!

Saya ingin bertanya mengenai produk buket bunga artificial Anda. Mohon info lebih lanjut. Terima kasih! 🙏`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${NAYA_WHATSAPP_NUMBER}&text=${encodedText}`;
    window.open(waUrl, '_blank');
}

// Inject WhatsApp Floating Action Button on all pages
document.addEventListener('DOMContentLoaded', () => {
    injectWhatsAppFAB();
});

function injectWhatsAppFAB() {
    if (document.getElementById('wa-fab')) return;

    const message = `💐 Halo Admin Naya Florist!

Saya ingin bertanya mengenai produk buket bunga artificial Anda. Mohon info lebih lanjut. Terima kasih! 🙏`;
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${NAYA_WHATSAPP_NUMBER}&text=${encodedText}`;

    const fab = document.createElement('a');
    fab.id = 'wa-fab';
    fab.href = waUrl;
    fab.target = '_blank';
    fab.setAttribute('aria-label', 'Chat via WhatsApp');
    fab.className = 'wa-fab';

    fab.innerHTML = `
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.004 2.667A13.29 13.29 0 0 0 2.72 15.893a13.18 13.18 0 0 0 1.792 6.627L2.667 29.333l7.027-1.827A13.3 13.3 0 0 0 16.004 29.333a13.29 13.29 0 0 0 13.329-13.333A13.29 13.29 0 0 0 16.004 2.667Zm0 24.32a10.96 10.96 0 0 1-5.56-1.52l-.4-.24-4.133 1.08 1.1-4.013-.26-.413a10.89 10.89 0 0 1-1.68-5.827A11 11 0 0 1 16.004 5.04 11 11 0 0 1 27.004 16a11 11 0 0 1-11 11.013v-.027Zm6.027-8.24c-.333-.167-1.96-.967-2.267-1.08-.307-.113-.527-.167-.747.167s-.86 1.08-1.053 1.3-.387.247-.72.08a9.13 9.13 0 0 1-2.68-1.653 10.05 10.05 0 0 1-1.853-2.307c-.193-.333-.02-.513.147-.68s.333-.387.5-.587a2.28 2.28 0 0 0 .333-.553.607.607 0 0 0-.027-.587c-.08-.167-.747-1.8-1.02-2.467-.267-.64-.54-.553-.747-.567h-.64a1.23 1.23 0 0 0-.887.413A3.72 3.72 0 0 0 9.16 14.5a6.47 6.47 0 0 0 1.353 3.427 14.8 14.8 0 0 0 5.66 5c.793.34 1.413.547 1.893.7.797.253 1.52.22 2.093.133.64-.093 1.96-.8 2.24-1.573s.28-1.44.193-1.573c-.08-.14-.3-.22-.633-.387Z"/>
        </svg>
    `;

    document.body.appendChild(fab);
}
