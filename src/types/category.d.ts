export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  translations?: {
    ar?: {
      name?: string;
      description?: string;
    };
  };
};