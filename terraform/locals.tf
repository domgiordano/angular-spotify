locals {
    domain_name = "${var.app_name}${var.domain_suffix}"

  # Get the AWS product account id
    web_app_account_id = data.aws_caller_identity.web_app_account.account_id
    standard_tags = {
        "source" = "terraform",
        "app_name" = var.app_name
    }


 #SECRETS
  access_key = var.access_key #jsondecode(data.aws_secretsmanager_secret_version.access_key.secret_string)["value"]
  secret_key = var.secret_key #jsondecode(data.aws_secretsmanager_secret_version.secret_key.secret_string)["value"]
  app_client_id = jsondecode(data.aws_secretsmanager_secret_version.spotify_creds.secret_string)["clientId"]
  app_client_secret = jsondecode(data.aws_secretsmanager_secret_version.spotify_creds.secret_string)["clientSecret"]
}
