// Demo property catalog — static seed data for SWFT marketing pages

const DEMO_LISTINGS = [
  {
    slug: "451-heath-st",
    title: "451 Heath St",
    city: "Brookline",
    state: "MA",
    zip: "02445",
    marketStatus: "for_rent",
    price: 3200,
    priceUnit: "monthly",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    propertyType: "Apartment",
    garage: 1,
    yearBuilt: 2018,
    featured: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Sun-filled three-bedroom in Brookline's Coolidge Corner — hardwood floors, updated kitchen, in-unit laundry, and a short walk to the C line. Ideal for professionals or a small family. Available for August move-in.",
    amenities: [
      "Air Conditioning",
      "In-unit laundry",
      "Hardwood floors",
      "Updated kitchen",
      "Parking included",
      "Pet friendly",
      "Near transit",
      "Storage",
    ],
  },
  {
    slug: "oak-terrace-condo",
    title: "Oak Terrace Condo",
    city: "Cambridge",
    state: "MA",
    marketStatus: "sold",
    price: 875000,
    priceUnit: "total",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1180,
    propertyType: "Condo",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    ],
    description: "Corner unit with Charles River views. Sold above ask in 12 days.",
    amenities: ["Doorman", "Gym", "River views", "Garage"],
  },
  {
    slug: "riverwalk-loft",
    title: "Riverwalk Loft",
    city: "Boston",
    state: "MA",
    marketStatus: "for_sale",
    price: 1200000,
    priceUnit: "total",
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1650,
    propertyType: "Loft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Industrial loft with 14-foot ceilings and private roof deck overlooking the Fort Point Channel.",
    amenities: ["Exposed brick", "Roof deck", "Concierge", "Fitness center"],
  },
  {
    slug: "maple-st-duplex",
    title: "Maple St Duplex",
    city: "Somerville",
    state: "MA",
    marketStatus: "rented",
    price: 2800,
    priceUnit: "monthly",
    priceStrikethrough: true,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 2100,
    propertyType: "Duplex",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Spacious duplex with private yard. Recently rented — inquire for waitlist.",
    amenities: ["Yard", "Basement storage", "Off-street parking"],
  },
  {
    slug: "beacon-hill-brownstone",
    title: "Beacon Hill Brownstone",
    city: "Boston",
    state: "MA",
    marketStatus: "for_sale",
    price: 2450000,
    priceUnit: "total",
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3200,
    propertyType: "Townhouse",
    image: "https://images.unsplash.com/photo-1605276374101-dee2b0a3bdb2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1605276374101-dee2b0a3bdb2?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Historic brownstone with original moldings, chef's kitchen, and private patio on a tree-lined street.",
    amenities: ["Fireplace", "Patio", "Wine cellar", "Original details"],
  },
  {
    slug: "harbor-view-studio",
    title: "Harbor View Studio",
    city: "Boston",
    state: "MA",
    marketStatus: "for_rent",
    price: 2400,
    priceUnit: "monthly",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 580,
    propertyType: "Studio",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Waterfront studio with floor-to-ceiling windows and building amenities.",
    amenities: ["Water views", "Pool", "24hr concierge"],
  },
  {
    slug: "jamaica-plain-victorian",
    title: "Jamaica Plain Victorian",
    city: "Boston",
    state: "MA",
    marketStatus: "sold",
    price: 925000,
    priceUnit: "total",
    bedrooms: 5,
    bathrooms: 2,
    sqft: 2800,
    propertyType: "Single Family",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7e?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Restored Victorian with wraparound porch and Arnold Arboretum views.",
    amenities: ["Porch", "Garden", "Updated systems"],
  },
  {
    slug: "south-end-penthouse",
    title: "South End Penthouse",
    city: "Boston",
    state: "MA",
    marketStatus: "for_rent",
    price: 5500,
    priceUnit: "monthly",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    propertyType: "Penthouse",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Top-floor penthouse with two terraces and designer finishes throughout.",
    amenities: ["Terraces", "Smart home", "Two parking spots"],
  },
  {
    slug: "back-bay-flat",
    title: "Back Bay Flat",
    city: "Boston",
    state: "MA",
    marketStatus: "rented",
    price: 4100,
    priceUnit: "monthly",
    priceStrikethrough: true,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Classic Back Bay layout with bay windows and gas fireplace. Currently leased.",
    amenities: ["Bay windows", "Fireplace", "Elevator"],
  },
  {
    slug: "dorchester-new-build",
    title: "Dorchester New Build",
    city: "Boston",
    state: "MA",
    marketStatus: "for_sale",
    price: 689000,
    priceUnit: "total",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1750,
    propertyType: "Single Family",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Energy-efficient new construction with open floor plan and roof deck.",
    amenities: ["Solar", "Roof deck", "Smart thermostat", "Garage"],
  },
  {
    slug: "fenway-garden-unit",
    title: "Fenway Garden Unit",
    city: "Boston",
    state: "MA",
    marketStatus: "for_rent",
    price: 2950,
    priceUnit: "monthly",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 890,
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Garden-level unit with private entrance and shared backyard.",
    amenities: ["Private entrance", "Backyard", "Laundry in unit"],
  },
  {
    slug: "lexington-colonial",
    title: "Lexington Colonial",
    city: "Lexington",
    state: "MA",
    marketStatus: "sold",
    price: 1150000,
    priceUnit: "total",
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2650,
    propertyType: "Single Family",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Suburban colonial on a half-acre lot. Closed in 9 days with multiple offers.",
    amenities: ["Large yard", "Two-car garage", "Home office"],
  },
];

export function getAllDemoListings() {
  return DEMO_LISTINGS;
}

export function getDemoBySlug(slug) {
  return DEMO_LISTINGS.find((l) => l.slug === slug) || null;
}

export function filterDemoListings({ marketStatus, propertyType } = {}) {
  return DEMO_LISTINGS.filter((l) => {
    if (marketStatus && l.marketStatus !== marketStatus) return false;
    if (propertyType && l.propertyType !== propertyType) return false;
    return true;
  });
}

export function getSimilarListings(slug, limit = 3) {
  const current = getDemoBySlug(slug);
  if (!current) return DEMO_LISTINGS.slice(0, limit);
  const same = DEMO_LISTINGS.filter(
    (l) => l.slug !== slug && l.marketStatus === current.marketStatus
  );
  const rest = DEMO_LISTINGS.filter((l) => l.slug !== slug && l.marketStatus !== current.marketStatus);
  return [...same, ...rest].slice(0, limit);
}
