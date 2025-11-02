# [Shared Access Signatures](https://www.youtube.com/watch?v=xVyTGNMSrr8)

Access Keys = Key to Kingdom. You can do anything with the access keys (read, delete, etc). You wouldn't want to share this, use SAS instead.

Everytime you're going to create a SAS - whether it's an account-level or service-level - it will always use one of the access keys to sign the SAS token. Hence, when you rotate the access keys, it invalidates all of the sign tokens that were signed with it.

You can test the following sections using Microsoft Azure Storage Explorer.

## Account-Level SAS

Even if you select just one service or one resource type, you're still configuring an account-level SAS. In this scenario, you'll have access to _all_ of the containers.

For the _Container_ option, don't think of it as a `blob container`. Think of it as something that will have child elements.

In the context of blobs, `container` will refer to `blob` container which will contain `blobs`.

In the context of a file service, `container` will refer to `share` which will contain `files` and `directories`.

In the context of table service, `container` will refer to `table` which will contain `entities`.

In the context of a queue service, `container` will refer to `queue` which will contain `messages`.

![Creating an Account-Level SAS](assets/11-sas/01-account-level-sas.png)

```http
https://gourmade0storage.blob.core.windows.net/?sv=2024-11-04&ss=b&srt=sco&sp=rl&se=2025-08-23T14:41:22Z&st=2025-08-23T06:26:22Z&spr=https&sig=5mTXcPjJGNQev0SWYg6bWIuJOHQu1uC7pBQKE9W7Qhw%3D
```

<table>
  <thead>
    <tr>
      <th>Part</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Account Name
      </td>
      <td>
        <code>https://gourmade0storage.blob.core.windows.net/</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Version
      </td>
      <td>
        <code>?sv=2024-11-04</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Services
      </td>
      <td>
        <code>&ss=b</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Resource Types
      </td>
      <td>
        <code>&srt=sco</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Permissions
      </td>
      <td>
        <code>&sp=rl</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Expiration
      </td>
      <td>
        <code>&se=2025-08-23T14:41:22Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Start
      </td>
      <td>
        <code>&st=2025-08-23T06:26:22Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Protocol
      </td>
      <td>
        <code>&spr=https</code>
      </td>
    </tr>
    <tr>
      <td>
        Signature
      </td>
      <td>
        <code>5mTXcPjJGNQev0SWYg6bWIuJOHQu1uC7pBQKE9W7Qhw%3D</code>
      </td>
    </tr>
  </tbody>
</table>

If you try to upload a file to a container using this SAS, you'll get an error saying _"Failed to start transfer: Insufficient credentials."_

If you try to attach to an individual Blob container using this SAS, you'll get an error saying _"The URL is missing a path to the resource."_

## Service-Level SAS

### Container-Level

![Creating a Container-Level SAS](assets/11-sas/02-container-level-sas.png)

```http
https://gourmade0storage.blob.core.windows.net/north?sp=rl&st=2025-08-23T04:47:53Z&se=2025-08-23T13:02:53Z&spr=https&sv=2024-11-04&sr=c&sig=tlplCeeldSYcAqJWceFBDuZ4A8rkLXEdF4SSSpp%2FftI%3D
```

<table>
  <thead>
    <tr>
      <th>Part</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Account Name
      </td>
      <td>
        <code>https://gourmade0storage.blob.core.windows.net/</code>
      </td>
    </tr>
    <tr>
      <td>
        Container Name
      </td>
      <td>
        <code>north</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Permissions
      </td>
      <td>
        <code>?sp=rl</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Start
      </td>
      <td>
        <code>&st=2025-08-23T04:47:53Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Expiry
      </td>
      <td>
        <code>&2025-08-23T13:02:53Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Protocol
      </td>
      <td>
        <code>&spr=https</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Version
      </td>
      <td>
        <code>&sv=2024-11-04</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Resource
      </td>
      <td>
        <code>&sr=c</code>
      </td>
    </tr>
    <tr>
      <td>
        Signature
      </td>
      <td>
        <code>&sig=tlplCeeldSYcAqJWceFBDuZ4A8rkLXEdF4SSSpp%2FftI%3D</code>
      </td>
    </tr>
  </tbody>
</table>

Notice that it uses `sr` and not `srt`. If you try to to use this SAS URL to attach to a Storage Account or Service, you'll get an error.

![The SAS is not a valid account SAS. An account SAS with service ('ss') and resource type ('srt') parameters is required.](assets/11-sas/03-error-container-level-sas.png)

#### Container-Level SAS using Stored Access Policy

