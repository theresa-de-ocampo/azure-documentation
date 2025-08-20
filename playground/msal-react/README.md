# MSAL Exploration in React

- The `authority` config when instantiating `PublicClientApplication` specifies the URL where the authentication and authorization should occur. If you registered the app as a single tenant, use `https://login.microsoftonline.com/your-tenant-id` instead.
- To ensure optimal performance, it's crucial to instantiate the `PublicClientApplication` outside the component tree. This prevents it from being recreated whenever a component re-renders which can be inefficient. By placing it outside, you can guarantee it's created only once and reused as needed.
