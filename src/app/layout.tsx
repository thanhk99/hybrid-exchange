import Header from "../components/Layout/Header/Header";
import { UserProvider } from "../contexts/UserContext";
import { NotificationProvider } from "../contexts/NotificationContext";
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
            <NotificationProvider>
              <Header />
              <main>{children}</main>
            </NotificationProvider>
          </UserProvider>
        </Providers>

      </body>
    </html>
  );
}