![Stored Access Policy Menu Item](assets/11-sas/04-stored-access-policy.png)

![Create Storage Access Policy](assets/11-sas/05-create-storage-access-policy.png)

Make sure to hit _Save_.

Now, when you try to create a SAS using the Stored Access Policy, it will inherit the configuration.

![SAS associated with a Stored Access Policy](assets/11-sas/06-sas-using-stored-access-policy.png)

```http
https://gourmade0storage.blob.core.windows.net/south?si=Read-Only&spr=https&sv=2024-11-04&sr=c&sig=4B7dzrcqZWy7Naw9gz%2BpICjvKR8d3GUY3FDyy6D6r6c%3D
```

`si` stands for Signed Identifier.

However, you can't extract the permissions from a SAS created with Stored Access Policy.

![Unknown Permissions](assets/11-sas/07-unknown-permissions.png)

Trying to upload a file will cause the following prompts.

![Specify which features should Storage Explorer attempt to perform.](assets/11-sas/08-explorer-unable-to-detect-permissions.png)

You'll get a cryptic error `Transfer of 'C:\Users\Therese\Documents\Web Development\Microsoft Azure\Sample Shipment File\teriz-de-ocampo.pdf' to 'south/laguna/los-banos/' canceled: 0 items transferred, error: UnexpectedCancel (used SAS, discovery completed)` instead of the clearer message you would get without the use of Access Policy (_"Failed to start transfer: Insufficient credentials"_).

If you try to use this SAS URI past the expiration, you'll get _"Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature. RequestId: a92d3f2-d01e-0069-6a04-146830000000 Time:2025-08-23T08:01:48.3252511Z"_.

You can just easily edit the expiration time of the Stored Access Policy without regenerating a new SAS. If you want to revoke the access, you can also just easily edit the expiration time to be a date of the past.

#### [Container-Level SAS via User Delegated Key](https://www.youtube.com/watch?v=g46qhlY8LAY)

Whenever you create a SAS, you need to sign it. Instead of signing it with an access key, you can use a User Delegation Key instead. The User Delegation Key is the crendential that Microsoft Entra ID issued for your security principal.

In order to generate a SAS via User Delegation Key, the currently signed in user musth have a role assigned with a permission to _Generate a user delegation key._

Note that even if you assigned a _Storage Blob Data Reader_ role to a user, they won't be able to see anything from the portal. They'll just get _"No storage account to display"_. This is because _Storage Blob Data Reader_ is for the data plane access, not for the control or management access. You also need to assign the _Reader_ role.

A user delegation SAS is more secure since it does not rely on the permissions included in the SAS token only. It also takes into consideration the RBAC permissions of the user who created this SAS token.

![You don't have permission to grant add consent, write access. You can still create a shared access signature, but you'll need an RBAC role with additional permissions before you can grant that level of access to your signature recipient.](assets/11-sas/09-user-delagation-key-permission-error.png)

The generated User Delegation Key is only available for 7 days. This means that the SAS could only live for 7 days as well.

![Expiry data and time should be within 7 days of the current time.](assets/11-sas/10-user-delegation-key-timeline-error.png)

```http
https://gourmade0storage.blob.core.windows.net/south?sp=r&st=2025-08-23T09:54:22Z&se=2025-08-23T13:09:22Z&skoid=6664658a-f6ec-4e72-xxxxxxxxxxxx&sktid=2d0a6b7f-d345-4b28-9f6b-xxxxxxxxxxxx&skt=2025-08-23T09:54:22Z&ske=2025-08-23T13:09:22Z&sks=b&skv=2024-11-04&spr=https&sv=2024-11-04&sr=c&sig=837nVGcEMqout3pNuKZd7XQoO3tZXyrrve4rpk6gmLs%3D
```

