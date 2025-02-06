import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Grid from "@mui/material/Grid2";
import { Container } from "@mui/material";
import Navbar from "../components/Navbar";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Grid container>
            <Grid size={12}>
              <Navbar />
            </Grid>
          </Grid>
          <Container maxWidth="xl">
            <Grid container py={2}>
              <Grid size={12}>{children}</Grid>
            </Grid>
          </Container>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
