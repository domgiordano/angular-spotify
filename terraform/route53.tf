# Hosted Zone Data Source

data "aws_route53_zone" "web_zone" {
  name         = var.domain_suffix
  private_zone = false
}

resource "aws_route53_record" "web_app" {
  zone_id = data.aws_route53_zone.web_zone.zone_id
  name = "${local.domain_name}.${data.aws_route53_zone.web_zone.name}"
  type = "A"
  alias {
      name = aws_cloudfront_distribution.web_app.domain_name
      zone_id = aws_cloudfront_distribution.web_app.hosted_zone_id
      evaluate_target_health = true
  }
}
