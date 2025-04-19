output "resource_group_name" {
  value = azurerm_resource_group.farms_app.name
}

output "cosmos_db_name" {
  value = azurerm_cosmosdb_account.farms_app.name
}

output "service_bus_namespace" {
  value = azurerm_servicebus_namespace.farms_app.name
}

output "backend_app_name" {
  value = azurerm_linux_web_app.backend.name
}

output "frontend_url" {
  value = azurerm_static_site.frontend.default_host_name
}

output "backend_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}
