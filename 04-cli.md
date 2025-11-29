# Azure CLI Cheat Sheet

## Set-Up

If `az login` keeps on failing, disable the Windows broker.

```bash
az config set core.enable_broker_on_windows=false
```

## Resource Group

```bash
az group delete \
  --name <group-name> |
  --no-wait
```

```bash
az group create \
  --location <location>
  --name <group-name>
```

## Azure App Service

```bash
az webapp up -g $resourceGroup -n $appName --html
```

```bash
az webapp config appsettings set \
  --resource-group <group-name>
  --name <app-name>
  --settings key1=value1 key2=value2
```

```bash
az webapp log tail \
  --resource-group <group-name>
  --name <app-name>
```

Operates at the Application Layer

```bash
az webapp cors add \
  -g myResourceGroup \
  -n MyWebApp \
  --allowed-origins https://myapps.com
```

### Traffic Routing

The `az webapp traffic-routing` has only 3 possible actions:

- `clear`
- `set`
- `show`

```bash
az webapp traffic-routing set \
  --resource-group gourmade-rg \
  --name gourmade-admin \
  --distribution staging=50
```

```bash
az webapp traffic-routing show \
  --resource-group gourmade-rg \
  --name gourmade-admin
```

```
[
  {
    "actionHostName": "quasset-erp-staging.azurewebsites.net",
    "changeDecisionCallbackUrl": null,
    "changeIntervalInMinutes": null,
    "changeStep": null,
    "maxReroutePercentage": null,
    "minReroutePercentage": null,
    "name": "staging",
    "reroutePercentage": 50.0
  }
]
```

### Managed Identity

The `az webapp identity` has only 3 possible actions:

- `assign`
- `remove`
- `show`

### Access Restrictions

Operates at the Network Layer

```bash
az webapp config access-restriction add \
  --resource-group MyResourceGroup \
  --name MyWebApp \
  --rule-name Developers \
  --action Allow \
  --ip-address 130.220.0.0/27 \
  --priority 200
```

## Azure Storage Account

