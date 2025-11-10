export interface IBook {
  id: string;
  isbn: string;
  title: string;
  category: BookCategory;
  authorFullname: string;
  price: number;
  yearPublication: number;
  physicalStock: number;
  imageCover: string;
}

export enum BookCategory {
  TERROR = 'Terror',
  FANTASY = 'Fantasia',
  ADVENTURE = 'Aventura',
  SCIENCE_FICTION = 'Ciencia ficcion',
  SUSPENSE = 'Suspenso',
  DISTOPY = 'Distopia',
}
