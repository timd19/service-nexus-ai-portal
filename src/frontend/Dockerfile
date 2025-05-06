
FROM mcr.microsoft.com/powershell:latest

# Set working directory
WORKDIR /app

# Install Universal Dashboard and other modules
RUN pwsh -Command "Install-Module -Name Universal -AllowPrerelease -Force -AcceptLicense"
RUN pwsh -Command "Install-Module -Name UniversalDashboard -Force -AcceptLicense"

# Copy dashboard files
COPY . .

# Expose port for dashboard
EXPOSE 5000

# Start PowerShell Universal
CMD [ "pwsh", "-Command", "./Start-Dashboard.ps1" ]
