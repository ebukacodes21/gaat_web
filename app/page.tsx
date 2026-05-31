import { Customer } from "@/components/customers";
import { Feature } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Why } from "@/components/why";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Feature />
      <Customer />
      <Why />
      <Footer />
    </div>
  );
};


export default HomePage