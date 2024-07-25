import Hero from "@/app/components/Hero";

export default function Home() {
  return (
      <>
        <Hero />
        <section className="text-center mt-32">
          <p className="text-gray-600">Trusted by those companies:</p>
          <div className="flex gap-8 *:h-6 mt-6 justify-center">
            <img src="https://images.ctfassets.net/lh3zuq09vnm2/7hhEfCdZPI7mPC24fFsC94/adf392604ef673a224307e48ac87bd96/Adobe.svg" alt=""/>
            <img src="https://images.ctfassets.net/lh3zuq09vnm2/4Y87kRrhSPSYgUbSWYxP1z/a13177cf43f99e7a79c691c54e271a98/Hubspot.svg" alt=""/>
            <img src="https://images.ctfassets.net/lh3zuq09vnm2/7dsuPwH4V8KJvCexSZueZc/272b2ef619de8ae4b443758413a19733/Unbounce_Logo.svg" alt=""/>
            <img src="https://images.ctfassets.net/lh3zuq09vnm2/6jZ182ywMavcqhY7WiLS5x/fb3c393066ae09dc17819472dc605d8f/15Five.svg" alt=""/>
          </div>
        </section>
      </>
  );
}
