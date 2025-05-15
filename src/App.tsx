
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { AzureOpenAIProvider } from './contexts/AzureOpenAIContext';
import './App.css';
import Index from './pages/Index';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import CalendarPage from './pages/CalendarPage';
import ChatbotPage from './pages/ChatbotPage';
import DocumentGeneratorPage from './pages/DocumentGeneratorPage';
import IdeaGeneratorPage from './pages/IdeaGeneratorPage';
import ProjectsPage from './pages/ProjectsPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AzureOpenAIProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/chat" element={<ChatbotPage />} />
              <Route path="/documents" element={<DocumentGeneratorPage />} />
              <Route path="/ideas" element={<IdeaGeneratorPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AzureOpenAIProvider>
    </ThemeProvider>
  );
}

export default App;
