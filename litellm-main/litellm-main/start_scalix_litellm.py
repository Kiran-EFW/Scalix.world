#!/usr/bin/env python3
"""
Scalix LiteLLM Proxy Launcher
Starts the LiteLLM proxy server with Scalix-specific configuration
"""

import os
import sys
import subprocess
import argparse
import logging
from pathlib import Path
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ScalixLiteLLMProxy:
    """Manages the Scalix LiteLLM proxy server"""

    def __init__(self, config_dir: str = "."):
        self.config_dir = Path(config_dir)
        self.process = None
        self.config_file = self.config_dir / "litellm_proxy_config.yaml"
        self.env_file = self.config_dir / "scalix_config.env"

    def validate_environment(self) -> bool:
        """Validate that all required environment variables are set"""
        required_vars = [
            'LITELLM_MASTER_KEY',
            'GEMINI_API_KEY'
        ]

        missing_vars = []
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)

        if missing_vars:
            logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
            logger.info("Please set these variables in your .env file or environment")
            return False

        # Check for at least one API key for free tier
        free_tier_keys = ['GEMINI_API_KEY', 'DEEPSEEK_API_KEY']
        has_free_key = any(os.getenv(key) for key in free_tier_keys)

        if not has_free_key:
            logger.warning("No free tier API keys found. Free tier will not work without them.")

        return True

    def load_environment(self):
        """Load environment variables from config file"""
        if self.env_file.exists():
            load_dotenv(self.env_file)
            logger.info(f"Loaded environment from {self.env_file}")
        else:
            logger.warning(f"Environment file not found: {self.env_file}")
            logger.info("Using system environment variables")

    def validate_config(self) -> bool:
        """Validate that configuration files exist"""
        if not self.config_file.exists():
            logger.error(f"Configuration file not found: {self.config_file}")
            return False

        logger.info(f"Found configuration file: {self.config_file}")
        return True

    def start_proxy(self, port: int = 4000, host: str = "0.0.0.0") -> bool:
        """Start the LiteLLM proxy server"""
        try:
            # Set environment variables for LiteLLM
            os.environ['LITELLM_CONFIG_FILE'] = str(self.config_file)

            # Build command
            cmd = [
                sys.executable, "-m", "litellm.proxy.proxy_cli",
                "--config", str(self.config_file),
                "--port", str(port),
                "--host", host
            ]

            logger.info(f"Starting LiteLLM proxy on {host}:{port}")
            logger.info(f"Configuration: {self.config_file}")
            logger.info(f"Command: {' '.join(cmd)}")

            # Start process
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=self.config_dir
            )

            # Wait a moment for startup
            import time
            time.sleep(2)

            # Check if process is still running
            if self.process.poll() is None:
                logger.info("✅ LiteLLM proxy started successfully!")
                logger.info(f"📡 Server running on http://{host}:{port}")
                logger.info(f"🔑 Master key: {os.getenv('LITELLM_MASTER_KEY', 'NOT SET')}")
                return True
            else:
                # Process failed, get error output
                stdout, stderr = self.process.communicate()
                logger.error("❌ Failed to start LiteLLM proxy")
                if stderr:
                    logger.error(f"Error output: {stderr}")
                if stdout:
                    logger.info(f"Standard output: {stdout}")
                return False

        except Exception as e:
            logger.error(f"❌ Error starting LiteLLM proxy: {e}")
            return False

    def stop_proxy(self):
        """Stop the LiteLLM proxy server"""
        if self.process and self.process.poll() is None:
            logger.info("Stopping LiteLLM proxy...")
            self.process.terminate()

            # Wait for graceful shutdown
            try:
                self.process.wait(timeout=10)
                logger.info("✅ LiteLLM proxy stopped successfully")
            except subprocess.TimeoutExpired:
                logger.warning("Force killing LiteLLM proxy...")
                self.process.kill()
                self.process.wait()
                logger.info("✅ LiteLLM proxy force stopped")
        else:
            logger.info("No proxy process running")

    def check_health(self) -> bool:
        """Check if the proxy is healthy"""
        if not self.process or self.process.poll() is not None:
            return False

        try:
            import requests
            port = os.getenv('LITELLM_PORT', '4000')
            response = requests.get(f"http://localhost:{port}/health", timeout=5)
            return response.status_code == 200
        except:
            return False

    def show_status(self):
        """Show current status of the proxy"""
        if self.check_health():
            port = os.getenv('LITELLM_PORT', '4000')
            logger.info("✅ LiteLLM proxy is running")
            logger.info(f"📡 URL: http://localhost:{port}")
            logger.info(f"🔑 Master Key: {os.getenv('LITELLM_MASTER_KEY', 'NOT SET')}")
        else:
            logger.info("❌ LiteLLM proxy is not running")

def main():
    parser = argparse.ArgumentParser(description='Scalix LiteLLM Proxy Launcher')
    parser.add_argument('--port', type=int, default=4000, help='Port to run the proxy on')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind the proxy to')
    parser.add_argument('--config-dir', default='.', help='Directory containing config files')
    parser.add_argument('--stop', action='store_true', help='Stop the running proxy')
    parser.add_argument('--status', action='store_true', help='Check proxy status')

    args = parser.parse_args()

    # Initialize proxy manager
    proxy = ScalixLiteLLMProxy(args.config_dir)

    if args.stop:
        proxy.stop_proxy()
        return

    if args.status:
        proxy.show_status()
        return

    # Load environment and validate
    proxy.load_environment()

    if not proxy.validate_environment():
        sys.exit(1)

    if not proxy.validate_config():
        sys.exit(1)

    # Start proxy
    if proxy.start_proxy(args.port, args.host):
        logger.info("\n" + "="*50)
        logger.info("🎉 Scalix LiteLLM Proxy Started Successfully!")
        logger.info("="*50)
        logger.info("📋 Next Steps:")
        logger.info("1. Test free tier: curl -X POST http://localhost:4000/v1/completions \\")
        logger.info("   -H 'Authorization: Bearer YOUR_MASTER_KEY' \\")
        logger.info("   -H 'Content-Type: application/json' \\")
        logger.info("   -d '{\"model\": \"free-gemini-flash\", \"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}]}'")
        logger.info("2. Check health: curl http://localhost:4000/health")
        logger.info("3. View logs for detailed information")
        logger.info("="*50)

        # Keep running and show logs
        try:
            while True:
                if proxy.process:
                    # Show some output if available
                    import time
                    time.sleep(1)
                else:
                    break
        except KeyboardInterrupt:
            logger.info("Shutting down...")
            proxy.stop_proxy()
    else:
        logger.error("Failed to start LiteLLM proxy")
        sys.exit(1)

if __name__ == "__main__":
    main()
