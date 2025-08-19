# Azure CLI Cheat Sheet

If `az login` keeps on failing, disable the Windows broker.

```bash
az config set core.enable_broker_on_windows=false
```

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
