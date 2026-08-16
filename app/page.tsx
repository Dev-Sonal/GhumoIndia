import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Dashboard from "@/components/dashboard";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />

    <main className="flex-1">
      <Header/>
      <Dashboard/>
    </main>
    </div>
    
  );
}