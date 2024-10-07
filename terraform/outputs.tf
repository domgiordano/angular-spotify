output "bucket_name" {
  value = aws_s3_bucket.frontend_bucket.bucket
}

output "cloudfront_distribution" {
  value = aws_cloudfront_distribution.cdn.domain_name
}
