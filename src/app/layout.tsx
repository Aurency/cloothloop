import '../styles/globals.css'; // Path ke styles/globals.css

export const metadata = {
  title: 'My App',
  description: 'A simple Next.js application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

