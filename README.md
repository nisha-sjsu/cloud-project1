# cloud-project1

Overview of implementations
I have demoed the features implemented in the video attached to this assignment.

User Registration
Registration form implemented using RDS MySQL to store user details


Custom Login
Custom login form implemented using RDS MySQL to store user details


FB, Google Login
Google oAuth2.0 implemented


File Upload
File upload has been done with help of API Gateway and Lambda functions node.js S3 SDKs.


File Download
File download has been done with help of CloudFront, API Gateway, Lambda function node.js, and S3 SDKs.


Database Updates
The user’s username along with the filename, file description, modified date, and creation date is stored in RDS MySQL database.


File Delete 
File delete has been done with help of API Gateway and Lambda functions node.js S3 SDKs.


File Edit
File edit has been done with help of API Gateway and Lambda functions, node.js, and  S3 SDKs.


R53
Registered domain and used R53 to resolve the domain name to IP address of EC2


ELB
Application load balancer has been used to route HTTP requests onto HTTPS


S3, CF
S3 was used to store uploaded files and CloudFront for downloading files from S3


Lambda
Lambda functions has been used to interact with S3 and perform get, put, delete and update functions


SNS, Cloudwatch
SNS has been configured to send emails to the user once they upload a file.
Cloudwatch logs have been configured for API gateway


DR Measures
Replication bucket has been configured


Highly Available Solution (Multi-AZ Replication)
Multi-AZ with one standby providing automatic failover to standby instance


Highly Scalable (Autoscale Group)
Instances will scale if threshold increases


Version Control GitHub, AWS Codestar, Code commit, others
Git for version control and AWS Code Commit has been used for storing project files.


Admin Panel
Admin panel opens for user srinishaa@gmail.com. The admin is given the privilege to get, update, and delete everyone’s files.


UI, Documentation, Video, AWS Resource Config
Website - https://cmpe282-nisha-project1.tk/

CodeCommit repo link - https://git-codecommit.us-east-1.amazonaws.com/v1/repos/project1-cmpe281

CodeCommit credentials - https://drive.google.com/file/d/1_bFo1YaI6Wk2oQmOdemkalMEvOc887sb/view?usp=sharing

Video link - https://drive.google.com/file/d/16U6nf_JHzc2bYdHSWfXnwCF2zkn3K4Hw/view?usp=sharing






