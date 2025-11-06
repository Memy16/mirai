#!/bin/bash

# ==== CONFIG DB ====
DB_HOST="localhost"
DB_USER="mirai_klasso"
DB_PASS="los18miraiyco"
DB_NAME="db_mirai.klasso"

# ==== FUNCION VALIDAR CI ====
validar_ci() {
    ci="$1"
    ci="${ci//[^0-9]/}"

    if [ ${#ci} -ne 8 ]; then return 1; fi

    base=${ci:0:7}
    dv=${ci:7}
    pesos=(2 9 8 7 6 3 4)
    suma=0

    for ((i=0;i<7;i++)); do
        dig=${base:$i:1}
        suma=$(( suma + dig * pesos[$i] ))
    done

    resto=$(( suma % 10 ))
    calc=$(( 10 - resto ))
    if [ $calc -eq 10 ]; then calc=0; fi

    [[ "$calc" -eq "$dv" ]]
}

# ==== FUNCIONES CRUD ====


alta_usuario() {
    echo "Ingrese rol (estudiante/profesor/administrador):"
    read rol
    echo "CI:"
    read ci;

    if ! validar_ci "$ci"; then
        echo "❌ Cédula inválida"; return;
    fi

    echo "Nombre:"; read nombre
    echo "Apellido:"; read apellido
    echo "Email:"; read email
    echo "Teléfono:"; read tel
    echo "Contraseña:"; read -s pass

    pass_hash=$(php -r "echo password_hash('$pass', PASSWORD_DEFAULT);")

    case "$rol" in
        estudiante)
            sql="INSERT INTO alumnos (nombre,apellido,mail,ci_alumno,contrasena) VALUES ('$nombre','$apellido','$email','$ci','$pass_hash');"
            ;;

        profesor)
            echo "Código profesor:"; read cod
            [ "$cod" != "prof123KLASSO" ] && echo "❌ Código inválido" && return
            sql="INSERT INTO docente (nombre,apellido,mail_docente,ci_docente,contrasena_docente,tel_docente) VALUES ('$nombre','$apellido','$email','$ci','$pass_hash','$tel');"
            ;;

        administrador)
            echo "Código administrador:"; read cod
            [ "$cod" != "ads321KLASSO" ] && echo "❌ Código inválido" && return
            sql="INSERT INTO adscripta (nombre,apellido,mail_adscripta,ci_adscripta,contrasena_adscripta,tel_adscripta) VALUES ('$nombre','$apellido','$email','$ci','$pass_hash','$tel');"
            ;;
        *)
            echo "❌ Rol no válido"; return ;;
    esac

    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$sql" && echo "✅ Usuario agregado"
}



baja_usuario() {
    echo "Ingrese rol:"; read rol
    echo "Ingrese CI a eliminar:"; read ci

    case "$rol" in
        estudiante) table="alumnos"; col="ci_alumno";;
        profesor) table="docente"; col="ci_docente";;
        administrador) table="adscripta"; col="ci_adscripta";;
        *) echo "❌ Rol inválido"; return ;;
    esac

    sql="DELETE FROM $table WHERE $col='$ci';"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$sql" && echo "✅ Usuario eliminado"
}



modificar_usuario() {
    echo "Ingrese rol:"; read rol
    echo "CI del usuario a modificar:"; read ci
    echo "Nuevo email:"; read email
    echo "Nuevo teléfono:"; read tel

    case "$rol" in
        estudiante)
            table="alumnos"; mailcol="mail"; col="ci_alumno"
            sql="UPDATE $table SET $mailcol='$email' WHERE $col='$ci';"
            ;;
        profesor)
            table="docente"; mailcol="mail_docente"; col="ci_docente"
            sql="UPDATE $table SET $mailcol='$email', tel_docente='$tel' WHERE $col='$ci';"
            ;;
        administrador)
            table="adscripta"; mailcol="mail_adscripta"; col="ci_adscripta"
            sql="UPDATE $table SET $mailcol='$email', tel_adscripta='$tel' WHERE $col='$ci';"
            ;;
        *)
            echo "❌ Rol inválido"; return ;;
    esac

    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$sql" && echo "✅ Usuario modificado"
}



# ==== MENU ====
while true; do
    clear
    echo "=== GESTIÓN DE USUARIOS ==="
    echo "1) Alta"
    echo "2) Baja"
    echo "3) Modificación"
    echo "4) Salir"
    read -p "Opción: " op

    case $op in
        1) alta_usuario ;;
        2) baja_usuario ;;
        3) modificar_usuario ;;
        4) exit ;;
        *) echo "Opción inválida" ;;
    esac

    read -p "Enter para continuar..."
done
