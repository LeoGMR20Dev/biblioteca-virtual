export interface IBook {
  id: string;
  isbn: string;
  title: string;
  category: BookCategory;
  //   author: IAuthor;
  price: number;
  physicalStock: number;
}

export enum BookCategory {
  TERROR = 'Terror',
  FANTASY = 'Fantasia',
  ADVENTURE = 'Aventura',
  SCIENCE_FICTION = 'Ciencia ficcion',
  SUSPENSE = 'Suspenso',
  DISTOPY = 'Distopia',
}
// export interface IAuthor {
//   id: string;
//   firstName: string;
//   lastName: string;
// }
