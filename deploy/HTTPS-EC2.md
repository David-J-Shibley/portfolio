# HTTPS on EC2 (nginx + Let’s Encrypt)

Browsers use **port 443** for `https://`. Your Node app can keep listening on **8080** on localhost; **nginx** terminates TLS and proxies to it.

## Prerequisites

- DNS **A record** for your domain pointing to the instance **public** IP (wait for propagation).
- Security group: **80** and **443** open from the internet (0.0.0.0/0 or your IP while testing).
- Node app running with `PORT=8080` and listening on `0.0.0.0` (your server already does).

## 1. Install nginx and Certbot

**Ubuntu / Debian**

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

**Amazon Linux 2023**

```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
# Certbot: follow https://certbot.eff.org/ — choose nginx and your OS
```

## 2. Configure nginx (HTTP first)

```bash
sudo mkdir -p /var/www/certbot
```

Copy `deploy/nginx/portfolio.conf` to the server, replace every `YOUR_DOMAIN` with your hostname (no `https://`), then:

```bash
sudo cp portfolio.conf /etc/nginx/sites-available/portfolio
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

On distros that use `conf.d` only, drop the file in `/etc/nginx/conf.d/portfolio.conf` instead.

Confirm **http://YOUR_DOMAIN** (port 80) proxies to your app before continuing.

## 3. Turn on HTTPS (Certbot edits nginx for you)

```bash
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

Certbot installs Let’s Encrypt certificates and adds a **443** server block (and usually redirects HTTP → HTTPS). Renewals are typically handled by a **systemd timer** or **cron**; test with:

```bash
sudo certbot renew --dry-run
```

## 4. Environment on the app

When behind nginx, set in `.env` (or your process manager):

```bash
TRUST_PROXY=1
```

So Express treats `X-Forwarded-*` correctly for logs and any proxy-aware behavior.

## 5. Visit

Open `https://YOUR_DOMAIN` (no port in the URL).

---

### Alternatives

- **Caddy**: single binary, automatic HTTPS; Caddyfile with `reverse_proxy 127.0.0.1:8080`.
- **AWS Application Load Balancer + ACM**: certificate in AWS, targets on 8080; no Certbot on the instance.
