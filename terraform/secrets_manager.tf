data "aws_secretsmanager_secret" "access_key" {
  name = "access_key"
}

data "aws_secretsmanager_secret_version" "access_key" {
  secret_id = data.aws_secretsmanager_secret.access_key.id
}

data "aws_secretsmanager_secret" "secret_key" {
  name = "secret_key"
}

data "aws_secretsmanager_secret_version" "secret_key" {
  secret_id = data.aws_secretsmanager_secret.secret_key.id
}

data "aws_secretsmanager_secret" "spotify_creds" {
  name = "spotify-app-creds"
}

data "aws_secretsmanager_secret_version" "spotify_creds" {
  secret_id = data.aws_secretsmanager_secret.spotify_creds.id
}
