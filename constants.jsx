export const Category = {
  CAR: 'Car',
  BIKE: 'Bike',
  BICYCLE: 'Bicycle',
  SCOOTER: 'Scooter',
  SKATEBOARD: 'Skateboard'
};

export const INITIAL_VEHICLES = [
  {
    id: '1',
    name: 'Ferrari Roma Spider',
    category: Category.CAR,
    brand: 'Ferrari',
    price: 320000,
    year: 2024,
    mileage: 150,
    engine: '3.9L V8 Twin-Turbo',
    transmission: '8-Speed DCT',
    color: 'Argento Nurburgring',
    condition: 'New',
    location: 'Beverly Hills, CA',
    description: 'The Ferrari Roma Spider is a contemporary take on the chic, pleasure-seeking Italian lifestyle of the 1950s and 60s. This convertible evolution features the award-winning V8 turbo.',
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: '2',
    name: 'MV Agusta Superveloce',
    category: Category.BIKE,
    brand: 'MV Agusta',
    price: 28500,
    year: 2024,
    mileage: 0,
    engine: '798cc Triple',
    transmission: '6-Speed',
    color: 'Ago Red',
    condition: 'New',
    location: 'Austin, TX',
    description: 'Neo-retro masterpiece. The Superveloce 800 combines vintage aesthetic with modern racing performance and advanced electronics.',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: '3',
    name: 'Porsche 911 GT3 RS',
    category: Category.CAR,
    brand: 'Porsche',
    price: 275000,
    year: 2023,
    mileage: 800,
    engine: '4.0L Flat-6',
    transmission: 'PDK',
    color: 'Shark Blue',
    condition: 'Used',
    location: 'Stuttgart, DE',
    description: 'Pure performance. The GT3 RS is a track machine designed for the street, featuring extreme aerodynamics and a high-revving naturally aspirated heart.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: '4',
    name: 'Ducati Streetfighter V4 SP2',
    category: Category.BIKE,
    brand: 'Ducati',
    price: 37900,
    year: 2024,
    mileage: 0,
    engine: '1,103cc V4',
    transmission: 'Manual',
    color: 'Winter Test Livery',
    condition: 'New',
    location: 'Bologna, IT',
    description: 'The ultimate "Fight Formula" machine. SP2 version brings carbon wheels, Brembo Stylema R calipers, and a dry clutch for the ultimate track feel.',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: '5',
    name: 'Canyon Aeroad CFR',
    category: Category.BICYCLE,
    brand: 'Canyon',
    price: 11999,
    year: 2024,
    mileage: 0,
    engine: 'Human Power',
    transmission: 'Shimano Dura-Ace Di2',
    color: 'Stealth',
    condition: 'New',
    location: 'Koblenz, DE',
    description: 'The world\'s fastest road bike, developed in the wind tunnel for maximum aerodynamic efficiency and podium-winning speed.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false
  },
  {
    id: '6',
    name: 'VanMoof S5',
    category: Category.SCOOTER,
    brand: 'VanMoof',
    price: 3498,
    year: 2023,
    mileage: 12,
    engine: 'Gen 5 Motor',
    transmission: 'Electronic shifting',
    color: 'Gray',
    condition: 'Used',
    location: 'Amsterdam, NL',
    description: 'The smartest city bike ever built. Advanced anti-theft tech, integrated lighting, and smooth power delivery.',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false
  }
];
