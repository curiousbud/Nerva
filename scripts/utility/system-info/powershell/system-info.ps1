<#
.SYNOPSIS
    Display key system information (OS, CPU, memory, disks).

.PARAMETER Json
    Emit the information as JSON instead of a formatted report.

.EXAMPLE
    ./system-info.ps1
#>
param([switch]$Json)

function ConvertTo-GB { param([double]$Bytes) [math]::Round($Bytes / 1GB, 2) }

$os  = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1

$info = [ordered]@{
    Hostname        = $env:COMPUTERNAME
    OS              = $os.Caption
    Version         = $os.Version
    Architecture    = $os.OSArchitecture
    CPU             = $cpu.Name.Trim()
    Cores           = $cpu.NumberOfCores
    LogicalCPUs     = $cpu.NumberOfLogicalProcessors
    TotalMemoryGB   = ConvertTo-GB ($os.TotalVisibleMemorySize * 1KB)
    FreeMemoryGB    = ConvertTo-GB ($os.FreePhysicalMemory * 1KB)
    Disks           = Get-CimInstance Win32_LogicalDisk -Filter "DriveType = 3" | ForEach-Object {
        [ordered]@{
            Drive      = $_.DeviceID
            SizeGB     = ConvertTo-GB $_.Size
            FreeGB     = ConvertTo-GB $_.FreeSpace
        }
    }
}

if ($Json) {
    $info | ConvertTo-Json -Depth 4
}
else {
    Write-Host "=== System Information ===" -ForegroundColor Cyan
    foreach ($key in $info.Keys) {
        if ($key -eq 'Disks') { continue }
        '{0,-16}: {1}' -f $key, $info[$key]
    }
    Write-Host "`nDisks:" -ForegroundColor Cyan
    foreach ($disk in $info.Disks) {
        '  {0} {1} GB total, {2} GB free' -f $disk.Drive, $disk.SizeGB, $disk.FreeGB
    }
}
