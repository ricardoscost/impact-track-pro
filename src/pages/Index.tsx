import Header from "@/components/Header";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-6 text-center">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Acesso Admin
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
