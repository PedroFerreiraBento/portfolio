import { MessageCircle } from "lucide-react";
import { useI18n } from "../../i18n";

export function WhatsAppButton() {
    const { t } = useI18n();
    const phoneNumber = "5511999999999"; // Replace with actual number
    const message = t("common.whatsappMessage") || "Olá! Gostaria de saber mais sobre seus serviços.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 dark:ring-offset-bg-page"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={32} fill="white" className="text-white" />
        </a>
    );
}
