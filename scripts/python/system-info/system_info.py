#!/usr/bin/env python3
"""
System Information Gatherer
A comprehensive Python script to collect and display system information
including hardware specs, OS details, network info, and performance metrics.
"""

import platform
import psutil
import socket
import json
import datetime
import subprocess
import sys
from pathlib import Path

class SystemInfoGatherer:
    def __init__(self):
        self.info = {}
        
    def get_system_info(self):
        """Collect basic system information"""
        self.info['system'] = {
            'hostname': socket.gethostname(),
            'platform': platform.platform(),
            'platform_release': platform.release(),
            'platform_version': platform.version(),
            'architecture': platform.machine(),
            'processor': platform.processor(),
            'python_version': platform.python_version(),
            'boot_time': datetime.datetime.fromtimestamp(psutil.boot_time()).strftime("%Y-%m-%d %H:%M:%S")
        }
        
    def get_cpu_info(self):
        """Collect CPU information"""
        self.info['cpu'] = {
            'physical_cores': psutil.cpu_count(logical=False),
            'total_cores': psutil.cpu_count(logical=True),
            'max_frequency': f"{psutil.cpu_freq().max:.2f}Mhz" if psutil.cpu_freq() else "N/A",
            'min_frequency': f"{psutil.cpu_freq().min:.2f}Mhz" if psutil.cpu_freq() else "N/A",
            'current_frequency': f"{psutil.cpu_freq().current:.2f}Mhz" if psutil.cpu_freq() else "N/A",
            'cpu_usage_per_core': [f"{percentage}%" for percentage in psutil.cpu_percent(percpu=True, interval=1)],
            'total_cpu_usage': f"{psutil.cpu_percent(interval=1)}%"
        }
        
    def get_memory_info(self):
        """Collect memory information"""
        svmem = psutil.virtual_memory()
        swap = psutil.swap_memory()
        
        self.info['memory'] = {
            'total': self.get_size(svmem.total),
            'available': self.get_size(svmem.available),
            'used': self.get_size(svmem.used),
            'percentage': f"{svmem.percent}%",
            'swap_total': self.get_size(swap.total),
            'swap_free': self.get_size(swap.free),
            'swap_used': self.get_size(swap.used),
            'swap_percentage': f"{swap.percent}%"
        }
        
    def get_disk_info(self):
        """Collect disk information"""
        self.info['disks'] = []
        partitions = psutil.disk_partitions()
        
        for partition in partitions:
            try:
                partition_usage = psutil.disk_usage(partition.mountpoint)
                self.info['disks'].append({
                    'device': partition.device,
                    'mountpoint': partition.mountpoint,
                    'file_system': partition.fstype,
                    'total_size': self.get_size(partition_usage.total),
                    'used': self.get_size(partition_usage.used),
                    'free': self.get_size(partition_usage.free),
                    'percentage': f"{(partition_usage.used / partition_usage.total) * 100:.1f}%"
                })
            except PermissionError:
                continue
                
    def get_network_info(self):
        """Collect network information"""
        self.info['network'] = {
            'hostname': socket.gethostname(),
            'ip_address': socket.gethostbyname(socket.gethostname()),
            'interfaces': []
        }
        
        # Get network interfaces
        if_addrs = psutil.net_if_addrs()
        for interface_name, interface_addresses in if_addrs.items():
            interface_info = {'name': interface_name, 'addresses': []}
            for address in interface_addresses:
                if str(address.family) == 'AddressFamily.AF_INET':
                    interface_info['addresses'].append({
                        'ip_address': address.address,
                        'netmask': address.netmask,
                        'broadcast_ip': address.broadcast
                    })
                elif str(address.family) == 'AddressFamily.AF_PACKET':
                    interface_info['mac_address'] = address.address
            
            if interface_info['addresses'] or 'mac_address' in interface_info:
                self.info['network']['interfaces'].append(interface_info)
        
        # Get network IO statistics
        net_io = psutil.net_io_counters()
        self.info['network']['stats'] = {
            'bytes_sent': self.get_size(net_io.bytes_sent),
            'bytes_received': self.get_size(net_io.bytes_recv),
            'packets_sent': net_io.packets_sent,
            'packets_received': net_io.packets_recv
        }
        
    def get_gpu_info(self):
        """Collect GPU information (basic)"""
        try:
            # Try to get NVIDIA GPU info
            result = subprocess.run(['nvidia-smi', '--query-gpu=name,memory.total,memory.used,temperature.gpu', 
                                   '--format=csv,noheader,nounits'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                gpu_lines = result.stdout.strip().split('\n')
                self.info['gpu'] = []
                for line in gpu_lines:
                    name, total_mem, used_mem, temp = line.split(', ')
                    self.info['gpu'].append({
                        'name': name,
                        'memory_total': f"{total_mem} MB",
                        'memory_used': f"{used_mem} MB",
                        'temperature': f"{temp}°C"
                    })
            else:
                self.info['gpu'] = "GPU information not available (nvidia-smi not found)"
        except (subprocess.TimeoutExpired, FileNotFoundError):
            self.info['gpu'] = "GPU information not available"
            
    def get_size(self, bytes, suffix="B"):
        """Convert bytes to human readable format"""
        factor = 1024
        for unit in ["", "K", "M", "G", "T", "P"]:
            if bytes < factor:
                return f"{bytes:.2f}{unit}{suffix}"
            bytes /= factor
            
    def collect_all_info(self):
        """Collect all system information"""
        print("🔍 Gathering system information...")
        self.get_system_info()
        print("✅ System info collected")
        
        self.get_cpu_info()
        print("✅ CPU info collected")
        
        self.get_memory_info()
        print("✅ Memory info collected")
        
        self.get_disk_info()
        print("✅ Disk info collected")
        
        self.get_network_info()
        print("✅ Network info collected")
        
        self.get_gpu_info()
        print("✅ GPU info collected")
        
    def display_info(self, format_type="table"):
        """Display collected information"""
        if format_type == "json":
            print(json.dumps(self.info, indent=2))
            return
            
        # Table format
        print("\n" + "="*80)
        print("🖥️  SYSTEM INFORMATION REPORT".center(80))
        print("="*80)
        
        # System Information
        print("\n📋 SYSTEM INFORMATION")
        print("-" * 40)
        for key, value in self.info['system'].items():
            print(f"{key.replace('_', ' ').title():<25}: {value}")
            
        # CPU Information
        print("\n🔧 CPU INFORMATION")
        print("-" * 40)
        for key, value in self.info['cpu'].items():
            if key == 'cpu_usage_per_core':
                print(f"CPU Usage Per Core       : {', '.join(value)}")
            else:
                print(f"{key.replace('_', ' ').title():<25}: {value}")
                
        # Memory Information
        print("\n💾 MEMORY INFORMATION")
        print("-" * 40)
        for key, value in self.info['memory'].items():
            print(f"{key.replace('_', ' ').title():<25}: {value}")
            
        # Disk Information
        print("\n💿 DISK INFORMATION")
        print("-" * 40)
        for i, disk in enumerate(self.info['disks']):
            print(f"\nDisk {i+1}:")
            for key, value in disk.items():
                print(f"  {key.replace('_', ' ').title():<23}: {value}")
                
        # Network Information
        print("\n🌐 NETWORK INFORMATION")
        print("-" * 40)
        print(f"Hostname                 : {self.info['network']['hostname']}")
        print(f"IP Address               : {self.info['network']['ip_address']}")
        
        print("\nNetwork Interfaces:")
        for interface in self.info['network']['interfaces']:
            print(f"\n  Interface: {interface['name']}")
            if 'mac_address' in interface:
                print(f"    MAC Address: {interface['mac_address']}")
            for addr in interface['addresses']:
                print(f"    IP: {addr['ip_address']}")
                print(f"    Netmask: {addr['netmask']}")
                if addr['broadcast_ip']:
                    print(f"    Broadcast: {addr['broadcast_ip']}")
                    
        print("\nNetwork Statistics:")
        for key, value in self.info['network']['stats'].items():
            print(f"  {key.replace('_', ' ').title():<20}: {value}")
            
        # GPU Information
        print("\n🎮 GPU INFORMATION")
        print("-" * 40)
        if isinstance(self.info['gpu'], list):
            for i, gpu in enumerate(self.info['gpu']):
                print(f"\nGPU {i+1}:")
                for key, value in gpu.items():
                    print(f"  {key.replace('_', ' ').title():<20}: {value}")
        else:
            print(self.info['gpu'])
            
        print("\n" + "="*80)
        print(f"Report generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80)
        
    def save_to_file(self, filename, format_type="json"):
        """Save information to file"""
        filepath = Path(filename)
        
        if format_type == "json":
            with open(filepath, 'w') as f:
                json.dump(self.info, f, indent=2)
        else:
            # Save as text report
            original_stdout = sys.stdout
            with open(filepath, 'w') as f:
                sys.stdout = f
                self.display_info("table")
                sys.stdout = original_stdout
                
        print(f"\n💾 Report saved to: {filepath.absolute()}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="System Information Gatherer")
    parser.add_argument('--format', '-f', choices=['table', 'json'], default='table',
                       help='Output format (default: table)')
    parser.add_argument('--output', '-o', type=str,
                       help='Save output to file')
    parser.add_argument('--quiet', '-q', action='store_true',
                       help='Quiet mode - only show final report')
    
    args = parser.parse_args()
    
    # Create gatherer instance
    gatherer = SystemInfoGatherer()
    
    # Collect information
    if not args.quiet:
        gatherer.collect_all_info()
    else:
        # Silent collection
        gatherer.get_system_info()
        gatherer.get_cpu_info()
        gatherer.get_memory_info()
        gatherer.get_disk_info()
        gatherer.get_network_info()
        gatherer.get_gpu_info()
    
    # Display or save information
    if args.output:
        gatherer.save_to_file(args.output, args.format)
        if not args.quiet:
            print(f"\n📄 Report saved to: {args.output}")
    else:
        gatherer.display_info(args.format)

if __name__ == "__main__":
    main()
