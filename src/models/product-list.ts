interface Product {
    sku: number;
    name: string;
    description: string;
    price: number;
    basketLimit: number;
  }
  
  const products: Product[] = [
    {
      sku: 1,
      name: "Red Product",
      description: "Red Product description",
      price: 1.01,
      basketLimit: 7
    },
    {
      sku: 2,
      name: "Orange Product",
      description: "Orange Product description",
      price: 2.02,
      basketLimit: 12
    },
    {
      sku: 3,
      name: "Yellow Product",
      description: "Yellow Product description",
      price: 3.03,
      basketLimit: 6
    },
    {
      sku: 4,
      name: "Green Product",
      description: "Green Product description",
      price: 4.04,
      basketLimit: 9
    },
    {
      sku: 5,
      name: "Blue Product",
      description: "Blue Product description",
      price: 5.05,
      basketLimit: 10
    }
  ];
  
  export { Product, products };
  
  