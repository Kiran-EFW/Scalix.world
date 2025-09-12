# 🚀 Scalix LiteLLM Integration

## Overview

This integration provides a unified AI infrastructure for Scalix that supports both **free tier** and **pro tier** users through LiteLLM. The system intelligently routes requests to appropriate models based on user tier, handles rate limiting, tracks usage, and provides seamless scaling.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Scalix App    │────│   LiteLLM Proxy   │────│  AI Providers   │
│  (User's PC)    │    │                  │    │                 │
│                 │    │ - Free Tier:     │    │ - Gemini Flash  │
│ - Free Users    │    │   50 req/day     │    │ - Gemini Pro    │
│ - Pro Users     │    │ - Pro Tier:      │    │ - DeepSeek      │
│ - API Keys      │    │   Unlimited      │    │ - Scalix Engine │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install LiteLLM
pip install litellm

# Install additional dependencies
pip install python-dotenv requests redis
```

### 2. Set Up Environment

Create a `.env` file (or use `scalix_config.env`):

```bash
# LiteLLM Configuration
LITELLM_MASTER_KEY=sk-scalix-dev-123456789
LITELLM_HOST=0.0.0.0
LITELLM_PORT=4000

# Free Tier API Keys (get from respective providers)
GEMINI_API_KEY=your_gemini_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Pro Tier Configuration
SCALIX_PRO_API_KEY=scalix_dev_key_123
SCALIX_ENGINE_URL=https://engine.scalix.world/v1
SCALIX_GATEWAY_URL=https://llm-gateway.scalix.world/v1

# Database & Caching
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start the Proxy

```bash
# Start LiteLLM proxy with Scalix configuration
python start_scalix_litellm.py

# Or with custom options
python start_scalix_litellm.py --port 4001 --host 127.0.0.1
```

### 4. Test the Setup

```bash
# Test free tier
python test_scalix_litellm.py --test free

# Test pro tier
python test_scalix_litellm.py --test pro

# Run all tests
python test_scalix_litellm.py --test all
```

---

## 📋 Configuration Files

### 1. LiteLLM Proxy Configuration (`litellm_proxy_config.yaml`)

This file defines all available models and their configurations:

```yaml
model_list:
  # Free Tier Models (No API Key Required)
  - model_name: free-gemini-flash
    litellm_params:
      model: gemini/gemini-2.5-flash
      api_key: ${GEMINI_API_KEY}
      metadata:
        tier: free
        priority: 1

  - model_name: free-deepseek-chat
    litellm_params:
      model: openrouter/deepseek/deepseek-chat-v3-0324:free
      api_key: ${DEEPSEEK_API_KEY}
      metadata:
        tier: free
        priority: 3

  # Pro Tier Models (Scalix Engine/Gateway)
  - model_name: scalix-engine
    litellm_params:
      model: openai-compatible/scalix-engine
      api_key: ${SCALIX_PRO_API_KEY}
      base_url: ${SCALIX_ENGINE_URL}
      metadata:
        tier: pro
        features: ["lazy_edits", "smart_context"]

  # Premium Models (Paid APIs)
  - model_name: gpt-4
    litellm_params:
      model: gpt-4
      api_key: ${OPENAI_API_KEY}
      metadata:
        tier: premium
```

### 2. Environment Configuration (`scalix_config.env`)

Contains all environment variables and API keys:

```bash
# Server Configuration
LITELLM_MASTER_KEY=sk-scalix-dev-123456789
LITELLM_PORT=4000

# Free Tier Providers
GEMINI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here

# Pro Tier Providers
SCALIX_PRO_API_KEY=scalix_key_here
SCALIX_ENGINE_URL=https://engine.scalix.world/v1

# Infrastructure
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Custom Callbacks (`scalix_callbacks.py`)

Handles Scalix-specific functionality:

- **Usage Tracking**: Monitors free/pro tier usage
- **Cost Calculation**: Tracks costs for billing
- **Error Handling**: Manages provider failures
- **Rate Limiting**: Enforces tier limits

---

## 🔑 User Tiers & Limits

### Free Tier
- **Requests/Day**: 50
- **Requests/Hour**: 10
- **Tokens/Day**: 10,000
- **Models**: Gemini Flash, Gemini Pro, DeepSeek, WizardLM
- **Cost**: $0 (ads/subscription supported)

### Pro Tier
- **Requests/Day**: Unlimited
- **Requests/Hour**: 100
- **Tokens/Day**: 100,000
- **Models**: All free models + Scalix Engine/Gateway
- **Features**: Lazy edits, smart context, advanced reasoning
- **Cost**: Subscription-based

### Premium Tier
- **Requests**: Unlimited
- **Models**: GPT-4, Claude 3, Gemini Pro (paid versions)
- **Features**: Latest models, priority processing
- **Cost**: Pay-per-use

---

## 🔧 API Usage Examples

### Free Tier Request

```bash
curl -X POST http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "free-gemini-flash",
    "messages": [
      {"role": "user", "content": "Create a React button component"}
    ],
    "max_tokens": 200,
    "user": "free_user_123"
  }'