<table>
  <thead>
    <tr>
      <th>Part</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Account Name
      </td>
      <td>
        <code>https://gourmade0storage.blob.core.windows.net/</code>
      </td>
    </tr>
    <tr>
      <td>
        Container Name
      </td>
      <td>
        <code>south</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Permissions
      </td>
      <td>
        <code>?sp=r</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Start
      </td>
      <td>
        <code>&st=2025-08-23T09:54:22Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Expiry
      </td>
      <td>
        <code>&se=2025-08-23T13:09:22Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Object ID
      </td>
      <td>
        <code>&skoid=6664658a-f6ec-4e72-xxxxxxxxxxxx</code> - specifies the object ID for a Microsoft Entra security principal. You can verify this by going to Entra ID > Users > Select the User > Overview of the User > Object ID.
      </td>
    </tr>
    <tr>
      <td>
        Signed Tenant ID
      </td>
      <td>
        <code>&sktid=2d0a6b7f-d345-4b28-9f6b-xxxxxxxxxxxx</code> - specifies the Microsoft Entra tenant in which a security principal is defined. You can verify this by going to Entra ID > Overview > Tenant ID.
      </td>
    </tr>
    <tr>
      <td>
        Signed Key Start
      </td>
      <td>
        <code>&skt=2025-08-23T09:54:22Z</code> - same value as <code>st</code>. It is the start time of the User Delegation Key itself.
      </td>
    </tr>
    <tr>
      <td>
        Signed Key Expiration
      </td>
      <td>
        <code>&ske=2025-08-23T13:09:22Z</code> - same value as <code>se</code>. It is the expiration of the User Delegation Key itself.
      </td>
    </tr>
    <tr>
      <td>
        Signed Key Services
      </td>
      <td>
        <code>&sks=b</code> - indicates the service for which the user delegation key is valid.
      </td>
    </tr>
    <tr>
      <td>
        Signed Key Version
      </td>
      <td>
        <code>&skv=2024-11-04</code> - the value is returned by the <i>Get User Delegation Key</i> operation. Specifies the storage service version that was used to get the user delegation key.
      </td>
    </tr>
    <tr>
      <td>
        Signed Protocol
      </td>
      <td>
        <code>&spr=https</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Version
      </td>
      <td>
        <code>&sv=2024-11-04</code> - indicates the version of the service that's used to construct the signature field.
      </td>
    </tr>
    <tr>
      <td>
        Signed Resource
      </td>
      <td>
        <code>&sr=c</code>
      </td>
    </tr>
    <tr>
      <td>
        Signature
      </td>
      <td>
        <code>&sig=837nVGcEMqout3pNuKZd7XQoO3tZXyrrve4rpk6gmLs%3D</code>
      </td>
    </tr>
  </tbody>
</table>

If you want to invalidate the SAS, either:

- remove the role assigned the user
- [use REST API to revoke the user delegation keys](https://learn.microsoft.com/en-us/rest/api/storagerp/storage-accounts/revoke-user-delegation-keys?view=rest-storagerp-2024-01-01&tabs=HTTP&tryIt=true&source=docs)

### Blob-Level SAS

![Creating a Blob-Level SAS](assets/11-sas/11-blob-level-sas.png)

```http
https://gourmade0storage.blob.core.windows.net/south/cavite/naic/teriz-de-ocampo.pdf?sp=r&st=2025-08-23T06:49:57Z&se=2025-08-23T15:04:57Z&spr=https&sv=2024-11-04&sr=b&sig=zm22egxASPfgD1YqBwVmckcPMB7O0dof8r%2FiV1ZRZC4%3D
```

<table>
  <thead>
    <tr>
      <th>Part</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Account Name
      </td>
      <td>
        <code>https://gourmade0storage.blob.core.windows.net/</code>
      </td>
    </tr>
    <tr>
      <td>
        Container Name
      </td>
      <td>
        <code>south/cavite/naic/</code>
      </td>
    </tr>
    <tr>
      <td>
        Blob name
      </td>
      <td>
        <code>teriz-de-ocampo.pdf</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Permissions
      </td>
      <td>
        <code>?sp=r</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Start
      </td>
      <td>
        <code>&st=2025-08-23T06:49:57Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Expiry
      </td>
      <td>
        <code>&se=2025-08-23T15:04:57Z</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Protocol
      </td>
      <td>
        <code>&spr=https</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Version
      </td>
      <td>
        <code>&sv=2024-11-04</code>
      </td>
    </tr>
    <tr>
      <td>
        Signed Resource
      </td>
      <td>
        <code>&sr=b</code>
      </td>
    </tr>
    <tr>
      <td>
        Signature
      </td>
      <td>
        <code>&sig=zm22egxASPfgD1YqBwVmckcPMB7O0dof8r%2FiV1ZRZC4%3D</code>
      </td>
    </tr>
  </tbody>
</table>

Using this SAS URI did not work for any of the supported resources by Microsoft Azure Storage Explorer. But using the URI on a browser worked.

![Storage Explorer Connection Options](assets/11-sas/12-storage-explorer-connection-options.png)

Note that you can also generate a Blob-Level SAS with Access Policy. Unlike with container, the _"Access Policy"_ menu item won't show up from the context menu, because the policy has to be created on the container-level. Whatever policies you've already created for the container of the blob, it will show up as an option when creating a SAS.

![Blob SAS using Stored Access Policy](assets/11-sas/13-blob-sas-using-stored-access-policy.png)
