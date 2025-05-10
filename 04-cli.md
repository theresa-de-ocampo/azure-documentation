# Azure CLI Cheat Sheet

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
