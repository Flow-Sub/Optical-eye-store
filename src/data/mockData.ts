import { Product, LensOption, LensCoating } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Aviator',
    brand: 'OptiVision',
    category: 'frames',
    price: 129.99,
    description: 'Timeless aviator frames with premium metal construction and adjustable nose pads.',
    images: [
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/712801/pexels-photo-712801.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 25,
    isActive: true,
    features: ['Titanium Frame', 'Adjustable Nose Pads', 'Anti-Slip Temples'],
    lensCompatible: true
  },
  {
    id: '2',
    name: 'Modern Rectangle',
    brand: 'VisionCraft',
    category: 'frames',
    price: 89.99,
    description: 'Contemporary rectangular frames perfect for professional settings.',
    images: [
      'https://images.pexels.com/photos/1851212/pexels-photo-1851212.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/2071453/pexels-photo-2071453.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 18,
    isActive: true,
    features: ['Lightweight Design', 'Flexible Hinges', 'Scratch Resistant'],
    lensCompatible: true
  },
  {
    id: '3',
    name: 'Designer Sunglasses',
    brand: 'SunStyle',
    category: 'sunglasses',
    price: 199.99,
    description: 'Premium polarized sunglasses with UV400 protection.',
    images: [
      'https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1805431/pexels-photo-1805431.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 12,
    isActive: true,
    features: ['Polarized Lenses', 'UV400 Protection', 'Impact Resistant'],
    lensCompatible: false
  },
  {
    id: '4',
    name: 'Blue Light Blockers',
    brand: 'TechVision',
    category: 'frames',
    price: 79.99,
    description: 'Computer glasses with blue light filtering technology.',
    images: [
      'https://images.pexels.com/photos/6087368/pexels-photo-6087368.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/6087369/pexels-photo-6087369.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 30,
    isActive: true,
    features: ['Blue Light Filter', 'Anti-Glare Coating', 'Lightweight'],
    lensCompatible: true
  },
  {
    id: '5',
    name: 'Lens Cleaning Kit',
    brand: 'ClearVision',
    category: 'accessories',
    price: 24.99,
    description: 'Professional lens cleaning kit with microfiber cloths and solution.',
    images: [
      'https://images.pexels.com/photos/6087246/pexels-photo-6087246.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 50,
    isActive: true,
    features: ['Microfiber Cloths', 'Cleaning Solution', 'Carrying Case'],
    lensCompatible: false
  },
  {
    id: '6',
    name: 'Round Vintage',
    brand: 'RetroOptic',
    category: 'frames',
    price: 109.99,
    description: 'Vintage-inspired round frames with modern comfort features.',
    images: [
      'https://images.pexels.com/photos/5624287/pexels-photo-5624287.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5624288/pexels-photo-5624288.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 8,
    isActive: true,
    features: ['Acetate Frame', 'Spring Hinges', 'Vintage Design'],
    lensCompatible: true
  },
  {
    id: '7',
    name: 'Sport Performance',
    brand: 'ActiveVision',
    category: 'frames',
    price: 149.99,
    description: 'High-performance sports frames with impact-resistant materials and secure fit.',
    images: [
      'https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 15,
    isActive: true,
    features: ['Impact Resistant', 'Non-Slip Grip', 'Wraparound Design'],
    lensCompatible: true
  },
  {
    id: '8',
    name: 'Reading Glasses',
    brand: 'ComfortRead',
    category: 'frames',
    price: 39.99,
    description: 'Comfortable reading glasses with magnification options.',
    images: [
      'https://images.pexels.com/photos/2071453/pexels-photo-2071453.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    stock: 25,
    isActive: true,
    features: ['Multiple Magnifications', 'Lightweight', 'Foldable'],
    lensCompatible: false
  }
];

export const lensOptions: LensOption[] = [
  {
    id: 'sv',
    type: 'single-vision',
    name: 'Single Vision',
    price: 89.99,
    description: 'Standard single vision lenses for nearsightedness or farsightedness'
  },
  {
    id: 'bf',
    type: 'bifocal',
    name: 'Bifocal',
    price: 149.99,
    description: 'Bifocal lenses with distinct reading and distance areas'
  },
  {
    id: 'pg',
    type: 'progressive',
    name: 'Progressive',
    price: 219.99,
    description: 'Progressive lenses with seamless transition between distances'
  }
];

export const coatingOptions: LensCoating[] = [
  {
    id: 'ar',
    name: 'Anti-Reflective',
    price: 49.99,
    description: 'Reduces glare and reflections for clearer vision'
  },
  {
    id: 'bl',
    name: 'Blue Light Filter',
    price: 39.99,
    description: 'Filters harmful blue light from digital screens'
  },
  {
    id: 'uv',
    name: 'UV Protection',
    price: 29.99,
    description: 'Blocks 100% of harmful UV rays'
  },
  {
    id: 'sc',
    name: 'Scratch Resistant',
    price: 19.99,
    description: 'Durable coating that resists scratches'
  }
];