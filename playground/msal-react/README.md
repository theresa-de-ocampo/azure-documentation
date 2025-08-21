# MSAL Exploration in React

- The `authority` config when instantiating `PublicClientApplication` specifies the URL where the authentication and authorization should occur. If you registered the app as a single tenant, use `https://login.microsoftonline.com/your-tenant-id` instead.
- To ensure optimal performance, it's crucial to instantiate the `PublicClientApplication` outside the component tree. This prevents it from being recreated whenever a component re-renders which can be inefficient. By placing it outside, you can guarantee it's created only once and reused as needed.
- I've tried using `useMsalAuthenticathion` at `Profile.tsx`, but `result` is always null. [Read more.](https://learn.microsoft.com/en-us/entra/msal/javascript/react/hooks)

  > `result` is the result from the last successful login or token acquisition. Note that this hook only attempts to to login or acquire tokens automatically one time. It is the application's responsibility to call the `login` or `acquireToken` function when needed to update this value.

- Upon login, it will return an object `{ authority, scopes, account, idToken, idTokenClaims, accessToken }`.

## Access Token vs. ID Token

### Access Token

- Audience (`aud`) = the API you're calling (`https://graph.microsoft.com`).
- Access token is interpreted by the resource server.

### ID Token

- Audience (`aud`) = just your client app
- ID token is interpreted by the client.
- Useful if you just want to know who the use is (e.g., display the name).
- `idToken` can't be decoded by [jwt.io](https://www.jwt.io/). Use [jwt.ms](https://jwt.ms/) instead.

## How to Run

1. Register a new app in Azure.
2. Get the client ID, and configure your `.env`.
