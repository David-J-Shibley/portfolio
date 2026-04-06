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

## Certificate saved but “Could not install certificate”

Certbot issued the cert but **no nginx `server` block** had a matching `server_name`. The name in nginx must **exactly match** what you passed to `-d` (e.g. `shibleyrecords.com`, not `YOUR_DOMAIN` or a different subdomain).

**Fix**

1. Edit your site config (path varies):

   ```bash
   sudo nano /etc/nginx/conf.d/portfolio.conf
   # or: /etc/nginx/sites-available/portfolio
   ```

2. Set **`server_name`** to the same hostname you certified, for example:

   ```nginx
   server_name shibleyrecords.com www.shibleyrecords.com;
   ```

   (Omit `www` if you did not request it in Certbot.)

3. Test and reload:

   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

4. Let Certbot wire TLS into that block:

   ```bash
   sudo certbot install --cert-name shibleyrecords.com
   ```

**Manual HTTPS block** (if `certbot install` still fails): add a second `server` listening on **443** with the same `proxy_pass` as port 80, and:

```nginx
listen 443 ssl;
listen [::]:443 ssl;
ssl_certificate     /etc/letsencrypt/live/shibleyrecords.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/shibleyrecords.com/privkey.pem;
include /etc/letsencrypt/options-ssl-nginx.conf;
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
```

If `ssl-dhparams.pem` is missing, run `sudo certbot renew --dry-run` once (Certbot often creates it) or comment out the `ssl_dhparam` line temporarily. Then add on the **port 80** `server` a redirect to HTTPS, keeping `location /.well-known/acme-challenge/` **before** the redirect so renewals work.

---

### Alternatives

- **Docker**: use **`docker-compose.https.yml`** in this repo — a **Caddy** container terminates TLS and proxies to the **`web`** service (Let’s Encrypt when `CADDY_DOMAIN` is a public hostname). Do not run host nginx on 80/443 at the same time.
- **Caddy on the host**: same idea as Docker, `reverse_proxy 127.0.0.1:8080`.
- **AWS Application Load Balancer + ACM**: certificate in AWS, targets on 8080; no Certbot on the instance.
