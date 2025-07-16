import Header from "@/components/Header";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
