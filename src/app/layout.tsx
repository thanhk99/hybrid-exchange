import Header from "../components/Layout/Header/Header";
import { UserProvider } from "../contexts/UserContext";
import { Providers } from "./provider";
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <UserProvider>
            <Header/>
            <main>{children}</main>
          </UserProvider>
        </Providers>

      </body>
    </html>
  );
}