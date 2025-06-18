# Blob Service REST API

## Generic Request Headers

- `x-ms-version` - Required for all authorized requests, the latest version is `2025-05-05`.

## [Copy Blob](https://learn.microsoft.com/en-us/rest/api/storageservices/copy-blob?tabs=microsoft-entra-id)

The `Copy Blob` operation copies a blob to a destination with the storage account.

Beginning with version `2015-02-21`, the source for a `Copy Blob` operation can be a file in any Azure Storage Account.

Send a `PUT` request to the following URI.

```
https://my-account.blob.core.windows.net/my-container/my-destination-blob
```

Set `x-ms-source` request header. This is required and specifies the source blob or file. Example: `https://my-account.blob.core.windows.net/my-container/my-source-blob`
