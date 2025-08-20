import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate
} from "@azure/msal-react";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the MSAL Demo for React!</h1>
      <AuthenticatedTemplate>
        <p>You are signed-in. Try out the Microsoft Graph API.</p>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>Sign in to see your profile information.</p>
      </UnauthenticatedTemplate>
    </main>
  );
}
