if (!process.env.CLIENT_ID) {
  throw new Error("Client ID is required.");
}

if (!process.env.TENANT_ID) {
  throw new Error("Tenant ID is required.");
}

export interface AppSettings {
  clientId: string;
  tenantId: string;
  graphUserScopes: string[];
}

const settings: AppSettings = {
  clientId: process.env.CLIENT_ID,
  tenantId: process.env.TENANT_ID,
  graphUserScopes: ["user.read", "mail.read", "mail.send"]
};

export default settings;
