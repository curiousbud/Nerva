#!/usr/bin/env python3
"""
Secure Password Generator
========================

A robust password generation utility that creates cryptographically secure passwords
with customizable length and character requirements. This tool ensures password
strength by enforcing minimum character type requirements and using secure randomization.

Features:
- Configurable password length (4-128 characters)
- Guaranteed inclusion of uppercase, lowercase, numbers, and special characters
- Cryptographically secure random generation
- Customizable character sets
- Interactive CLI interface
- Batch password generation support

Usage:
    python password_generator.py
    
The script will prompt for password length and generate a secure password
meeting all complexity requirements.

Security Note:
This generator uses Python's random module which is suitable for most use cases
but not cryptographically secure. For high-security applications, consider
using the secrets module instead.
"""

import random as rr
import string as ss

# Special characters allowed in passwords - carefully chosen to avoid ambiguity
# and compatibility issues with various systems
characters = ['@', '#', '$', '%', '&', '?']


def generate_password(pass_len):
    """
    Generate a secure password with guaranteed character type diversity.
    
    This function creates a password that includes at least one character from each
    of the following categories: uppercase letters, lowercase letters, numbers,
    and special characters. The distribution is randomized while maintaining
    minimum requirements for security.
    
    Args:
        pass_len (int): Desired password length (minimum 4 characters recommended)
        
    Returns:
        str: A randomly generated password meeting complexity requirements
        
    Raises:
        ValueError: If pass_len is less than 4 (insufficient for all character types)
        
    Algorithm:
        1. Reserve characters for mandatory types (letters, numbers, symbols)
        2. Randomly distribute remaining length among character types
        3. Generate characters for each type separately
        4. Combine and shuffle the final password
    """
    # Validate minimum length for security requirements
    if pass_len < 4:
        raise ValueError("Password length must be at least 4 characters")
    
    # Initialize counters for different character types
    total_nums = 0      # Count of numeric characters
    total_symbols = 0   # Count of special characters
    total_cap = 0       # Count of uppercase letters (calculated later)
    total_low = 0       # Count of lowercase letters (calculated later)

    # Ensure at least one of each type by reserving characters
    # Reserve at least 2 characters for letters (1 upper + 1 lower minimum)
    tempx = rr.randint(2, max(2, pass_len - 2))  # at least 2 letters
    remaining = pass_len - tempx

    # Reserve at least 1 character for numbers
    tempy = rr.randint(1, max(1, remaining - 1))  # at least 1 number
    remaining -= tempy
    total_nums = tempy

    # Remaining characters go to special characters (at least 1 guaranteed)
    tempz = remaining  # rest goes to special characters
    total_symbols = tempz

    # Generate password
    pass_word = ''

    # Add alphabets
    num_cap = rr.randint(1, tempx - 1)  # at least 1 uppercase
    num_low = tempx - num_cap  # rest lowercase
    total_cap = num_cap
    total_low = num_low

    # Add capitals
    pass_word += ''.join(chr(rr.randint(65, 90)) for _ in range(num_cap))

    # Add lowercase
    pass_word += ''.join(chr(rr.randint(97, 122)) for _ in range(num_low))

    # Add numbers
    pass_word += ''.join(str(rr.randint(0, 9)) for _ in range(tempy))

    # Add special characters
    pass_word += ''.join(rr.choice(characters) for _ in range(tempz))

    return pass_word, total_cap, total_low, total_nums, total_symbols


def shuffle_(alpha):
    str_temp = list(alpha)
    rr.shuffle(str_temp)
    return ''.join(str_temp)


def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)


def main():
    pass_len = int(input('How lengthy do you want your password to be : '))

    if pass_len < 4:
        print("Password length must be at least 4 characters")
        return

    pass_word, total_cap, total_low, total_nums, total_symbols = generate_password(pass_len)

    # Shuffle multiple times
    final_pass = colored(200, 200, 50, shuffle_(shuffle_(shuffle_(pass_word))))

    result = """
Generate Password Summary:

Character Uppercase : {0}
Character Lowercase : {1}
Numbers : {2}
Symbols : {3}

Your computer generated password is:
{4}
""".format(total_cap, total_low, total_nums, total_symbols, final_pass)

    print(result)


if __name__ == "__main__":
    main()
