#!/usr/bin/env python3
"""
Advanced Email Automation System
Send personalized emails with templates, attachments, and scheduling
"""

import smtplib
import ssl
import csv
import json
import argparse
import logging
import schedule
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import os

class EmailAutomator:
    def __init__(self, config_file: Optional[str] = None):
        self.setup_logging()
        self.config = self.load_config(config_file)
        self.stats = {"sent": 0, "failed": 0, "total": 0}
    
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('email_automation.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_config(self, config_file: Optional[str] = None) -> Dict:
        """Load email configuration"""
        default_config = {
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 587,
            "use_tls": True,
            "sender_email": "",
            "sender_password": "",
            "sender_name": "",
            "default_subject": "Newsletter",
            "templates_dir": "templates"
        }
        
        if config_file and os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    loaded_config = json.load(f)
                default_config.update(loaded_config)
                self.logger.info(f"Configuration loaded from {config_file}")
            except Exception as e:
                self.logger.warning(f"Error loading config: {e}")
        
        # Check for environment variables
        env_vars = {
            "SENDER_EMAIL": "sender_email",
            "SENDER_PASSWORD": "sender_password",
            "SENDER_NAME": "sender_name",
            "SMTP_SERVER": "smtp_server",
            "SMTP_PORT": "smtp_port"
        }
        
        for env_var, config_key in env_vars.items():
            if os.getenv(env_var):
                if config_key == "smtp_port":
                    default_config[config_key] = int(os.getenv(env_var))
                else:
                    default_config[config_key] = os.getenv(env_var)
        
        return default_config
    
    def load_template(self, template_path: str) -> str:
        """Load email template from file"""
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            self.logger.error(f"Error loading template {template_path}: {e}")
            return ""
    
    def personalize_content(self, content: str, recipient_data: Dict[str, Any]) -> str:
        """Replace placeholders in content with recipient data"""
        personalized = content
        
        for key, value in recipient_data.items():
            placeholder = f"{{{key}}}"
            personalized = personalized.replace(placeholder, str(value))
        
        # Add common placeholders
        personalized = personalized.replace("{date}", datetime.now().strftime("%Y-%m-%d"))
        personalized = personalized.replace("{time}", datetime.now().strftime("%H:%M"))
        personalized = personalized.replace("{year}", str(datetime.now().year))
        
        return personalized
    
    def create_message(self, recipient: Dict[str, Any], template_content: str,
                      subject: str, attachments: List[str] = None) -> MIMEMultipart:
        """Create email message"""
        msg = MIMEMultipart()
        
        # Set headers
        msg['From'] = f"{self.config['sender_name']} <{self.config['sender_email']}>"
        msg['To'] = recipient['email']
        msg['Subject'] = self.personalize_content(subject, recipient)
        
        # Personalize content
        personalized_content = self.personalize_content(template_content, recipient)
        
        # Attach body
        msg.attach(MIMEText(personalized_content, 'html' if '<html>' in personalized_content.lower() else 'plain'))
        
        # Add attachments
        if attachments:
            for file_path in attachments:
                if os.path.exists(file_path):
                    try:
                        with open(file_path, "rb") as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {os.path.basename(file_path)}'
                        )
                        msg.attach(part)
                        self.logger.info(f"Attached file: {file_path}")
                    except Exception as e:
                        self.logger.error(f"Error attaching file {file_path}: {e}")
                else:
                    self.logger.warning(f"Attachment file not found: {file_path}")
        
        return msg
    
    def send_email(self, message: MIMEMultipart) -> bool:
        """Send a single email"""
        try:
            # Create SMTP session
            server = smtplib.SMTP(self.config['smtp_server'], self.config['smtp_port'])
            
            if self.config['use_tls']:
                server.starttls()  # Enable security
            
            server.login(self.config['sender_email'], self.config['sender_password'])
            
            # Send email
            text = message.as_string()
            server.sendmail(self.config['sender_email'], message['To'], text)
            server.quit()
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error sending email to {message['To']}: {e}")
            return False
    
    def load_recipients_from_csv(self, csv_file: str) -> List[Dict[str, Any]]:
        """Load recipients from CSV file"""
        recipients = []
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    recipients.append(dict(row))
            
            self.logger.info(f"Loaded {len(recipients)} recipients from {csv_file}")
            
        except Exception as e:
            self.logger.error(f"Error loading recipients from {csv_file}: {e}")
        
        return recipients
    
    def send_bulk_emails(self, recipients: List[Dict[str, Any]], template_path: str,
                        subject: str, attachments: List[str] = None, delay: int = 1) -> Dict[str, int]:
        """Send bulk emails to multiple recipients"""
        
        if not recipients:
            self.logger.error("No recipients provided")
            return self.stats
        
        # Load template
        template_content = self.load_template(template_path)
        if not template_content:
            self.logger.error("Failed to load template")
            return self.stats
        
        self.stats["total"] = len(recipients)
        
        self.logger.info(f"Starting bulk email send to {len(recipients)} recipients")
        
        for i, recipient in enumerate(recipients, 1):
            try:
                # Validate recipient has email
                if 'email' not in recipient or not recipient['email']:
                    self.logger.warning(f"Recipient {i} missing email address")
                    self.stats["failed"] += 1
                    continue
                
                # Create message
                message = self.create_message(recipient, template_content, subject, attachments)
                
                # Send email
                if self.send_email(message):
                    self.stats["sent"] += 1
                    self.logger.info(f"Email sent to {recipient['email']} ({i}/{len(recipients)})")
                else:
                    self.stats["failed"] += 1
                
                # Delay between emails to avoid being flagged as spam
                if delay > 0 and i < len(recipients):
                    time.sleep(delay)
                
            except Exception as e:
                self.logger.error(f"Error processing recipient {i}: {e}")
                self.stats["failed"] += 1
        
        return self.stats
    
    def send_single_email(self, recipient_email: str, template_path: str,
                         subject: str, recipient_data: Dict[str, Any] = None,
                         attachments: List[str] = None) -> bool:
        """Send a single email"""
        
        if not recipient_data:
            recipient_data = {"email": recipient_email, "name": "Recipient"}
        
        # Ensure email is in recipient data
        recipient_data["email"] = recipient_email
        
        # Load template
        template_content = self.load_template(template_path)
        if not template_content:
            return False
        
        # Create and send message
        message = self.create_message(recipient_data, template_content, subject, attachments)
        
        if self.send_email(message):
            self.logger.info(f"Email sent successfully to {recipient_email}")
            return True
        else:
            self.logger.error(f"Failed to send email to {recipient_email}")
            return False
    
    def schedule_emails(self, recipients: List[Dict[str, Any]], template_path: str,
                       subject: str, send_time: str, attachments: List[str] = None):
        """Schedule emails to be sent at a specific time"""
        
        def send_job():
            self.send_bulk_emails(recipients, template_path, subject, attachments)
        
        schedule.every().day.at(send_time).do(send_job)
        
        self.logger.info(f"Emails scheduled for {send_time} daily")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            self.logger.info("Email scheduling stopped")
    
    def create_sample_template(self, template_path: str):
        """Create a sample email template"""
        sample_template = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Our Newsletter!</h1>
    </div>
    
    <div class="content">
        <p>Hello {name},</p>
        
        <p>Thank you for subscribing to our newsletter. We're excited to share our latest updates with you!</p>
        
        <p>Here's what's new:</p>
        <ul>
            <li>Feature 1: Amazing new functionality</li>
            <li>Feature 2: Improved user experience</li>
            <li>Feature 3: Enhanced security</li>
        </ul>
        
        <p>Best regards,<br>
        The Team</p>
    </div>
    
    <div class="footer">
        <p>You received this email because you subscribed to our newsletter.<br>
        Date: {date} | Time: {time}</p>
    </div>
