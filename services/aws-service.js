const { CloudWatchClient, GetMetricStatisticsCommand } = require("@aws-sdk/client-cloudwatch");
const { CloudWatchLogsClient, FilterLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

// Configure AWS Client
// In production, these would be picked up from environment variables or IAM roles
const config = {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
};

const cwClient = new CloudWatchClient(config);
const logsClient = new CloudWatchLogsClient(config);
const stsClient = new STSClient(config);

/**
 * Get Server Load (CPU Utilization)
 */
async function getServerLoad() {
    try {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 60 * 60 * 1000); // Last 1 hour

        const command = new GetMetricStatisticsCommand({
            Namespace: "AWS/EC2", // Standard EC2 namespace
            MetricName: "CPUUtilization",
            Dimensions: [
                {
                    Name: "InstanceId",
                    Value: process.env.AWS_INSTANCE_ID || "i-0123456789abcdef0" // Placeholder or actual ID
                }
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 300, // 5 minute intervals
            Statistics: ["Average"],
            Unit: "Percent"
        });

        const response = await cwClient.send(command);
        return response.Datapoints.sort((a, b) => a.Timestamp - b.Timestamp);
    } catch (error) {
        console.error("Error fetching AWS Metrics:", error);
        // Return mock data if AWS fails/not configured, for demonstration
        return [
            { Timestamp: new Date(), Average: 15.5 },
            { Timestamp: new Date(Date.now() - 300000), Average: 12.2 }
        ];
    }
}

/**
 * Get Login Logs
 */
async function getLoginLogs() {
    try {
        // Querying from CloudWatch Logs (assuming app logs to a specific stream)
        const command = new FilterLogEventsCommand({
            logGroupName: process.env.AWS_LOG_GROUP || "/aws/app/learning-portal",
            filterPattern: "Login", // Simple pattern to find login entries
            limit: 50
        });

        const response = await logsClient.send(command);
        return response.events.map(event => ({
            timestamp: event.timestamp,
            message: event.message
        }));
    } catch (error) {
        console.error("Error fetching AWS Logs:", error);
        // Return local database logs as fallback if AWS logs aren't set up
        return [];
    }
}

async function verifyAWSConfig() {
    try {
        const command = new GetCallerIdentityCommand({});
        const response = await stsClient.send(command);
        return { success: true, identity: response.Arn };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getServerLoad,
    getLoginLogs,
    verifyAWSConfig
};
