import GoogleAuthProvider from "../components/auth/authprovider";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <GoogleOAuthProviderWrapper>{children}</GoogleOAuthProviderWrapper>;
}

function GoogleOAuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleAuthProvider>{children}</GoogleAuthProvider>;
}
