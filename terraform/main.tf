terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "farms_app" {
  name     = "farms-app-resources"
  location = "East US"
}

resource "azurerm_cosmosdb_account" "farms_app" {
  name                = "farms-app-cosmos"
  location            = azurerm_resource_group.farms_app.location
  resource_group_name = azurerm_resource_group.farms_app.name
  offer_type         = "Standard"
  kind               = "MongoDB"

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.farms_app.location
    failover_priority = 0
  }
}

resource "azurerm_servicebus_namespace" "farms_app" {
  name                = "farms-app-servicebus"
  location            = azurerm_resource_group.farms_app.location
  resource_group_name = azurerm_resource_group.farms_app.name
  sku                = "Standard"
}

resource "azurerm_servicebus_queue" "notifications" {
  name         = "notifications"
  namespace_id = azurerm_servicebus_namespace.farms_app.id
}

resource "azurerm_app_service_plan" "farms_app" {
  name                = "farms-app-service-plan"
  location            = azurerm_resource_group.farms_app.location
  resource_group_name = azurerm_resource_group.farms_app.name
  kind               = "Linux"
  reserved           = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_linux_web_app" "backend" {
  name                = "farms-app-backend"
  location            = azurerm_resource_group.farms_app.location
  resource_group_name = azurerm_resource_group.farms_app.name
  service_plan_id     = azurerm_app_service_plan.farms_app.id

  site_config {
    application_stack {
      node_version = "16-lts"
    }
  }

  app_settings = {
    "MONGODB_URI"                        = azurerm_cosmosdb_account.farms_app.connection_strings[0]
    "AZURE_SERVICE_BUS_CONNECTION_STRING" = azurerm_servicebus_namespace.farms_app.default_primary_connection_string
    "WEBSITES_PORT"                      = "3000"
  }
}

resource "azurerm_static_site" "frontend" {
  name                = "farms-app-frontend"
  location            = azurerm_resource_group.farms_app.location
  resource_group_name = azurerm_resource_group.farms_app.name
  sku_tier           = "Free"
}

output "backend_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  value = azurerm_static_site.frontend.default_host_name
}

output "cosmos_connection_string" {
  value     = azurerm_cosmosdb_account.farms_app.connection_strings[0]
  sensitive = true
}

output "servicebus_connection_string" {
  value     = azurerm_servicebus_namespace.farms_app.default_primary_connection_string
  sensitive = true
}
