import "../styles/index.css";

export const metadata = {
  title: 'Amelie',
  description: 'Assistant Résidences Seniors',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