In Azure CLI, the `@` symbol is a convention used to instruct the CLI to load the value for a parameter from a local file. This is particularly useful for parameters that expect complex JSON input. See another example from [az deployment group](https://learn.microsoft.com/en-us/cli/azure/deployment/group?view=azure-cli-latest#az-deployment-group-create)

```bash
az storage account management-policy create \
  --account-name <storage-account> \
  --policy @policy.json \
  --resource-group <group-name>
```

```bash
az storage account create \
  --resource-group <group-name> \
  --name <storage-account-name> \
  --location <location>
  --sku Standard_LRS
```

```bash
az storage container policy create \
  --account-name <storage account name \
  --acount-key <storage account key> \
  --container-name <container name> \
  --name <stored access policy identifier> \
  --start <start time UTC datetime> \
  --expiry <expiry time UTC datetime> \
  --permissions <(a)dd, (c)reate, (d)elete, (l)ist, (r)ead (w)rite>
```

## Azure Cosmos DB

This will return a `documentEndpoint` in the response.

```bash
az cosmosdb create \
  --name <cosmos-db-account-name> \
  --resource-group <group-name>
```

Retrieves the `primaryMasterKey`

```bash
az cosmosdb keys list \
  --name <cosmos-db-account-name> \
  --resource-group <group-name>
```

## Container Registries

```bash
az acr create \
  --resource-group <group-name>
  --name <container-name>
  --sku Basic
```

```bash
az acr build \
  --registry gourmade \
  --image api/production:v1 \
  --file Dockerfile .
```

```bash
az acr repository list \
  --name gourmade \
  --output table \
```

```bash
az acr repository show-tags \
  --name gourmade \
  --repository api/production \
  --output table
```

```bash
az acr run \
  --registry gourmade \
  --cmd '$Registry/api/gourmade:v1' /dev/null
```

```bash
az acr repository delete \
  --name devregistry \
  --image dev/nginx:latest
```

The `suffix` parameter should only be used if you are accessing the registry from a different subscription or have permissions to access images but not permission to manage the registry resource.

```bash
az acr repository delete \
  --name devregistry \
  --suffix dev/nginx:latest
```

```bash
az acr manifest delete \
  --registry devregistry \
  --name dev/nginx:latest
```

## Container Instances

```bash
az container create \
  --name gourmade-aci \
  --resource-group gourmade-rg \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --ports 80 \
  --dns-name-label gourmade-aci \
  --location southeastasia \
  --cpu 1 \
  --memory 1.5
```

- `name` is the name of the container group.
- Initially, you made a mistake by using `dns-label-name` instead of `dns-name-label`. You then got an error: `argument --dns-name-label: expected one argument`. For such cases, a tip would be to use `az container create --help | grep dns`.
- When running this for the first time, you might encounter `(MissingSubscriptionRegistration) The subscription is not registered to use namespace 'Microsoft.ContainerInstance'. See https://aka.ms/rps-not-found for how to register subscriptions.`
- The error means that the Azure subscription isn't registered yet to use the Azure Container Instances (ACI) service.
- These errors are displayed when you deploy resources with a Bicep file or ARM template.
- Most providers are registered automatically by the Microsoft Azure portal or the command-line interface, but not all.

```bash
az provider register --namespace Microsoft.ContainerInstance
```

To check the state (`Registering` or `Registered`) you can use any of the following commands.

```bash
az provider show --namespace Microsoft.ContainerInstance --query "registrationState"
```

```bash
az container show \
  --resource-group gourmade-rg \
  --name gourmade-aci \
  --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" \
  --out table

FQDN                                          ProvisioningState
--------------------------------------------  -------------------
gourmade-aci.southeastasia.azurecontainer.io  Succeeded
```

To change the restart policy of a container, you must first delete the container group, then create it again. Certain properties like `dns-name-label` can be updated using the `create` command without having to delete it first. [Learn more](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-update).

```bash
az container create \
  --resource-group gourmade-rg \
  --name gourmade-aci \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --restart-policy OnFailure
```

The following command is used to restart all the containers in a container group.

```bash
az container restart \
  --resource-group gourmade-rg \
  --name gourmade-aci \
  --no-wait
```

## Container Apps

```bash
az extension add --name containerapp --upgrade
```

```bash
az provider register --namespace Microsoft.App
```

```bash
az provider register --namespace Microsoft.OperationalInsights
```

```bash
az containerapp env create \
  --resource-group gourmade-rg \
  --location southeastasia \
  --name gourmade-env

No Log Analytics workspace provided.
Generating a Log Analytics workspace with name "workspace-gourmadergVEt4"
```

```bash
az containerapp create \
  --resource-group gourmade=rg \
  --name gourmade-quiz \
  --environment gourmade-env \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn

The behavior of this command has been altered by the following extension: containerapp

Container app created. Access your app at https://gourmade-quiz.happypebble-d9440b1a.southeastasia.azurecontainerapps.io/

"gourmade-quiz.happypebble-d9440b1a.southeastasia.azurecontainerapps.io"
```

Builds and deploys the container app using the Dockerfile in the root of the repository.

```bash
az containerapp up \
  --name gourmade-quiz \
  --source .
```

## Azure Key vault

```bash
az keyvault create \
  --resource-group gourmade-rg \
  --location southeastasia \
  --name gourmade-kv
```

Azure AD group-based role assignment propagation took more than an hour. Direct user assignment was instant.

```bash
az keyvault secret set \
  --vault-name gourmade-kv \
  --name MySecret \
  --value "My Secret Value"
```

Both `ContentType` and `Content-Type` works.

```bash
userPrincipal=$(
  az rest \
    --method GET \
    --url https://graph.microsoft.com/v1.0/me \
    --header 'ContentType=application/json' \
    --query userPrincipalName \
    --output tsv
)
```

```bash
resourceId=$(
  az keyvault show \
    --resource-group gourmade-rg \
    --name gourmade-kv \
    --query id \
    --output tsv
)
```

```bash
az role assignment create \
  --assignee $userPrincipal \
  --role "Key Vault Secrets Officer" \
  --scope $resourceId
```

```bash
az keyvault secret show \
  --vault-name gourmade-kv \
  --name MollieApiKey
```

```bash
az keyvault key rotate \
  --vault-name gourmade-kv \
  --name SigningKey
```

```bash
az keyvault key purge \
  --vault-name gourmade-kv \
  --name SigningKey
```

```bash
az keyvault key set-attributes \
  --vault-name gourmade-kv \
  --name SigningKey \
  [--enabled {false, true}]
  [--expires]
  [--immutable {false, true}]
  [--policy]
  [--tags]
  [--version]
```

## Azure App Configuration

```bash
az appconfig identity assign \
  --name gourmade-app-config \
  --resource-group gourmade-rg
```

```bash
az identity create \
  --resource-group gourmade-rg \
  --name gourmade-app-config-id
```

```bash
az appconfig identity assign \
  --resource-group gourmade-rg \
  --name gourmade-app-config \
  --identities /subscriptions/[subscription id]/resourcegroups/gourmade-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/gourmade-app-config-id
```

```bash
az appconfig kv set \
  --name gourmade-app-config \
  --key Dev:ConnStr \
  --value connectionString \
  --yes
```

## Azure Event Grid

```bash
az eventgrid topic create \
  --name <topic-name> \
  --resource-group <group-name> \
  --location <location>
```

The following script uses a pre-built web app that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

```bash
az deployment group create \
  --resource-group <group-name> \
  --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/main/azuredeploy.json" \
  --parameters siteName=event-grid-site siteUrl=https://event-grid-site.azurewebsites.net
```

```bash
endpoint="${siteURL}/api/updates"
topicId=$(az eventgrid topic show --resource-group $resourceGroup \
  --name $topicName --query "id" --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicId \
  --name TopicSubscription \
  --endpoint $endpoint
```

```bash
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --name  <event-subscription-name> \
  --topic-name <topic-name> \
  --endpoint <URL> \
  --max-delivery-attemps 18
```

```bash
az eventgrid topic key list \
  -g $resourceGroup \
  --name $topicName \
  --query "key1" \
  --output tsv
```

## Azure Event Grid

`--name` can also be `--event-hub-name`

```bash
az eventhubs eventhub create \
  --resource-group MyResourceGroup \
  --namespace-name MyNamespaceName \
  --name MyEventHubName \
  --partition-count 12
```

```bash
az eventhubs eventhub update \
  --resource-group MyResourceGroup \
  --namespace-name MyNamespaceName \
  --name MyEventHubName \
  --partition-count 12
```

```bash
az eventhubs eventhub consumer-group create \
  --resource-group MyResourceGroup \
  --namespace-name MyNamespaceName \
  --eventhub-name MyEventHubName \
  --name MyConsumerGroupName \
```
