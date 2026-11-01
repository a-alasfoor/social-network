import "../styles/globals.css";

const initialThemeScript = `
(function () {
  try {
    const saved = localStorage.getItem('theme');
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const system = mql.matches ? 'dark' : 'light';
    const theme = saved || system;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  } catch (_) {}
})();
`;

export const metadata = {
  title: "Connect",
  description: "Social network home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialThemeScript }} />
      </head>
      <body className="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
