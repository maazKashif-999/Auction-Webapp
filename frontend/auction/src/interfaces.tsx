
export interface Item {
    _id: number;
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    startingTime: Date;
    endingTime: Date;
    status: string;
  }
  
export interface User {
    userName: string;
    password: string;
    noOfItemsOwned: number;
    items: Item[];
    boughtAuctions: Item[];
  }