#!/usr/bin/env bash

set -e

SCRIPT_URL="https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/main/squidward.sh"
COMPOSE_FILE_URL="https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/main/docker-compose.yml"
SCRIPT_NAME="squidward"
SCRIPT_PATH=$(realpath "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
AUTOCOMPLETE_FILE="/etc/bash_completion.d/$SCRIPT_NAME"

ACTION="$1"

# === Logging === #

log_start() {
    echo -e "\033[94m◐ \033[0m$1"
}

log_success() {
    echo -e "\033[92m✔ \033[0m$1"
}

log() {
    echo -e "\033[37mℹ \033[0m$1"
}

log_error() {
    echo -e "\033[101;97m ERROR \033[0;31m $1\033[0m"
}

# === Commands === #

fatal_error() {
   log_error "$1"
   exit 1
}

do_help() {
  log "Available commands [upgrade|stop|start|restart|autocomplete]"
}

do_upgrade_shell() {
  log "Checking for updates..."
  local TMP_FILE
  TMP_FILE="$(mktemp)"

  if ! curl -fsSL "$SCRIPT_URL" -o "$TMP_FILE" -H "Cache-Control: no-cache"; then
    log_error "Failed to download update."
    rm -f "$TMP_FILE"
    return
  fi

  if ! cmp -s "$SCRIPT_PATH" "$TMP_FILE"; then
      log_start "New script version found. Updating..."
      chmod +x "$TMP_FILE"
      mv "$TMP_FILE" "$SCRIPT_PATH"
      log "Restarting script..."
      exec "$SCRIPT_PATH" "$@"
  else
      log "Script is up to date."
      rm "$TMP_FILE"
  fi
}

# shellcheck disable=SC2120
do_upgrade() {
  do_upgrade_shell "$@"

  cd "$SCRIPT_DIR" || fatal_error "Failed to change directory [$SCRIPT_DIR]"

  log "Get docker-compose.yml"
  curl -fsSL "$COMPOSE_FILE_URL" -o "$SCRIPT_DIR"/docker-compose.yml -H "Cache-Control: no-cache"

  docker compose pull
  log_success "Updates has been pulled."

  log_start "Restarting squidward..."
  docker compose down && docker compose up -d && docker compose logs -f

  log_success "Completed."
}

do_autocomplete() {
    log_start "Updating autocompletion..."

    if [[ ! -f "/usr/local/bin/$SCRIPT_NAME" ]]; then
      sudo ln -s "$SCRIPT_PATH" /usr/local/bin/$SCRIPT_NAME
    fi
    sudo bash -c "cat > '$AUTOCOMPLETE_FILE'" <<EOF
# Автодополнение для $SCRIPT_NAME
_${SCRIPT_NAME}_completion() {
    local cur opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    opts="upgrade stop start restart autocomplete"

    COMPREPLY=( \$(compgen -W "\$opts" -- "\$cur") )
    return 0
}
complete -F _${SCRIPT_NAME}_completion $SCRIPT_NAME
EOF
      log_success "Updating success.\n"
      log "Restart the terminal or run 'source /etc/bash_completion'."
}

# === Main === #

if [[ -z "$ACTION" ]]; then
    do_help
    exit 1
fi

case "$ACTION" in
  upgrade ) do_upgrade "$@";;
  autocomplete ) do_autocomplete;;
  -h|--help ) do_help;;
  * ) do_help;;
esac
