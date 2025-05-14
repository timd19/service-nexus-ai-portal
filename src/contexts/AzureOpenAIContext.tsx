
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AzureOpenAISettings {
  apiKey: string;
  endpoint: string;
  deploymentName: string;
  apiVersion: string;
  isConfigured: boolean;
}

interface AzureOpenAIContextType {
  settings: AzureOpenAISettings;
  updateSettings: (settings: Partial<AzureOpenAISettings> & { apiKey: string; endpoint: string; deploymentName: string }) => void;
}

const defaultSettings: AzureOpenAISettings = {
  apiKey: "",
  endpoint: "",
  deploymentName: "",
  apiVersion: "2023-05-15",
  isConfigured: false,
};

const AzureOpenAIContext = createContext<AzureOpenAIContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const useAzureOpenAI = () => useContext(AzureOpenAIContext);

export const AzureOpenAIProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AzureOpenAISettings>(() => {
    const savedSettings = localStorage.getItem("azureOpenAISettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        ...defaultSettings,
        ...parsed,
        isConfigured: !!(parsed.apiKey && parsed.endpoint && parsed.deploymentName)
      };
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("azureOpenAISettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AzureOpenAISettings> & { apiKey: string; endpoint: string; deploymentName: string }) => {
    const isConfigured = !!(newSettings.apiKey && newSettings.endpoint && newSettings.deploymentName);
    setSettings({ 
      ...settings,
      ...newSettings, 
      isConfigured 
    });
  };

  return (
    <AzureOpenAIContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AzureOpenAIContext.Provider>
  );
};