</body>
</html>
        """
        
        os.makedirs(os.path.dirname(template_path), exist_ok=True)
        with open(template_path, 'w', encoding='utf-8') as f:
            f.write(sample_template.strip())
        
        self.logger.info(f"Sample template created at {template_path}")
    
    def print_statistics(self):
        """Print email sending statistics"""
        print("\n" + "="*50)
        print("EMAIL AUTOMATION STATISTICS")
        print("="*50)
        print(f"Total recipients: {self.stats['total']}")
        print(f"Emails sent successfully: {self.stats['sent']}")
        print(f"Failed sends: {self.stats['failed']}")
        if self.stats['total'] > 0:
            success_rate = (self.stats['sent'] / self.stats['total']) * 100
            print(f"Success rate: {success_rate:.1f}%")
        print("="*50)

def main():
    parser = argparse.ArgumentParser(description="Advanced Email Automation System")
    parser.add_argument("-c", "--config", help="Configuration file path")
    parser.add_argument("-r", "--recipients", help="CSV file with recipients")
    parser.add_argument("-t", "--template", help="Email template file")
    parser.add_argument("-s", "--subject", default="Newsletter", help="Email subject")
    parser.add_argument("-a", "--attachments", nargs='+', help="File attachments")
    parser.add_argument("-d", "--delay", type=int, default=1, help="Delay between emails (seconds)")
    parser.add_argument("--email", help="Send to single email address")
    parser.add_argument("--schedule", help="Schedule time (HH:MM format)")
    parser.add_argument("--create-template", help="Create sample template at specified path")
    parser.add_argument("--create-config", help="Create sample config file")
    
    args = parser.parse_args()
    
    # Create sample files if requested
    if args.create_template:
        automator = EmailAutomator()
        automator.create_sample_template(args.create_template)
        return
    
    if args.create_config:
        sample_config = {
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 587,
            "use_tls": True,
            "sender_email": "your-email@gmail.com",
            "sender_password": "your-app-password",
            "sender_name": "Your Name",
            "default_subject": "Newsletter"
        }
        with open(args.create_config, 'w') as f:
            json.dump(sample_config, f, indent=2)
        print(f"Sample config created at {args.create_config}")
        return
    
    # Validate required arguments
    if not args.template:
        parser.error("Template file is required (--template)")
    
    if not args.recipients and not args.email:
        parser.error("Either --recipients CSV file or --email address is required")
    
    # Create automator
    automator = EmailAutomator(args.config)
    
    # Send to single email
    if args.email:
        success = automator.send_single_email(
            args.email, args.template, args.subject, 
            {"name": "Recipient"}, args.attachments
        )
        if success:
            print("Email sent successfully!")
        else:
            print("Failed to send email!")
        return
    
    # Load recipients
    recipients = automator.load_recipients_from_csv(args.recipients)
    if not recipients:
        print("No valid recipients found!")
        return
    
    # Send emails
    if args.schedule:
        automator.schedule_emails(recipients, args.template, args.subject, 
                                 args.schedule, args.attachments)
    else:
        automator.send_bulk_emails(recipients, args.template, args.subject, 
                                  args.attachments, args.delay)
        automator.print_statistics()

if __name__ == "__main__":
    main()
