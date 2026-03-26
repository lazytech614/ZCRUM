import CompanyCarousel from "./company-carousel"

const Companies = () => {
  return (
    <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>
          <CompanyCarousel />
        </div>
      </section>
  )
}

export default Companies