<#
.SYNOPSIS
    Generate strong, random passwords.

.DESCRIPTION
    Builds passwords from letters, digits and symbols. Length and count are
    configurable, and the first password can optionally be copied to the
    clipboard.

.PARAMETER Length
    Number of characters per password (default: 16).

.PARAMETER Count
    Number of passwords to generate (default: 1).

.PARAMETER Clip
    Copy the first generated password to the clipboard.

.EXAMPLE
    ./password-generator.ps1 -Length 24 -Count 3
#>
param(
    [ValidateRange(1, 4096)][int]$Length = 16,
    [ValidateRange(1, 1000)][int]$Count = 1,
    [switch]$Clip
)

$charset = (
    (65..90)  + # A-Z
    (97..122) + # a-z
    (48..57)  + # 0-9
    (33..47)    # symbols ! " # $ % & ' ( ) * + , - . /
) | ForEach-Object { [char]$_ }

$passwords = for ($i = 0; $i -lt $Count; $i++) {
    -join (1..$Length | ForEach-Object { $charset | Get-Random })
}

$passwords

if ($Clip -and $passwords) {
    ($passwords | Select-Object -First 1) | Set-Clipboard
    Write-Host "First password copied to clipboard." -ForegroundColor Green
}
