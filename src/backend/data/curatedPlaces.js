/**
 * Curated, verified tourist attractions for major test cities.
 * Serves as a rock-solid benchmark and fallback when Geoapify key is not provided,
 * rate-limited, or returns empty upstream results.
 */

export const CURATED_PLACES = {
  kurukshetra: {
    destination: "Kurukshetra",
    lat: 29.9695,
    lon: 76.8783,
    attractions: [
      {
        id: "kkr-1",
        name: "Brahma Sarovar",
        category: "Historic site & Lake",
        categoryGroup: "historic",
        address: "Thanesar, Kurukshetra, Haryana 136118",
        lat: 29.9625,
        lon: 76.8372,
        description: "An ancient water body sacred to Hinduism, one of Asia's largest man-made water tanks, steeped in the history of the Mahabharata war.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Holy_pic_kkr.jpg/960px-Holy_pic_kkr.jpg",
        source: "Curated Heritage Data",
        rating: 4.8
      },
      {
        id: "kkr-2",
        name: "Jyotisar",
        category: "Historic & Religious site",
        categoryGroup: "temples",
        address: "Jyotisar, Kurukshetra, Haryana 136118",
        lat: 29.9610,
        lon: 76.7645,
        description: "The revered birthplace of the Bhagavad Gita, where Lord Krishna delivered his sacred sermon to Arjuna beneath the ancient holy banyan tree.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Jyotisar-Kurukshetra.JPG/960px-Jyotisar-Kurukshetra.JPG",
        source: "Curated Heritage Data",
        rating: 4.7
      },
      {
        id: "kkr-3",
        name: "Kurukshetra Panorama and Science Centre",
        category: "Museum",
        categoryGroup: "museums",
        address: "Pehowa Road, Thanesar, Kurukshetra, Haryana 136118",
        lat: 29.9678,
        lon: 76.8350,
        description: "An immersive museum showcasing a massive cylindrical panorama of the 18-day Kurukshetra War alongside interactive scientific exhibits.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Kurukshetra_Panorama_and_Science_Centre.JPG/960px-Kurukshetra_Panorama_and_Science_Centre.JPG",
        source: "Curated Heritage Data",
        rating: 4.6
      },
      {
        id: "kkr-4",
        name: "Sheikh Chehli's Tomb",
        category: "Monument & Historic site",
        categoryGroup: "monuments",
        address: "Thanesar, Kurukshetra, Haryana 136118",
        lat: 29.9806,
        lon: 76.8272,
        description: "An exquisite Mughal-era marble mausoleum complex of Sufi saint Sheikh Chehli, spiritual teacher to Mughal prince Dara Shikoh.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Sheikh-chili_ka_makhbara.jpg/960px-Sheikh-chili_ka_makhbara.jpg",
        source: "Curated Heritage Data",
        rating: 4.5
      },
      {
        id: "kkr-5",
        name: "Sthaneshwar Mahadev Temple",
        category: "Temple",
        categoryGroup: "temples",
        address: "Thanesar, Kurukshetra, Haryana 136118",
        lat: 29.9850,
        lon: 76.8210,
        description: "An ancient Shiva temple where the Pandavas worshipped Lord Shiva and received his blessings before commencing the Mahabharata war.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Sthaneshwar_mahadev_mandir.jpg/960px-Sthaneshwar_mahadev_mandir.jpg",
        source: "Curated Heritage Data",
        rating: 4.7
      },
      {
        id: "kkr-6",
        name: "Sri Krishna Museum",
        category: "Museum",
        categoryGroup: "museums",
        address: "Near Brahma Sarovar, Thanesar, Kurukshetra 136118",
        lat: 29.9660,
        lon: 76.8340,
        description: "Six galleries dedicated to the life, philosophy, and multifaceted personality of Lord Krishna, housing ancient stone carvings and artifacts.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Kurukshetra_yuddhamlo.jpg/960px-Kurukshetra_yuddhamlo.jpg",
        source: "Curated Heritage Data",
        rating: 4.6
      },
      {
        id: "kkr-7",
        name: "Bhishma Kund (Narkatari)",
        category: "Historic site",
        categoryGroup: "historic",
        address: "Narkatari Village, Kurukshetra, Haryana 136119",
        lat: 29.9480,
        lon: 76.8040,
        description: "The legendary site where Pitamah Bhishma lay on a bed of arrows, and Arjuna shot an arrow into the earth to produce a freshwater spring.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Bhishma_Kund-Kurukshetra.JPG/960px-Bhishma_Kund-Kurukshetra.JPG",
        source: "Curated Heritage Data",
        rating: 4.4
      }
    ]
  },
  nyc: {
    destination: "New York City",
    lat: 40.71427,
    lon: -74.00597,
    attractions: [
      {
        id: "nyc-1",
        name: "Central Park",
        category: "Park & Recreation",
        categoryGroup: "parks",
        address: "Manhattan, New York, NY 10022",
        lat: 40.785091,
        lon: -73.968285,
        description: "An 843-acre urban oasis in the heart of Manhattan featuring lakes, woodland paths, the Bethesda Terrace, and Strawberry Fields.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg/960px-Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg",
        source: "Curated Tourism Data",
        rating: 4.9
      },
      {
        id: "nyc-2",
        name: "Empire State Building",
        category: "Landmark & Viewpoint",
        categoryGroup: "landmarks",
        address: "20 W 34th St, New York, NY 10001",
        lat: 40.748441,
        lon: -73.985664,
        description: "Iconic 102-story Art Deco skyscraper providing legendary 360-degree open-air observation decks overlooking the skyline.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "nyc-3",
        name: "Metropolitan Museum of Art",
        category: "Museum",
        categoryGroup: "museums",
        address: "1000 5th Ave, New York, NY 10028",
        lat: 40.779437,
        lon: -73.963244,
        description: "One of the world's greatest art museums, spanning over 5,000 years of human creativity with masterworks from Egyptian to contemporary art.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg/960px-Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg",
        source: "Curated Tourism Data",
        rating: 4.9
      },
      {
        id: "nyc-4",
        name: "Statue of Liberty",
        category: "Monument & Historic site",
        categoryGroup: "monuments",
        address: "Liberty Island, New York, NY 10004",
        lat: 40.689249,
        lon: -74.044500,
        description: "A universal symbol of freedom and democracy, this colossal neoclassical copper sculpture was dedicated in 1886 as a gift from France.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/960px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "nyc-5",
        name: "The High Line",
        category: "Park & Public Walkway",
        categoryGroup: "parks",
        address: "Gansevoort St to W 34th St, New York, NY 10011",
        lat: 40.7480,
        lon: -74.0048,
        description: "A 1.45-mile elevated linear park created on a former New York Central Railroad spur along Manhattan's West Side.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/High_Line_Park%2C_Section_1a.jpg/960px-High_Line_Park%2C_Section_1a.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      },
      {
        id: "nyc-6",
        name: "Brooklyn Bridge",
        category: "Landmark & Historic site",
        categoryGroup: "landmarks",
        address: "Brooklyn Bridge, New York, NY 10038",
        lat: 40.7061,
        lon: -73.9969,
        description: "A monumental 19th-century suspension bridge featuring neo-Gothic stone towers and panoramic pedestrian walkways across the East River.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Brooklyn_Bridge_and_the_Lower_Manhattan_skyline_from_Pebble_Beach%2C_New_York.jpg/960px-Brooklyn_Bridge_and_the_Lower_Manhattan_skyline_from_Pebble_Beach%2C_New_York.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      }
    ]
  },
  paris: {
    destination: "Paris",
    lat: 48.8566,
    lon: 2.3522,
    attractions: [
      {
        id: "par-1",
        name: "Eiffel Tower",
        category: "Landmark & Monument",
        categoryGroup: "landmarks",
        address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
        lat: 48.8584,
        lon: 2.2945,
        description: "Gustave Eiffel's world-famous 330-meter wrought-iron lattice tower offering sweeping views of Paris.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/960px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "par-2",
        name: "Louvre Museum",
        category: "Museum",
        categoryGroup: "museums",
        address: "Rue de Rivoli, 75001 Paris",
        lat: 48.8606,
        lon: 2.3376,
        description: "The world's most visited art museum, housed in a historic royal palace with over 35,000 works including the Mona Lisa and Venus de Milo.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/960px-Louvre_Museum_Wikimedia_Commons.jpg",
        source: "Curated Tourism Data",
        rating: 4.9
      },
      {
        id: "par-3",
        name: "Arc de Triomphe",
        category: "Monument",
        categoryGroup: "monuments",
        address: "Place Charles de Gaulle, 75008 Paris",
        lat: 48.8738,
        lon: 2.2950,
        description: "Monumental triumphal arch honoring those who fought and died for France, standing at the western end of the Champs-Élysées.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Arc_de_Triomphe_-_Ao%C3%BBt_2026.jpg/960px-Arc_de_Triomphe_-_Ao%C3%BBt_2026.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      },
      {
        id: "par-4",
        name: "Musée d'Orsay",
        category: "Museum",
        categoryGroup: "museums",
        address: "1 Rue de la Légion d'Honneur, 75007 Paris",
        lat: 48.8599,
        lon: 2.3265,
        description: "A magnificent Beaux-Arts railway station transformed into a premier home for French Impressionist and Post-Impressionist masterpieces.",
        imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "par-5",
        name: "Sainte-Chapelle",
        category: "Historic site & Chapel",
        categoryGroup: "historic",
        address: "10 Bd du Palais, 75001 Paris",
        lat: 48.8554,
        lon: 2.3450,
        description: "A royal Gothic gem renowned for its breathtaking collection of 13th-century stained glass windows illustrating biblical history.",
        imageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&auto=format&fit=crop&q=80",
        source: "Curated Tourism Data",
        rating: 4.8
      }
    ]
  },
  rome: {
    destination: "Rome",
    lat: 41.9028,
    lon: 12.4964,
    attractions: [
      {
        id: "rom-1",
        name: "Colosseum",
        category: "Landmark & Ancient site",
        categoryGroup: "landmarks",
        address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
        lat: 41.8902,
        lon: 12.4922,
        description: "The largest ancient amphitheatre ever built, hosting gladiatorial contests and public spectacles in imperial Rome.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg",
        source: "Curated Tourism Data",
        rating: 4.9
      },
      {
        id: "rom-2",
        name: "Pantheon",
        category: "Monument & Ancient Temple",
        categoryGroup: "monuments",
        address: "Piazza della Rotonda, 00186 Roma RM, Italy",
        lat: 41.8986,
        lon: 12.4769,
        description: "A remarkably preserved Roman temple renowned for its monumental unreinforced concrete dome and central open oculus.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Pantheon_%28Rome%29_-_Right_side_and_front.jpg/960px-Pantheon_%28Rome%29_-_Right_side_and_front.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "rom-3",
        name: "Trevi Fountain",
        category: "Monument & Landmark",
        categoryGroup: "monuments",
        address: "Piazza di Trevi, 00187 Roma RM, Italy",
        lat: 41.9009,
        lon: 12.4833,
        description: "One of the most celebrated Baroque fountains in the world, sculpted against the facade of Palazzo Poli.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Trevi_Fountain_-_Roma.jpg/960px-Trevi_Fountain_-_Roma.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "rom-4",
        name: "Roman Forum",
        category: "Historic site",
        categoryGroup: "historic",
        address: "Via della Salara Vecchia, 5/6, 00186 Roma RM, Italy",
        lat: 41.8925,
        lon: 12.4853,
        description: "The ancient heart of the Roman Empire, surrounded by ruins of grand government buildings, temples, and basilicas.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Forum_Romanum_Rom.jpg/960px-Forum_Romanum_Rom.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      }
    ]
  },
  delhi: {
    destination: "Delhi",
    lat: 28.6139,
    lon: 77.2090,
    attractions: [
      {
        id: "del-1",
        name: "National Museum",
        category: "Museum",
        categoryGroup: "museums",
        address: "Janpath, New Delhi, Delhi 110011",
        lat: 28.6119,
        lon: 77.2193,
        description: "India's premier museum preserving over 200,000 works of art spanning Harappan civilization to modern times.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/National_Museum_New_Delhi_entrance.jpg/960px-National_Museum_New_Delhi_entrance.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      },
      {
        id: "del-2",
        name: "Red Fort (Lal Qila)",
        category: "Fort & UNESCO site",
        categoryGroup: "forts",
        address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
        lat: 28.6562,
        lon: 77.2410,
        description: "A grand 17th-century Mughal fortress of red sandstone constructed by Emperor Shah Jahan as the palace of Shahjahanabad.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/960px-Delhi_fort.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      },
      {
        id: "del-3",
        name: "Qutub Minar",
        category: "Monument & Historic site",
        categoryGroup: "monuments",
        address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
        lat: 28.5245,
        lon: 77.1855,
        description: "A 73-meter fluted red sandstone minaret built in 1192, standing amidst ancient ruins including an uncorroded Iron Pillar.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/960px-Qutb_Minar_2022.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "del-4",
        name: "Humayun's Tomb",
        category: "Monument & Historic site",
        categoryGroup: "monuments",
        address: "Mathura Road, Nizamuddin East, New Delhi, Delhi 110013",
        lat: 28.5933,
        lon: 77.2507,
        description: "The tomb of Mughal Emperor Humayun, the earliest major example of Mughal garden tombs and an inspiration for the Taj Mahal.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Tomb_of_Humayun%2C_Delhi.jpg/960px-Tomb_of_Humayun%2C_Delhi.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "del-5",
        name: "India Gate",
        category: "Landmark & Memorial",
        categoryGroup: "landmarks",
        address: "Rajpath, India Gate, New Delhi, Delhi 110001",
        lat: 28.6129,
        lon: 77.2295,
        description: "A 42-meter high war memorial arch dedicated to Indian soldiers, located along the ceremonial axis of Kartavya Path.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/India_Gate_front.jpg/960px-India_Gate_front.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      }
    ]
  },
  varanasi: {
    destination: "Varanasi",
    lat: 25.3176,
    lon: 82.9739,
    attractions: [
      {
        id: "var-1",
        name: "Kashi Vishwanath Temple",
        category: "Temple",
        categoryGroup: "temples",
        address: "Lahori Tola, Varanasi, Uttar Pradesh 221001",
        lat: 25.3109,
        lon: 83.0107,
        description: "One of the twelve sacred Jyotirlingas dedicated to Lord Shiva, standing on the western bank of the sacred Ganges river.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg",
        source: "Curated Tourism Data",
        rating: 4.9
      },
      {
        id: "var-2",
        name: "Dashashwamedh Ghat",
        category: "Historic & Religious site",
        categoryGroup: "historic",
        address: "Dashashwamedh Ghat Rd, Varanasi, Uttar Pradesh 221001",
        lat: 25.3080,
        lon: 83.0100,
        description: "The main and most vibrant ghat on the Ganges, famous for the magnificent evening Ganga Aarti ritual performed by priests.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/960px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg",
        source: "Curated Tourism Data",
        rating: 4.9
      },
      {
        id: "var-3",
        name: "Sarnath Archaeological Site",
        category: "Historic site & Monument",
        categoryGroup: "historic",
        address: "Sarnath, Varanasi, Uttar Pradesh 221007",
        lat: 25.3811,
        lon: 83.0214,
        description: "Where Gautama Buddha taught his first sermon (Dhammacakkappavattana Sutta); features the monumental Dhamek Stupa.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg/960px-Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "var-4",
        name: "Ramnagar Fort",
        category: "Fort & Museum",
        categoryGroup: "forts",
        address: "Ramnagar, Varanasi, Uttar Pradesh 221008",
        lat: 25.2678,
        lon: 83.0289,
        description: "An 18th-century cream-coloured sandstone fortification in Mughal style built on the eastern bank of the Ganges.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Ramnagar_Fort_Varanasi.jpg/960px-Ramnagar_Fort_Varanasi.jpg",
        source: "Curated Tourism Data",
        rating: 4.5
      }
    ]
  },
  tokyo: {
    destination: "Tokyo",
    lat: 35.6762,
    lon: 139.6503,
    attractions: [
      {
        id: "tok-1",
        name: "Sensō-ji Temple",
        category: "Temple & Historic site",
        categoryGroup: "temples",
        address: "2-3-1 Asakusa, Taito City, Tokyo 111-0032",
        lat: 35.7148,
        lon: 139.7967,
        description: "Tokyo's oldest and most significant Buddhist temple, dedicated to the bodhisattva Kannon, with its famous Kaminarimon Thunder Gate.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Sensoji_2023.jpg/960px-Sensoji_2023.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "tok-2",
        name: "Tokyo Skytree",
        category: "Viewpoint & Landmark",
        categoryGroup: "viewpoints",
        address: "1-1-2 Oshiage, Sumida City, Tokyo 131-0045",
        lat: 35.7101,
        lon: 139.8107,
        description: "A 634-meter broadcasting and observation tower offering unparalleled vistas across the entire Kantō region and Mount Fuji.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Tokyo_Skytree_2014_%E2%85%A2.jpg/960px-Tokyo_Skytree_2014_%E2%85%A2.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "tok-3",
        name: "Meiji Shrine",
        category: "Shrine & Forest",
        categoryGroup: "temples",
        address: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557",
        lat: 35.6764,
        lon: 139.6993,
        description: "A serene Shinto shrine nestled in 170 acres of evergreen sacred forest, dedicated to the deified spirits of Emperor Meiji.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Meiji_Jingu_2023-3.jpg/960px-Meiji_Jingu_2023-3.jpg",
        source: "Curated Tourism Data",
        rating: 4.8
      },
      {
        id: "tok-4",
        name: "Ueno Park & National Museum",
        category: "Park & Museum",
        categoryGroup: "parks",
        address: "Uenokoen, Taito City, Tokyo 110-0007",
        lat: 35.7140,
        lon: 139.7741,
        description: "A spacious public park celebrating cherry blossoms, housing the Tokyo National Museum, art galleries, and Shinobazu Pond.",
        imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Tokyo_National_Museum_Honkan_2010.jpg/960px-Tokyo_National_Museum_Honkan_2010.jpg",
        source: "Curated Tourism Data",
        rating: 4.7
      }
    ]
  }
};

/**
 * Returns matching curated places if destination matches or coordinates are close.
 */
export function getCuratedCityData(queryText = '', lat = null, lon = null) {
  const q = (queryText || '').toLowerCase();
  
  for (const [key, city] of Object.entries(CURATED_PLACES)) {
    if (q.includes(key) || q.includes(city.destination.toLowerCase())) {
      return city;
    }
    if (lat !== null && lon !== null) {
      // Check distance within ~25 km
      const dLat = Math.abs(lat - city.lat);
      const dLon = Math.abs(lon - city.lon);
      if (dLat < 0.25 && dLon < 0.25) {
        return city;
      }
    }
  }
  return null;
}
