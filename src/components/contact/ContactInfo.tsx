"use client";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const contactDetails = [
  {
    icon: EmailIcon,
    label: "Email",
    value: "hello@convertyoursite.com",
    href: "mailto:hello@convertyoursite.com",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+972 (0) 50-123-4567",
    href: "tel:+972501234567",
  },
  {
    icon: LocationOnIcon,
    label: "Address",
    value: "Tel Aviv, Israel",
    href: null,
  },
  {
    icon: AccessTimeIcon,
    label: "Working Hours",
    value: "Sun–Thu, 9:00–18:00 IST",
    href: null,
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Information
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Prefer a direct conversation? Reach out through any of the channels
          below.
        </p>
      </div>

      <div className="space-y-6">
        {contactDetails.map((item) => (
          <div key={item.label} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <item.icon className="!w-5 !h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map / Location embed */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <iframe
          title="convertYourSite Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108169.39429468044!2d34.74498885!3d32.0852999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6193b7c1f%3A0xc1fb72a2c0963f90!2sTel%20Aviv-Yafo!5e0!3m2!1sen!2sil!4v1700000000000!5m2!1sen!2sil"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
