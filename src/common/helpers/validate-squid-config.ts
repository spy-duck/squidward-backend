import { exec } from "node:child_process";
console.log(JSON.stringify({
    config: `
# Базовые настройки
http_port 3128
# https_port 3129 \\
#    tls-cert=/etc/squid/certs/squid.pem \\
#    options=NO_SSLv3:NO_TLSv1 \\
#    cipher=ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384

# ACL для доступа
acl localnet src 0.0.0.1-0.255.255.255\t# RFC 1122 "this" network (LAN)
acl localnet src 10.0.0.0/8\t\t# RFC 1918 local private network (LAN)
acl localnet src 100.64.0.0/10\t\t# RFC 6598 shared address space (CGN)
acl localnet src 169.254.0.0/16 \t# RFC 3927 link-local (directly plugged) machines
acl localnet src 172.16.0.0/12\t\t# RFC 1918 local private network (LAN)
acl localnet src 192.168.0.0/16\t\t# RFC 1918 local private network (LAN)
acl localnet src fc00::/7       \t# RFC 4193 local private network range
acl localnet src fe80::/10      \t# RFC 4291 link-local (directly plugged) machines
acl SSL_ports port 443
acl SSL_ports port 3129
acl Safe_ports port 80\t\t# http
acl Safe_ports port 21\t\t# ftp
acl Safe_ports port 443\t\t# https
acl Safe_ports port 70\t\t# gopher
acl Safe_ports port 210\t\t# wais
acl Safe_ports port 1025-65535\t# unregistered ports
acl Safe_ports port 280\t\t# http-mgmt
acl Safe_ports port 488\t\t# gss-http
acl Safe_ports port 591\t\t# filemaker
acl Safe_ports port 777\t\t# multiling http
acl CONNECT method CONNECT
# acl hasRequest has request # ???
# access_log daemon:/var/log/squid/access.log hasRequest


# Block torrent files
acl TorrentFiles rep_mime_type -i mime-type application/x-bittorrent
http_reply_access deny TorrentFiles
deny_info TCP_RESET TorrentFiles

# acl localnet src 5.139.228.0/10\t\t# RFC 6598 shared address space (CGN)
# acl localnet src 83.239.57.0/10\t\t# RFC 6598 shared address space (CGN)

# Определение ACL для авторизации
auth_param basic program /etc/squid/squid-auth-connector.js
auth_param basic children 5 startup=5 idle=1
auth_param basic realm spy-duck-proxy
auth_param basic credentialsttl 1 minutes

# Определение ACL, который требует авторизацию
acl authenticated proxy_auth REQUIRED

# Разрешить доступ для авторизованных пользователей
http_access allow authenticated

# Speed limit
delay_pools 1
delay_class 1 4
delay_access 1 allow authenticated
delay_parameters 1 -1/-1 -1/-1 -1/-1 6250000/6250000

# Connections limit
# acl limitcon maxconn 500
# http_access deny limitcon

# Правила доступа
http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access allow localhost manager
http_access deny manager
http_access allow localhost
http_access allow localnet
http_access deny all

# Кеширование
cache_dir ufs /var/spool/squid 100 16 256
coredump_dir /var/spool/squid
cache_mem 2048 MB
cache_effective_user squid

# # Дополнительные настройки
refresh_pattern ^ftp:           1440    20%     10080
refresh_pattern ^gopher:        1440    0%      1440
refresh_pattern -i (/cgi-bin/|\\?) 0     0%      0
refresh_pattern .               0       20%     4320

# Логирование
access_log daemon:/var/log/squid/access.log squid
`
}, null, 2));
export async function validateSquidConfig(configPath: string): Promise<{
    isValid: boolean;
    errors?: string;
}> {
    return new Promise((resolve) => {
        exec(`squid -f ${configPath} -k parse`, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    isValid: false,
                    errors: stderr,
                });
            } else {
                resolve({
                    isValid: true,
                });
            }
        });
    });
}