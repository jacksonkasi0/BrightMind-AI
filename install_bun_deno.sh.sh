#!/bin/bash

# Function to print messages
print_message() {
  echo "========================================="
  echo "$1"
  echo "========================================="
}

# Install Bun
print_message "Installing Bun..."
curl -fsSL https://bun.sh/install | bash
if [ $? -eq 0 ]; then
  echo "Bun installation completed successfully!"
else
  echo "Bun installation failed. Please check your internet connection or the Bun installation URL."
  exit 1
fi

# Install Deno
print_message "Installing Deno..."
curl -fsSL https://deno.land/install.sh | bash
if [ $? -eq 0 ]; then
  echo "Deno installation completed successfully!"
else
  echo "Deno installation failed. Please check your internet connection or the Deno installation URL."
  exit 1
fi

# Post-install instructions
print_message "Post-installation steps"
echo "If Bun and Deno are not recognized, make sure the following directories are in your PATH:"
echo "- Bun: Add Bun's binary location to your PATH (e.g., ~/.bun/bin)"
echo "- Deno: Add Deno's binary location to your PATH (e.g., ~/.deno/bin)"
echo "Example:"
echo '  export PATH="$HOME/.bun/bin:$HOME/.deno/bin:$PATH"'

# Verification
print_message "Verifying installations..."
bun --version && echo "Bun is installed and ready to use!"
deno --version && echo "Deno is installed and ready to use!"
