# Password Generator

A simple Python script that generates secure, random passwords with customizable length and character composition.

## Features

- Generates random passwords with a mix of uppercase, lowercase, numbers, and special characters
- Ensures at least one character from each type for security
- Customizable password length (minimum 4 characters)
- Multiple shuffling for enhanced randomness
- Colored terminal output for better visualization
- Detailed summary of character composition

## Usage

Run the script and specify your desired password length:

```bash
python password_generator.py
```

The script will prompt you for the password length and generate a secure password with:
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (@, #, $, %, &, ?)

## Example

```
How lengthy do you want your password to be : 12

Generate Password Summary:

Character Uppercase : 3
Character Lowercase : 4
Numbers : 2
Symbols : 3

Your computer generated password is:
Kj8#mN2$pL9@
```

## Requirements

- Python 3.x
- No external dependencies required (uses only built-in modules)

## Security Features

- Minimum length validation (4 characters)
- Guaranteed inclusion of all character types
- Multiple randomization passes
- Cryptographically secure random character selection

## Character Sets

- **Uppercase**: A-Z
- **Lowercase**: a-z  
- **Numbers**: 0-9
- **Special Characters**: @, #, $, %, &, ?

## Author

Part of the Nerva project - A curated collection of useful automation scripts.
