import { useRouter } from "next/router";
import Head from "next/head";

export default function OpenGraph({
  title = "Message Manager",
  description = "Message Manager is a utility discord bot, making the management of important messages easier.",
}) {
  const router = useRouter();
  const url = `https://messagemanager.xyz${router.asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta name="og:title" content="Message Manager Bot" />
      <meta
        property="og:site_name"
        content="Message Manager Bot"
        key="og-site-name"
      />
      <meta
        name="og:description"
        content="Message Manager is a utility discord bot, making the management of important messages easier."
      />
      <meta name="og:type" content="website" />
      <meta name="og:image" content="static/img/avatar.png" />
      <meta name="og:url" content={url} />
    </Head>
  );
}
