#!/bin/bash
set -e

# ─────────────────────────────────────────────
# CloudHack Academy — Script de arranque
# ─────────────────────────────────────────────

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ██████╗██╗      ██████╗ ██╗   ██╗██████╗ ██╗  ██╗ █████╗  ██████╗██╗  ██╗"
echo " ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗██║  ██║██╔══██╗██╔════╝██║ ██╔╝"
echo " ██║     ██║     ██║   ██║██║   ██║██║  ██║███████║███████║██║     █████╔╝ "
echo " ██║     ██║     ██║   ██║██║   ██║██║  ██║██╔══██║██╔══██║██║     ██╔═██╗ "
echo " ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝██║  ██║██║  ██║╚██████╗██║  ██╗"
echo "  ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${CYAN}  Academy${NC}"
echo ""

# Comprobar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker no está en ejecución. Arráncalo e inténtalo de nuevo.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker detectado${NC}"

# Exportar el path absoluto del backend (necesario para el montaje de labs)
export BACKEND_PATH="$(cd "$(dirname "$0")/backend" && pwd)"
echo -e "${GREEN}✓ Backend path: ${BACKEND_PATH}${NC}"
echo ""

# Parsear argumentos
DETACH=""
if [[ "$1" == "-d" || "$1" == "--detach" ]]; then
    DETACH="-d"
fi

# Arrancar los servicios
echo -e "${YELLOW}Construyendo e iniciando servicios...${NC}"
echo ""

docker compose up --build $DETACH

if [[ -z "$DETACH" ]]; then
    echo ""
    echo -e "${GREEN}✓ Servicios detenidos.${NC}"
else
    echo ""
    echo -e "${GREEN}✓ Servicios arrancados en segundo plano.${NC}"
    echo ""
    echo -e "  Frontend → ${CYAN}http://localhost:3000${NC}"
    echo -e "  Backend  → ${CYAN}http://localhost:5005${NC}"
    echo ""
    echo -e "  Para ver logs:   ${YELLOW}docker compose logs -f${NC}"
    echo -e "  Para detener:    ${YELLOW}docker compose down${NC}"
fi
