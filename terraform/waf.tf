## WAF Resources
resource "aws_wafv2_web_acl" "waf_api_gateway_acl" {
    name  = "${var.app_name}-waf-api-gateway"
    scope = "REGIONAL"
    default_action {
        allow {}
    }
    rule {
        name = "AWSManagedRuleAmazonIpReputationList-rule"
        priority = 0
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRuleAmazonIpReputationList"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRuleAmazonIpReputationList-metric"
            sampled_requests_enabled   = true
        }
    }
    rule {
        name = "AWSManagedRulesSQLiRuleSet-rule"
        priority = 1
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRulesSQLiRuleSet"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRulesSQLiRuleSet-metric"
            sampled_requests_enabled   = true
        }
    }

    rule {
        name = "AWSManagedRulesKnownBadInputsRuleSet-rule"
        priority = 2
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRulesKnownBadInputsRuleSet"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRulesKnownBadInputsRuleSet-metric"
            sampled_requests_enabled   = true
        }
    }

    rule {
        name = "AWSManagedRulesCommonRuleSet-rule"
        priority = 3
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRulesCommonRuleSet"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRulesCommonRuleSet-metric"
            sampled_requests_enabled   = true
        }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.app_name}-waf-main-metrics"
      sampled_requests_enabled   = true
    }
    tags = {
        "name" = "${var.app_name}-waf"
    }
}

resource "aws_wafv2_web_acl" "cloudfront_waf_web_acl" {
    name  = "${var.app_name}-waf"
    scope = "CLOUDFRONT"
    default_action {
        allow {}
    }
    rule {
        name = "AWSManagedRuleAmazonIpReputationList-rule"
        priority = 0
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRuleAmazonIpReputationList"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRuleAmazonIpReputationList-metric"
            sampled_requests_enabled   = true
        }
    }
    rule {
        name = "AWSManagedRulesSQLiRuleSet-rule"
        priority = 1
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRulesSQLiRuleSet"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRulesSQLiRuleSet-metric"
            sampled_requests_enabled   = true
        }
    }

    rule {
        name = "AWSManagedRulesKnownBadInputsRuleSet-rule"
        priority = 2
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRulesKnownBadInputsRuleSet"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRulesKnownBadInputsRuleSet-metric"
            sampled_requests_enabled   = true
        }
    }

    rule {
        name = "AWSManagedRulesCommonRuleSet-rule"
        priority = 3
        override_action {
          none {}
        }
        statement {
          managed_rule_group_statement{
              name = "AWSManagedRulesCommonRuleSet"
              vendor_name = "AWS"
          }
        }
        visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "AWSManagedRulesCommonRuleSet-metric"
            sampled_requests_enabled   = true
        }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.app_name}-waf-main-metrics"
      sampled_requests_enabled   = true
    }
    tags = {
        "name" = "${var.app_name}-waf"
    }
}
