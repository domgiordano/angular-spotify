terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.2.0"
    }
  }
}
provider "aws" {
    access_key = local.access_key
    secret_key = local.secret_key
    region     = var.aws_region
}
