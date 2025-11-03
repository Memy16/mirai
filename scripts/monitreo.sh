#!/bin/bash
# Script de monitoreo del servidor

#Colores
azul_oscuro='\e[38;5;18m'
amarillo_oscuro='\e[38;5;136m'
azul='\e[38;5;68m'
negro='\e[38;5;232m'
verde='\e[32m'
rojo='\e[31m'
nc='\e[0m'
# Ruta donde se guardan los logs
LOG_DIR="/home/mirai.klasso/mirai/logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/monitoreo_$(date +'%d-%m-%Y').log"

{
    echo -e "${amarillo_oscuro}============================================${nc}"
    echo -e "${azul_oscuro}Fecha: $(date '+%d-%m-%Y %H:%M:%S')${nc}"
    echo -e "${amarillo_oscuro}============================================${nc}"
    
    # CPU
    CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4"% usado"}')
    echo -e "${azul}Uso de CPU:${negro} $CPU ${nc}"
    
    # RAM
    RAM=$(free -h | awk '/Mem/ {print $3 " usados de " $2}')
    echo -e "${azul}Uso de RAM:${negro} $RAM ${nc}"
    
    # DISCO
    DISCO=$(df -h / | awk 'NR==2 {print $3 " usados de " $2 " (" $5 " ocupado)"}')
    echo -e "${azul}Espacio en disco:${negro} $DISCO ${nc}"
    
    # SERVICIOS
    echo -e "${azul}Estado de servicios:${nc}"
    for service in apache2 mysql ssh; do
        if systemctl is-active --quiet $service; then
            echo -e "${verde}$service: activo ${nc}"
        else
            echo -e "${rojo}$service: inactivo ${nc}"
        fi
    done
    
    echo ""
} >> "$LOG_FILE"
