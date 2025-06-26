# 📶 Auto WiFi Check

A Python script that monitors WiFi connectivity and automatically performs network diagnostics when connection issues are detected. Perfect for troubleshooting network problems and maintaining stable internet connections.

## ✨ Features

- **Continuous WiFi Monitoring**: Automatically checks internet connectivity at regular intervals
- **Smart Diagnostics**: Runs comprehensive network tests when issues are detected
- **Automatic Recovery**: Attempts to restore connectivity through various methods
- **Detailed Logging**: Comprehensive logs of network status and actions taken
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Customizable Intervals**: Configure monitoring frequency and timeout settings
- **Email Notifications**: Optional email alerts for connectivity issues
- **Visual Interface**: Optional GUI for real-time monitoring

## 📋 Requirements

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `psutil` - System and process monitoring
- `requests` - HTTP connectivity testing  
- `smtplib` - Email notifications (built-in)
- `tkinter` - GUI interface (built-in)

## 🚀 Usage

### Basic Monitoring

```bash
# Start basic WiFi monitoring
python wifi_monitor.py

# Monitor with custom interval (in seconds)
python wifi_monitor.py --interval 30

# Enable verbose logging
python wifi_monitor.py --verbose
```

### Advanced Options

```bash
# Enable email notifications
python wifi_monitor.py --email your@email.com --smtp-server smtp.gmail.com

# Custom test URLs for connectivity checking
python wifi_monitor.py --test-urls google.com cloudflare.com

# Run diagnostics only (no continuous monitoring)
python wifi_monitor.py --diagnose-only
```

## 🔧 Configuration

You can configure the script by editing the configuration section at the top of `wifi_monitor.py`:

```python
# Monitoring Configuration
CHECK_INTERVAL = 60  # seconds between checks
TIMEOUT = 10        # connection timeout
TEST_URLS = ["8.8.8.8", "1.1.1.1", "google.com"]
```

## 📊 What It Monitors

- **Internet Connectivity**: Tests connection to multiple reliable servers
- **DNS Resolution**: Checks if domain names can be resolved
- **Network Interface Status**: Monitors WiFi adapter status
- **Signal Strength**: Reports WiFi signal quality (when available)
- **Gateway Accessibility**: Tests connection to default gateway

## 🔧 Automatic Recovery Actions

When connectivity issues are detected, the script attempts:

1. **DNS Flush**: Clears DNS cache
2. **Network Reset**: Resets network interfaces
3. **WiFi Reconnection**: Disconnects and reconnects to WiFi
4. **Router Ping**: Tests connectivity to default gateway

## 📈 Example Output

```
[2024-06-26 10:30:15] ✅ WiFi Status: Connected
[2024-06-26 10:30:15] ✅ Internet: Available (Response: 45ms)
[2024-06-26 10:30:15] ✅ DNS: Working (google.com resolved)
[2024-06-26 10:31:15] ❌ Internet: Connection timeout
[2024-06-26 10:31:15] 🔧 Running diagnostics...
[2024-06-26 10:31:20] ✅ Recovery successful - Internet restored
```

## ⚠️ Important Notes

- **Administrator Privileges**: Some recovery actions may require elevated permissions
- **Email Setup**: Configure your email provider's SMTP settings for notifications
- **Firewall**: Ensure the script isn't blocked by firewall rules
- **Mobile Hotspot**: Script can detect and work with mobile hotspot connections

## 🤝 Contributing

This script is part of the Nerva project. Feel free to submit issues and enhancement requests!

## 📄 License

This script is part of the Nerva project and is licensed under MIT License.
