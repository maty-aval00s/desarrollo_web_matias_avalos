# Script para ejecutar la aplicación Spring Boot

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Sistema de Evaluación de Avisos" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Java está instalado
Write-Host "Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Compilar el proyecto
Write-Host "Compilando el proyecto..." -ForegroundColor Yellow
$mavenPath = "..\apache-maven-3.9.11\bin\mvn.cmd"

if (Test-Path $mavenPath) {
    & $mavenPath clean package -DskipTests
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Compilación exitosa" -ForegroundColor Green
        Write-Host ""
        
        # Ejecutar la aplicación
        Write-Host "Iniciando la aplicación..." -ForegroundColor Yellow
        Write-Host "La aplicación estará disponible en: http://localhost:8080/evaluaciones" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
        Write-Host ""
        
        & $mavenPath spring-boot:run
    } else {
        Write-Host "✗ Error en la compilación" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ Maven no encontrado en $mavenPath" -ForegroundColor Red
    exit 1
}
