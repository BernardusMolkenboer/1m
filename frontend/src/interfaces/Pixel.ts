export interface Pixel {
  id: number;
  x: number;
  y: number;
  owner?: string; // Optional property
  image_url?: string; // Optional property
  link_url?: string; // Optional property
  color?: string; // Optional property
  is_owned: boolean;
}
