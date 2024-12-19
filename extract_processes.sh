# !/bin/bash

# Archivo json
output="processes.json"

# Crear estructura inicial del JSON
echo "[" >"$output"

# Obtener los procesos y recorrerlos
ps -eo pid,comm,lstart --no-headers | while read -r pid name starttime; do
	# Generar valores aleatorios
	servicetime=$((RANDOM % 20 + 1))
	priority=$((RANDOM % 32 + 1))
	remainingtime=$servicetime

	# Convertir starttime a timestamp UNIX
	starttime_unix=$(date -d "$servicetime" "+%s")

	# Crear entrada JSON
	echo "  {" >>"$output"
	echo "    \"pid\": $pid," >>"$output"
	echo "    \"name\": \"$name\"," >>"$output"
	echo "    \"starttime\": $starttime_unix," >>"$output"
	echo "    \"serviceTime\": $servicetime," >>"$output"
	echo "    \"remainingTime\": $remainingtime," >>"$output"
	echo "    \"priority\": $priority" >>"$output"
	echo "  }," >>"$output"
done

sed -i '$ s/,$//' "$output"
echo "]" >>"$output"

echo "Archivo JSON: $output"
