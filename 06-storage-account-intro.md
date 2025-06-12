# Storage Account

## Create Storage Account

### Security

![Default to Microsoft Entra authorization in the Azure Portal](assets/06-storage-account/01-default-to-entra-auth.png)

TODO. Hands-on to see the difference of checking and unchecking of _"Default to Microsoft Entra authorization in the Azure Portal."_

### Network Connectivity

When creating a storage account, you can configure the network connectivity to use a private endpoint. Using such a configuration will result in the creation of three resources: Storage Account, Virtual Network, and Private Link.

![Disable public access and use private access](assets/06-storage-account/02-private-access.png)

However, note that using private access would also mean that you won't be able to view files via Azure Portal.

![Azure Portal - No access if network connectivity is set to private](assets/06-storage-account/03-portal-no-access.png)

#### Difference between a Private Endpoint and a Private Link

A private endpoint is a network interface that uses a private IP address from your virtual network. This network interface connects you privately and securely to a service that's powered by Azure Private Link.

The difference is that a **private endpoint** is a NIC, and a **private link** is a service.

Private endpoints will have a NIC on a VNET that will let you securely bypass NSGs and send traffic directly to the resource the private endpoint is associated to.

On the other hand, a private link can be paired with a private endpoint to allow traffice to a VNET or NSG. You would setup the private link first and then create the private endpoint to point to the said private link.
