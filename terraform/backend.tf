terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state"
    storage_account_name = "farmsappterraform"
    container_name      = "tfstate"
    key                 = "prod.terraform.tfstate"
  }
}
