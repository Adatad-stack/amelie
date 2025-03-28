// /app/layout.jsx
import "../styles/globals.css";

export const metadata = {
  title: "Amélie",
  description: "Assistant vocal EHPAD & RSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
