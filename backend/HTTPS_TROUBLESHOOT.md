# HTTPS Connection Timeout Fix

## Issue: ERR_CONNECTION_TIMED_OUT on port 3443

Your HTTPS server is running locally but not accessible from the internet. This is likely a firewall issue.

## Solution 1: Open Firewall Port (Recommended)

### For Ubuntu/Debian (ufw):
```bash
# Check current firewall status
sudo ufw status

# Allow HTTPS port
sudo ufw allow 3443
sudo ufw allow 3443/tcp

# Reload firewall
sudo ufw reload

# Verify the rule was added
sudo ufw status numbered
```

### For CentOS/RHEL (firewalld):
```bash
# Check firewall status
sudo firewall-cmd --state

# Add port permanently
sudo firewall-cmd --permanent --add-port=3443/tcp
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-ports
```

### For iptables:
```bash
# Add rule to allow port 3443
sudo iptables -A INPUT -p tcp --dport 3443 -j ACCEPT

# Save rules (Ubuntu/Debian)
sudo iptables-save > /etc/iptables/rules.v4

# Or save rules (CentOS/RHEL)
sudo service iptables save
```

## Solution 2: Test Network Connectivity

```bash
# Test from your server locally
curl -k https://localhost:3443/api/health

# Test if port is listening
netstat -tlnp | grep :3443
# or
ss -tlnp | grep :3443

# Test from outside (from your local machine)
telnet 104.154.91.216 3443
# or
nc -zv 104.154.91.216 3443
```

## Solution 3: Cloud Provider Firewall

If you're using a cloud provider, check their firewall settings:

### Google Cloud Platform:
```bash
# Create firewall rule
gcloud compute firewall-rules create allow-spytech-https \
    --allow tcp:3443 \
    --description "Allow HTTPS for SpyTech backend"
```

### AWS EC2:
- Go to EC2 Console → Security Groups
- Edit inbound rules
- Add rule: Type=Custom TCP, Port=3443, Source=0.0.0.0/0

### Azure:
- Go to Virtual Machine → Networking
- Add inbound port rule for 3443

## Solution 4: Use Standard HTTPS Port 443

Change to standard HTTPS port (requires root):

```bash
# Stop current container
docker stop spytech-api
docker rm spytech-api

# Run on port 443 (requires root/sudo)
sudo docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend
```

Then update your frontend to use:
```
VITE_API_URL=https://104.154.91.216/api
```

## Solution 5: Use Nginx Reverse Proxy

Create nginx config to proxy HTTPS traffic:

```nginx
server {
    listen 443 ssl;
    server_name 104.154.91.216;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Quick Diagnostic Commands

Run these on your server to diagnose:

```bash
# 1. Check if process is listening
sudo netstat -tlnp | grep :3443

# 2. Check firewall status
sudo ufw status
# or
sudo firewall-cmd --list-all

# 3. Test local connectivity
curl -v -k https://localhost:3443/api/health

# 4. Check Docker container
docker logs spytech-api
docker exec spytech-api netstat -tln

# 5. Test from inside container
docker exec spytech-api curl -k https://localhost:3443/api/health
```

## Most Likely Fix

Based on your output, try this first:

```bash
# Open the firewall port
sudo ufw allow 3443
sudo ufw reload

# Restart container to ensure it's binding correctly
docker restart spytech-api

# Test again
curl -k https://104.154.91.216:3443/api/health
```

Then test your frontend again! 🚀
