import { AuthenticateUser } from "@/utils/protecteRoutes";
import Home from "../components/screen1";
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const user = await AuthenticateUser();
      if (!user) {
        setIsLoading(true);
      } else {
        setIsLoading(true);
      }
    }
    getUser();
  }, []);
  return (
    <main>
      <div id="home">
          <Home />
      </div>
    </main>
  );
}
