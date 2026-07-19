#!/usr/bin/env bash
set -euo pipefail

# voracode Korean IME Fix Installer
# https://github.com/mysterious75/voracode/issues/14371
#
# Patches voracode to prevent Korean (and other CJK) IME last character
# truncation when pressing Enter in Kitty and other terminals.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/claudianus/voracode/fix-zhipuai-coding-plan-thinking/patches/install-korean-ime-fix.sh | bash
#   # or from a cloned repo:
#   ./patches/install-korean-ime-fix.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[38;5;214m'
MUTED='\033[0;2m'
NC='\033[0m'

VORACODE_DIR="${VORACODE_DIR:-$HOME/.voracode}"
VORACODE_SRC="${VORACODE_SRC:-$HOME/.voracode-src}"
FORK_REPO="${FORK_REPO:-https://github.com/claudianus/voracode.git}"
FORK_BRANCH="${FORK_BRANCH:-fix-zhipuai-coding-plan-thinking}"

info()  { echo -e "${MUTED}$*${NC}"; }
warn()  { echo -e "${ORANGE}$*${NC}"; }
err()   { echo -e "${RED}$*${NC}" >&2; }
ok()    { echo -e "${GREEN}$*${NC}"; }

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Error: $1 is required but not installed."
    exit 1
  fi
}

need git
need bun

# â”€â”€ 1. Clone or update fork â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if [ -d "$VORACODE_SRC/.git" ]; then
  info "Updating existing source at $VORACODE_SRC ..."
  git -C "$VORACODE_SRC" fetch origin "$FORK_BRANCH"
  git -C "$VORACODE_SRC" checkout "$FORK_BRANCH"
  git -C "$VORACODE_SRC" reset --hard "origin/$FORK_BRANCH"
else
  info "Cloning fork (shallow) to $VORACODE_SRC ..."
  git clone --depth 1 --branch "$FORK_BRANCH" "$FORK_REPO" "$VORACODE_SRC"
fi

# â”€â”€ 2. Verify the IME fix is present in source â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
PROMPT_FILE="$VORACODE_SRC/packages/voracode/src/cli/cmd/tui/component/prompt/index.tsx"
if [ ! -f "$PROMPT_FILE" ]; then
  err "Prompt file not found: $PROMPT_FILE"
  exit 1
fi

if grep -q "setTimeout(() => setTimeout" "$PROMPT_FILE"; then
  ok "IME fix already present in source."
else
  warn "IME fix not found. Applying patch ..."
  # Apply the fix: replace onSubmit={submit} with double-deferred version
  sed -i 's|onSubmit={submit}|onSubmit={() => {\n                // IME: double-defer so the last composed character (e.g. Korean\n                // hangul) is flushed to plainText before we read it for submission.\n                setTimeout(() => setTimeout(() => submit(), 0), 0)\n              }}|' "$PROMPT_FILE"
  if grep -q "setTimeout(() => setTimeout" "$PROMPT_FILE"; then
    ok "Patch applied."
  else
    err "Failed to apply patch. The source may have changed."
    exit 1
  fi
fi

# â”€â”€ 3. Install dependencies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
info "Installing dependencies (this may take a minute) ..."
cd "$VORACODE_SRC"
bun install --frozen-lockfile 2>/dev/null || bun install

# â”€â”€ 4. Build (current platform only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
info "Building voracode for current platform ..."
cd "$VORACODE_SRC/packages/voracode"
bun run build --single

# â”€â”€ 5. Install binary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
mkdir -p "$VORACODE_DIR/bin"

PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
[ "$ARCH" = "aarch64" ] && ARCH="arm64"
[ "$ARCH" = "x86_64" ] && ARCH="x64"
[ "$PLATFORM" = "darwin" ] && true
[ "$PLATFORM" = "linux" ] && true

BUILT_BINARY="$VORACODE_SRC/packages/voracode/dist/voracode-${PLATFORM}-${ARCH}/bin/voracode"

if [ ! -f "$BUILT_BINARY" ]; then
  BUILT_BINARY=$(find "$VORACODE_SRC/packages/voracode/dist" -name "voracode" -type f -executable 2>/dev/null | head -1)
fi

if [ -f "$BUILT_BINARY" ]; then
  if [ -f "$VORACODE_DIR/bin/voracode" ]; then
    cp "$VORACODE_DIR/bin/voracode" "$VORACODE_DIR/bin/voracode.bak.$(date +%Y%m%d%H%M%S)"
  fi
  cp "$BUILT_BINARY" "$VORACODE_DIR/bin/voracode"
  chmod +x "$VORACODE_DIR/bin/voracode"
  ok "Installed to $VORACODE_DIR/bin/voracode"
else
  err "Build failed - binary not found in dist/"
  info "Try running manually:"
  echo "  cd $VORACODE_SRC/packages/voracode && bun run build --single"
  exit 1
fi

echo ""
ok "Done! Korean IME fix is now active."
echo ""
info "To uninstall and revert to the official release:"
echo "  curl -fsSL https://voracode.ai/install | bash"
echo ""
info "To update (re-pull and rebuild):"
echo "  $0"