```

### Pro Tier Request

```bash
curl -X POST http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "scalix-engine",
    "messages": [
      {"role": "user", "content": "Create a React component with TypeScript"}
    ],
    "max_tokens": 500,
    "user": "pro_user_456",
    "scalix_options": {
      "enable_lazy_edits": true,
      "enable_smart_context": true
    }
  }'
```

### Virtual Key Generation (For User Management)

```bash
curl -X POST http://localhost:4000/key/generate \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "max_budget": 10.0,
    "models": ["free-gemini-flash", "scalix-gateway"],
    "duration": "24h"
  }'
```

---

## 📊 Monitoring & Analytics

### Built-in Metrics

The integration provides comprehensive monitoring:

#### Usage Tracking
```python
# Track user usage by tier
usage_tracker.track_usage(user_id, model, usage, metadata)

# Get user statistics
stats = usage_tracker.get_user_usage(user_id)
print(f"Requests today: {stats['requests_today']}")
print(f"Tokens used: {stats['tokens_today']}")
```

#### Cost Monitoring
```python
# Calculate costs automatically
cost = cost_calculator.calculate_cost(model, usage)
cost_calculator.track_cost(user_id, model, cost)
```

#### Error Handling
```python
# Automatic error categorization and handling
error_handler.handle_error(user_id, model, error, metadata)
```

### Health Checks

```bash
# Check proxy health
curl http://localhost:4000/health

# Check specific model availability
curl http://localhost:4000/v1/models
```

### Logs & Debugging

```bash
# View application logs
tail -f logs/litellm.log

# Run diagnostic tests
python test_scalix_litellm.py --test all
```

---

## 🔧 Management Commands

### Starting & Stopping

```bash
# Start proxy
python start_scalix_litellm.py

# Start on specific port
python start_scalix_litellm.py --port 4001

# Check status
python start_scalix_litellm.py --status

# Stop proxy
python start_scalix_litellm.py --stop
```

### Testing

```bash
# Test all functionality
python test_scalix_litellm.py --test all

# Test specific features
python test_scalix_litellm.py --test free
python test_scalix_litellm.py --test pro
python test_scalix_litellm.py --test rate-limit
```

### Configuration Management

```bash
# Validate configuration
python -c "import yaml; yaml.safe_load(open('litellm_proxy_config.yaml'))"

# Reload configuration (requires restart)
python start_scalix_litellm.py --stop
python start_scalix_litellm.py
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Proxy Won't Start
```bash
# Check if port is available
netstat -an | grep :4000

# Check environment variables
python -c "import os; print(os.getenv('LITELLM_MASTER_KEY'))"

# Check configuration file
python -c "import yaml; print(yaml.safe_load(open('litellm_proxy_config.yaml')))"
```

#### 2. API Key Issues
```bash
# Test API key validity
curl -H "Authorization: Bearer YOUR_KEY" http://localhost:4000/v1/models

# Check key format
python -c "import os; key=os.getenv('GEMINI_API_KEY'); print(f'Key starts with AIza: {key.startswith(\"AIza\")}')")
```

#### 3. Rate Limiting Problems
```bash
# Check Redis connection
python -c "import redis; r=redis.Redis(); print(r.ping())"

# Clear rate limit data (for testing)
python -c "import redis; r=redis.Redis(); r.flushall()"
```

#### 4. Model Availability Issues
```bash
# Test model directly
curl -X POST http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"model": "free-gemini-flash", "messages": [{"role": "user", "content": "test"}]}'

# Check model list
curl -H "Authorization: Bearer YOUR_KEY" http://localhost:4000/v1/models
```

### Debug Mode

Enable detailed logging for troubleshooting:

```python
# In scalix_config.env
DEBUG_MODE=true
LITELLM_LOG_LEVEL=DEBUG
LITELLM_LOG_FILE=./logs/debug.log
```

---

## 📈 Scaling & Performance

### Vertical Scaling

```yaml
# For higher load, increase resources
environment:
  - LITELLM_MAX_WORKERS=4
  - GUNICORN_WORKERS=8
  - GUNICORN_THREADS=4
```

### Horizontal Scaling

