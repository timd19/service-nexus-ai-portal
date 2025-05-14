
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { AzureOpenAIProvider } from './contexts/AzureOpenAIContext';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AzureOpenAIProvider>
        <Router>
          <MainLayout />
          <Toaster />
        </Router>
      </AzureOpenAIProvider>
    </ThemeProvider>
  );
}

export default App;
