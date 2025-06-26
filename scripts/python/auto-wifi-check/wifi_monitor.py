#!/usr/bin/env python3
"""
Auto WiFi Connection Monitor and Restarter
Automatically monitors WiFi connectivity and restarts connection if needed
"""

import ctypes
import subprocess
import sys
import time
import logging
import schedule
import argparse
from datetime import datetime
from pathlib import Path

class WiFiMonitor:
    def __init__(self, ping_host: str = "8.8.8.8", check_interval: int = 60, max_attempts: int = 3):
        self.ping_host = ping_host
        self.check_interval = check_interval
        self.max_attempts = max_attempts
        self.setup_logging()
        
    def setup_logging(self):
        """Setup logging configuration"""
        log_file = Path("wifi_monitor.log")
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info("WiFi Monitor started")
    
    def is_admin(self) -> bool:
        """Check if running with administrator privileges"""
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False
    
    def request_admin_privileges(self):
        """Request administrator privileges if not already running as admin"""
        if not self.is_admin():
            self.logger.warning("Administrator privileges required. Requesting elevation...")
            try:
                ctypes.windll.shell32.ShellExecuteW(
                    None, "runas", sys.executable, " ".join(sys.argv), None, 1
                )
                sys.exit(0)
            except Exception as e:
                self.logger.error(f"Failed to elevate privileges: {e}")
                sys.exit(1)
    
    def enable_wifi(self) -> bool:
        """Enable WiFi interface"""
        try:
            result = subprocess.run(
                ["netsh", "interface", "set", "interface", "Wi-Fi", "enabled"],
                capture_output=True, text=True, shell=True
            )
            if result.returncode == 0:
                self.logger.info("WiFi interface enabled")
                return True
            else:
                self.logger.error(f"Failed to enable WiFi: {result.stderr}")
                return False
        except Exception as e:
            self.logger.error(f"Error enabling WiFi: {e}")
            return False
    
    def disable_wifi(self) -> bool:
        """Disable WiFi interface"""
        try:
            result = subprocess.run(
                ["netsh", "interface", "set", "interface", "Wi-Fi", "disabled"],
                capture_output=True, text=True, shell=True
            )
            if result.returncode == 0:
                self.logger.info("WiFi interface disabled")
                return True
            else:
                self.logger.error(f"Failed to disable WiFi: {result.stderr}")
                return False
        except Exception as e:
            self.logger.error(f"Error disabling WiFi: {e}")
            return False
    
    def test_connectivity(self) -> bool:
        """Test internet connectivity by pinging a host"""
        try:
            result = subprocess.run(
                ["ping", "-n", "1", self.ping_host],
                capture_output=True, text=True, shell=True
            )
            return result.returncode == 0
        except Exception as e:
            self.logger.error(f"Error testing connectivity: {e}")
            return False
    
    def restart_wifi_connection(self) -> bool:
        """Restart WiFi connection by disabling and re-enabling"""
        self.logger.info("Restarting WiFi connection...")
        
        # Disable WiFi
        if not self.disable_wifi():
            return False
        
        time.sleep(2)
        
        # Enable WiFi
        if not self.enable_wifi():
            return False
        
        # Wait for connection to establish
        time.sleep(10)
        
        return True
    
    def check_and_fix_connection(self):
        """Main monitoring function"""
        try:
            # First ensure WiFi is enabled
            self.enable_wifi()
            time.sleep(2)
            
            # Test connectivity
            if self.test_connectivity():
                self.logger.info("WiFi connection is working properly")
                return
            
            self.logger.warning("WiFi connection issues detected")
            
            # Attempt to fix connection
            for attempt in range(self.max_attempts):
                self.logger.info(f"Reconnection attempt {attempt + 1}/{self.max_attempts}")
                
                if self.restart_wifi_connection():
                    # Test connectivity after restart
                    if self.test_connectivity():
                        self.logger.info("WiFi connection restored successfully!")
                        return
                    else:
                        self.logger.warning(f"Attempt {attempt + 1} failed - connection still not working")
                else:
                    self.logger.error(f"Failed to restart WiFi connection on attempt {attempt + 1}")
                
                if attempt < self.max_attempts - 1:
                    time.sleep(5)
            
            self.logger.error("All reconnection attempts failed")
            
        except Exception as e:
            self.logger.error(f"Error in check_and_fix_connection: {e}")
    
    def get_wifi_status(self) -> dict:
        """Get detailed WiFi status information"""
        try:
            # Get WiFi interface status
            result = subprocess.run(
                ["netsh", "interface", "show", "interface"],
                capture_output=True, text=True, shell=True
            )
            
            status_info = {
                "interface_enabled": False,
                "connected": False,
                "signal_strength": None,
                "ssid": None
            }
            
            if result.returncode == 0:
                # Parse interface status
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'Wi-Fi' in line:
                        status_info["interface_enabled"] = 'Enabled' in line
                        status_info["connected"] = 'Connected' in line
                        break
            
            # Get WLAN profile information
            try:
                wlan_result = subprocess.run(
                    ["netsh", "wlan", "show", "profile"],
                    capture_output=True, text=True, shell=True
                )
                if wlan_result.returncode == 0:
                    # Additional WLAN info could be parsed here
                    pass
            except:
                pass
            
            return status_info
            
        except Exception as e:
            self.logger.error(f"Error getting WiFi status: {e}")
            return {"error": str(e)}
    
    def run_once(self):
        """Run a single check"""
        self.logger.info("Running single WiFi connectivity check...")
        status = self.get_wifi_status()
        self.logger.info(f"WiFi Status: {status}")
        self.check_and_fix_connection()
    
    def run_continuous(self):
        """Run continuous monitoring"""
        self.logger.info(f"Starting continuous WiFi monitoring (checking every {self.check_interval} seconds)")
        
        # Schedule the check
        schedule.every(self.check_interval).seconds.do(self.check_and_fix_connection)
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(1)
        except KeyboardInterrupt:
            self.logger.info("WiFi monitoring stopped by user")

def main():
    parser = argparse.ArgumentParser(description="Auto WiFi Connection Monitor")
    parser.add_argument("-H", "--host", default="8.8.8.8", 
                       help="Host to ping for connectivity test (default: 8.8.8.8)")
    parser.add_argument("-i", "--interval", type=int, default=60,
                       help="Check interval in seconds (default: 60)")
    parser.add_argument("-a", "--attempts", type=int, default=3,
                       help="Maximum reconnection attempts (default: 3)")
    parser.add_argument("-o", "--once", action="store_true",
                       help="Run once instead of continuous monitoring")
    parser.add_argument("-s", "--status", action="store_true",
                       help="Show WiFi status and exit")
    
    args = parser.parse_args()
    
    # Create monitor instance
    monitor = WiFiMonitor(args.host, args.interval, args.attempts)
    
    # Check for admin privileges
    monitor.request_admin_privileges()
    
    if args.status:
        # Just show status
        status = monitor.get_wifi_status()
        print("\nWiFi Status:")
        print("-" * 30)
        for key, value in status.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        return
    
    if args.once:
        # Run single check
        monitor.run_once()
    else:
        # Run continuous monitoring
        monitor.run_continuous()

if __name__ == "__main__":
    main()
