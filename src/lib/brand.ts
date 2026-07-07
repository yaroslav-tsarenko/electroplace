/**
 * Central brand identity for Electroplace.
 * Import from here instead of hardcoding company details in components.
 */

export const brand = {
  name: "electroplace",
  displayName: "Electroplace",
  domain: "electroplace.co.uk",
  url: "https://electroplace.co.uk",
  tagline: "A warm, considered electronics boutique.",
  description:
    "Electroplace — a warm, premium electronics concept store based in the United Kingdom. Audio, laptops, smartphones, TV & video, cameras, smart home, gaming, wearables and accessories, curated with expert advice and honest guarantees.",
  applicationName: "Electroplace",

  company: {
    legalName: "RYE FLOUR COOKIES LTD",
    number: "15107933",
    address: {
      line1: "304d, The Big Peg",
      line2: "120 Vyse St",
      city: "Birmingham",
      region: "England",
      postcode: "B18 6ND",
      country: "United Kingdom",
    },
  },

  contact: {
    email: "info@electroplace.co.uk",
    emailB2B: "info@electroplace.co.uk",
    phone: "+44 7450 581147",
    phoneHref: "tel:+447450581147",
    contactPage: "/en/contact",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/electroplace-uk/",
    instagram: "https://www.instagram.com/electroplace.uk/",
    twitter: "@electroplace",
  },
} as const;

export const brandAddressLine = [
  brand.company.address.line1,
  brand.company.address.line2,
  brand.company.address.city,
  brand.company.address.region,
  brand.company.address.postcode,
  brand.company.address.country,
].join(", ");

export const brandLegalLine = `${brand.company.legalName} · Company No. ${brand.company.number} · ${brand.company.address.line1}, ${brand.company.address.line2}, ${brand.company.address.city}, ${brand.company.address.postcode}, ${brand.company.address.country}`;
