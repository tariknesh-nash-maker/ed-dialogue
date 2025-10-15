import "./globals.css";

export const metadata = {
  title: "حوار التعليم – المرحلة أ",
  description: "صفحة الهبوط: خريطة طريق + تسجيل الجمعيات للويبينار الأول",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}
