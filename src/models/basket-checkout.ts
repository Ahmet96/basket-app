interface BasketItem {
    sku: number;
    quantity: number;
  }
  
interface Order {
    basket: BasketItem[];
    cardNumber: string;
  }
  

const order: Order[] = [
{
    basket: [
      {
        sku: 1,
        quantity: 5
      },
      {
        sku: 2,
        quantity: 7
      },
      {
        sku: 3,
        quantity: 7
      },
      {
        sku: 4,
        quantity: 7
      },
      {
        sku: 5,
        quantity: 10
      }
    ],
    cardNumber: "5187447361867259"
  }
]

export { Order, order };
 
  
  
  