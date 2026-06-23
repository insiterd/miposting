export const metadata = {
  title: "miposting — Gestiona tus redes sociales desde un solo lugar",
  description:
    "Programa, publica y analiza contenido en 28+ plataformas sociales. La herramienta todo-en-uno para agencias de marketing en República Dominicana.",
};

import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import FeaturesPlanet from "@/components/features-planet";
import Faq from "@/components/faq";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BusinessCategories />
      <FeaturesPlanet />
      <Faq />
      <Cta />
    </>
  );
}
