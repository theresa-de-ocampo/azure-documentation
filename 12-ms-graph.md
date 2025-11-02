# Microsoft Graph

## Overview of Microsoft Graph Permissions

The `appRoles`, `oauth2PermissionScopes`, `resourceSpecificApplicationPermissions` objects store the application, delegated, and resource-specific consent permissions respectively.

The permissions follow the naming pattern _{resource}.{operation}.{constraint}_. The `{constraint}` determines the potential extent of access an app has within the directory. This value might not be explicitly declared. When undeclared, the default constraint is limited to data that's owned by the signed-in user.

Examples for `appRoles`

- `APIConnectors.Read.All`
- `Application.Read.All`
- `AppRoleAssignment.ReadWrite.All`
- `BackupRestore-Control.ReadWrite.All`
- `Mail.Read`
- `Notes.Read.All` (OneNote)

Examples for `oauth2PermissionScopes`

- `Directory.AccessAsUser.All`
- `User.Read`
- `Files.ReadWrite`

Examples for `resourceSpecificApplicationPermissions`

- `CallRecordings.Read.Chat`
- `Calls.AccessMedia.Chat`
- `Calls.JoinGroupCalls.Chat`
- `Channel.Create.Group`
- `TeamsActivity.Send.Chat`
- `VirtualEventRegistration-Anon.ReadWrite.Chat`

Resource-Specific Consent (RSC) is an authorization framework that grants scoped access to the data exposed by a resource.

RSC permissions are also available for consent and are supported by only a subset of features available through Microsoft Graph such as Teams, chats, and messages.

## List All Microsoft Graph Permissions

1. Create an App Registration.
2. [According to Microsoft, you should get a token using an account that has at least the `Application.Read.All` permission](https://learn.microsoft.com/en-us/graph/permissions-reference#:~:text=To%20read%20information%20about%20all%20Microsoft%20Graph%20permissions%20programmatically%2C%20sign%20in%20to%20an%20API%20client%20such%20as%20Graph%20Explorer%20using%20an%20account%20that%20has%20at%20least%20the%20Application.Read.All%20permission%20and%20run%20the%20following%20request.). However, I tried all of the following, and it worked regardless of whether the token has the `Application.Read.All` permissions. Read the theory in the next section.
   1. App Token with `Application.Read.All` added at **Manage** > **API Permissions**.
   2. App Token without `Application.Read.All`
   3. User Token (Global Administrator)
   4. User Token (Non-Admin)
3. Issue a GET request.
   ```http
   https://graph.microsoft.com/v1.0/servicePrincipals(appId='your-app-id')?$select=id,appId,displayName,appRoles,oauth2PermissionScopes,resourceSpecificApplicationPermissions.
   ```

### Theory for why listing the permissions worked

Refer to item #2 of the previous section, I was expecting that it would throw `Authorization_RequestDenied`. However, it returned a `200 OK` response.

For the App Token without `Application.Read.All`, maybe Microsoft Graph allows limited read access to its own app registration metadata.

For the Global Administrator's User Token, maybe Microsoft Graph allows the signed-in user who owns or created the app to read the metadata.

For the Non-Admin User Token, no idea how it worked. At the Azure Portal > App Registrations > All Applications, it even says _Insufficient privileges to view applications_. If you happen to know why this worked, please don't hesitate to drop me a message — would really appreciate the help! 🙏💬

### MSA Tokens vs Entra Tokens

If you used the user token generated from the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer), it will return the following error.

```json
{
  "error": {
    "code": "BadRequest",
    "message": "This API is not supported for MSA accounts (no addressUrl for Microsoft.DirectoryServices,False).",
    "innerError": {
      "date": "2025-11-02T04:25:52",
      "request-id": "4375b0bc-a150-4b29-9840-2f73b63e2744",
      "client-request-id": "4375b0bc-a150-4b29-9840-2f73b63e2744"
    }
  }
}
```

It's not a valid JWT, it's a Microsoft Account (MSA) token. So, it cannot be parsed using jwt.ms. It's an opaque token that is only meaningful to Microsoft's internal identity Services.

An **opaque token** is a token in a proprietary format that is not intended to be read by the user.

#### How to get tokens?

When you sign into Graph Explorer, you can log in using:

1. A work or school account (`@yourcompany.com`) — this authenticates via Entra ID.
2. A personal Microsoft Account (`@outlook.com`, `@hotmail.com`, or `@gmail.com` linked to a Microsoft account).

#### Why the error occurs?

The endpoint (`/servicePrincipals`) is part of of the Entra Directory resources. The object only exist in organization (AAD) tenants, not in consumer (MSA) contexts.

For such cases, you'll have to generate the user token using PKCE instead of copying it from Graph Explorer.

### Results of the API Call

Notice that `appRoles`, `oauth2PermissionScopes`, and `resourceSpecificApplicationPermissions` are all empty. This is because these properties describe **what permissions an app exposes to others**, not what permissions the app _has granted or consented to_.

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#servicePrincipals(id,appId,displayName,appRoles,oauth2PermissionScopes,resourceSpecificApplicationPermissions)/$entity",
  "id": "4f49b7c8-719a-459e-856f-b722ba4fc848",
  "appId": "the-client-id",
  "displayName": "Gourmade Back-Office",
  "appRoles": [],
  "oauth2PermissionScopes": [],
  "resourceSpecificApplicationPermissions": []
}
```

The registered application is a consumer of APIs — it doesn't expose any roles or permission scopes unless you've explicitly defined some under **Expose an API** in Azure Portal.

Try it from Microsoft's sample tenant to get a better [example](./assets/12-ms-graph/all-permissions.json) of a response.
