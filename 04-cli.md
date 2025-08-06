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
