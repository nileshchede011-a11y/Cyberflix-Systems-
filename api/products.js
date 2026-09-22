const products = [
  {
    id: 1,
    name: "Intel Core i5-14600K",
    category: "CPU",
    price: 18000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Intel_Core_i5-14600K_(INVADERPC)_01.png"
  },
  {
    id: 2,
    name: "AMD Ryzen 7 7800X3D",
    category: "CPU",
    price: 32000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/AMD@5nmCCD(6nmIOD)@Zen4@Raphael@Ryzen_7_7800X3D@100-000000910_BS_2312PGY_9LW3390030138_DSCx01.jpg"
  },
  {
    id: 3,
    name: "GIGABYTE RTX 4070 Super",
    category: "GPU",
    price: 50000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Video_%C3%BCber_die_RTX_4070_Super_und_Vergleichskarten_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_03.png"
  },
  {
    id: 4,
    name: "GIGABYTE RTX 4060",
    category: "GPU",
    price: 30000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Video_%C3%BCber_die_GeForce_RTX_4060_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_05.png"
  },
  {
    id: 5,
    name: "MSI B760 Gaming Plus WiFi",
    category: "Motherboard",
    price: 15000,
    image:
      "https://m.media-amazon.com/images/I/51lLktu5Z3L._AC_.jpg"
  },
  {
    id: 6,
    name: "Corsair Vengeance RGB 32GB",
    category: "RAM",
    price: 11000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/2023_Pami%C4%99ci_Corsair_Vengeance_RGB.jpg"
  },
  {
    id: 7,
    name: "Samsung 990 EVO Plus 2TB",
    category: "Storage",
    price: 9000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/SSD_Samsung_990_EVO_Plus_2TB,_Model_MZ-V9S2T0-2801.jpg"
  },
  {
    id: 8,
    name: "Corsair RM750e",
    category: "PSU",
    price: 10000,
    image:
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020262-NA-RM750e-PSU-01.png"
  },
  {
    id: 9,
    name: "Rosewill Gaming Case",
    category: "Case",
    price: 6000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rosewill_Gaming_Case.png"
  },
  {
    id: 10,
    name: "NZXT Kraken X52",
    category: "Cooler",
    price: 8000,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/NZXT_Kraken_X52_cooler_in_H500i.jpg"
  }
];

module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");

      return res.end(
        JSON.stringify({
          success: false,
          message: "Method not allowed."
        })
      );
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    return res.end(
      JSON.stringify({
        success: true,
        products
      })
    );

  } catch (error) {
    console.error(
      "PRODUCTS ERROR:",
      error
    );

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");

    return res.end(
      JSON.stringify({
        success: false,
        message: "Products server error.",
        error: error.message
      })
    );
  }
};