export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  description:string;
  cover_url: string | null ;
  category: string;
  synopsis: string;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
}
