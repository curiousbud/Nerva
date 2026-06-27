# 📧 Email Automation Tool

A comprehensive Python script for automating email tasks including bulk sending, personalized messages, and scheduled email campaigns. Perfect for newsletters, notifications, and automated email workflows.

## ✨ Features

- **Bulk Email Sending**: Send personalized emails to multiple recipients
- **Template Support**: HTML and text email templates with variable substitution
- **CSV Integration**: Import recipient lists from CSV files
- **Attachment Support**: Send files and documents automatically
- **SMTP Flexibility**: Works with Gmail, Outlook, and custom SMTP servers
- **Scheduling**: Send emails at specific times or intervals
- **Error Handling**: Robust error handling with retry mechanisms
- **Progress Tracking**: Real-time sending progress with detailed logs
- **Personalization**: Dynamic content insertion based on recipient data

## 📋 Requirements

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `smtplib` - Email sending (built-in)
- `email` - Email message formatting (built-in)
- `pandas` - CSV file processing
- `jinja2` - Template engine for dynamic content
- `schedule` - Email scheduling functionality

## 🚀 Usage

### Basic Email Sending

```bash
# Send single email
python email_automator.py --to recipient@example.com --subject "Test" --body "Hello World"

# Send bulk emails from CSV
python email_automator.py --csv recipients.csv --template newsletter.html

# Send with attachments
python email_automator.py --csv recipients.csv --template invite.html --attach file1.pdf file2.jpg
```

### Advanced Features

```bash
# Schedule daily newsletter
python email_automator.py --csv subscribers.csv --template daily.html --schedule daily --time 09:00

# Send with custom SMTP settings
python email_automator.py --csv list.csv --smtp smtp.company.com --port 587 --template custom.html

# Dry run mode (test without sending)
python email_automator.py --csv test.csv --template test.html --dry-run
```

## 📄 Email Templates

### HTML Template Example (`newsletter.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ subject }}</title>
</head>
<body>
    <h1>Hello {{ name }}!</h1>
    <p>Welcome to our newsletter, {{ name }}.</p>
    <p>Your account type: {{ account_type }}</p>
    <p>Best regards,<br>{{ sender_name }}</p>
</body>
</html>
```

### Text Template Example (`notification.txt`)
```text
Hello {{ name }},

This is a reminder about {{ event_name }} on {{ date }}.

Location: {{ location }}
Time: {{ time }}

Please confirm your attendance.

Best regards,
{{ sender_name }}
```

## 📊 CSV Format

Your CSV file should include recipient information:

```csv
name,email,account_type,company
John Doe,john@example.com,premium,ABC Corp
Jane Smith,jane@example.com,basic,XYZ Ltd
Bob Johnson,bob@example.com,premium,123 Inc
```

## ⚙️ Configuration

### Environment Variables
```bash
# Email credentials
export EMAIL_USER="your.email@gmail.com"
export EMAIL_PASSWORD="your_app_password"
export EMAIL_SMTP="smtp.gmail.com"
export EMAIL_PORT="587"
```

### Configuration File (`config.json`)
```json
{
    "smtp": {
        "server": "smtp.gmail.com",
        "port": 587,
        "use_tls": true
    },
    "sender": {
        "name": "Your Name",
        "email": "your.email@gmail.com"
    },
    "scheduling": {
        "timezone": "UTC",
        "max_retries": 3,
        "delay_between_emails": 1
    }
}
```

## 📈 Example Use Cases

- **Newsletter Campaigns**: Send weekly/monthly newsletters to subscribers
- **Event Notifications**: Automated reminders for meetings or events
- **Welcome Emails**: Onboard new users with personalized messages
- **Invoice Delivery**: Automatically send invoices to customers
- **Status Updates**: Notify teams about system status or project updates

## 🛡️ Security Features

- **App Passwords**: Supports Gmail app passwords for secure authentication
- **TLS Encryption**: Secure email transmission
- **Credential Protection**: Environment variable support for sensitive data
- **Rate Limiting**: Configurable delays to respect email provider limits

## 📋 Command Line Options

| Option | Description |
|--------|-------------|
| `--to` | Single recipient email address |
| `--csv` | CSV file with recipient list |
| `--subject` | Email subject line |
| `--body` | Plain text email body |
| `--template` | HTML/text template file |
| `--attach` | Files to attach |
| `--schedule` | Schedule type (daily, weekly, monthly) |
| `--time` | Time to send (HH:MM format) |
| `--dry-run` | Test mode without sending |

## ⚠️ Important Notes

- **Email Limits**: Respect your email provider's sending limits
- **App Passwords**: Use app passwords instead of regular passwords for Gmail
- **Testing**: Always test with a small group before bulk sending
- **Unsubscribe**: Include unsubscribe links in marketing emails
- **Privacy**: Comply with email privacy regulations (GDPR, CAN-SPAM)

## 🤝 Contributing

This script is part of the Nerva project. Feel free to submit issues and enhancement requests!

## 📄 License

This script is part of the Nerva project and is licensed under MIT License.
