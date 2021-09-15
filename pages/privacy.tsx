import { GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

type PrivacyPageProps = {
  source: MDXRemoteSerializeResult;
};

export default function TestPage({ source }: PrivacyPageProps) {
  return (
    <div>
      <MDXRemote {...source} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<PrivacyPageProps> = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/message-manager-discord/bot/master/PRIVACY_POLICY.md",
  );
  const mdContent = await res.text();
  const mdxSource = await serialize(mdContent);
  return { props: { source: mdxSource } };
};
