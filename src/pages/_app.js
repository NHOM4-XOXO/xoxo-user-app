import ClientProviders from "../app/ClientProviders";

export default function App({ Component, pageProps }) {
  return (
    <ClientProviders>
      <Component {...pageProps} />
    </ClientProviders>
  );
}