```yaml
# Multiple proxy instances behind load balancer
services:
  litellm-proxy-1:
    ports: ["4000:4000"]
  litellm-proxy-2:
    ports: ["4001:4000"]
  litellm-proxy-3:
    ports: ["4002:4000"]

  load-balancer:
    ports: ["80:80"]
    # Routes to proxy instances
```

### Caching Optimization

```python
# Redis caching configuration
CACHE_CONFIG = {
    'user_limits': {'ttl': 300},      # 5 minutes
    'model_responses': {'ttl': 3600}, # 1 hour
    'api_keys': {'ttl': 7200},        # 2 hours
    'rate_limits': {'ttl': 60}        # 1 minute
}
```

---

## 🔐 Security Considerations

### API Key Management
- ✅ Keys encrypted in transit and at rest
- ✅ Regular key rotation
- ✅ Audit logging for key usage
- ✅ Revocation capabilities

### User Authentication
- ✅ JWT tokens for session management
- ✅ Anonymous user support for free tier
- ✅ User activity monitoring
- ✅ Suspicious activity detection

### Network Security
- ✅ TLS 1.3 encryption
- ✅ Rate limiting protection
- ✅ IP-based filtering
- ✅ DDoS protection

### Data Privacy
- ✅ Minimal data collection
- ✅ User consent management
- ✅ Data retention policies
- ✅ GDPR compliance

---

## 📚 Advanced Configuration

### Custom Model Routing

```python
# Custom routing logic
def custom_router(user_id, model, messages):
    # Route based on user tier
    user_tier = get_user_tier(user_id)

    if user_tier == 'free':
        return route_free_tier(model, messages)
    elif user_tier == 'pro':
        return route_pro_tier(model, messages)
    else:
        return route_premium_tier(model, messages)
```

### Fallback Strategies

```python
# Multi-level fallback system
FALLBACK_CHAIN = {
    'gpt-4': ['claude-3-opus', 'gemini-pro', 'free-gemini-flash'],
    'claude-3-opus': ['gpt-4', 'gemini-pro', 'free-deepseek-chat'],
    'free-gemini-flash': ['free-gemini-pro', 'free-deepseek-chat']
}
```

### Load Balancing

```python
# Intelligent load distribution
LOAD_BALANCER = {
    'algorithm': 'weighted_round_robin',
    'weights': {
        'gpu-instance-1': 3,  # Faster GPU
        'gpu-instance-2': 2,  # Standard GPU
        'cpu-instance-1': 1   # Fallback CPU
    }
}
```

---

## 🎯 Best Practices

### Development
- ✅ Use environment-specific configurations
- ✅ Implement comprehensive logging
- ✅ Write automated tests
- ✅ Use feature flags for gradual rollout

### Production
- ✅ Enable monitoring and alerting
- ✅ Set up automated backups
- ✅ Implement rate limiting
- ✅ Use health checks and auto-healing

### Maintenance
- ✅ Regular security updates
- ✅ Monitor API key expiration
- ✅ Update model configurations
- ✅ Review and optimize costs

---

## 📞 Support & Resources

### Getting Help

1. **Check Logs**: `tail -f logs/litellm.log`
2. **Run Tests**: `python test_scalix_litellm.py --test all`
3. **Health Check**: `curl http://localhost:4000/health`
4. **Documentation**: Check this README and LiteLLM docs

### Useful Commands

```bash
# Quick health check
curl http://localhost:4000/health

# List all models
curl -H "Authorization: Bearer YOUR_KEY" http://localhost:4000/v1/models

# Test free tier
python test_scalix_litellm.py --test free

# Test pro tier
python test_scalix_litellm.py --test pro

# View usage stats
python -c "from scalix_callbacks import usage_tracker; print(usage_tracker.get_user_usage('test_user'))"
```

---

## 🚀 Next Steps

### Immediate Actions
1. **Set up environment** with API keys
2. **Start proxy server** with test configuration
3. **Run integration tests** to verify functionality
4. **Configure monitoring** and alerting

### Short-term Goals (1-2 weeks)
1. **Fine-tune rate limits** based on usage patterns
2. **Optimize model selection** for best performance
3. **Implement user feedback** collection
4. **Set up production infrastructure**

### Long-term Vision (1-3 months)
1. **Advanced analytics** and reporting
2. **A/B testing** for model optimization
3. **Auto-scaling** based on demand
4. **Multi-region deployment** for global users

---

**🎉 Congratulations! You now have a production-ready AI infrastructure that can scale from free tier users to enterprise Pro customers. The unified LiteLLM approach ensures consistent performance, reliable scaling, and seamless user experience across all tiers.**

**Ready to start? Run `python start_scalix_litellm.py` and begin serving AI requests!** 🚀
