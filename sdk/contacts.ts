const contacts = [
  {
    name: "Maximilian Benner",
    address: {
      street: "Gartenstraße 5",
      city: "Baldham",
      country: "Germany",
    },
    telephone: "+1 (929) 353-8426",
    email: "maxibenner@gmail.com",
    profileImgSrc: "/profile.jpg",
  },
  {
    name: "Lisa Benner",
    address: {
      street: "Gartenstraße 5",
      city: "Baldham",
      country: "Germany",
    },
    telephone: "+1 (929) 353-8426",
    email: "lisabenner@gmail.com",
    profileImgSrc: "/profile_lisa.jpg",
  },
  {
    name: "Michael Müller",
    address: {
      street: "Gartenstraße 5",
      city: "Baldham",
      country: "Germany",
    },
    telephone: "+1 (929) 353-8426",
    email: "michaelmueller@gmail.com",
    profileImgSrc: "/profile_michi.jpg",
  },
];

export interface Contact {
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  telephone: string;
  email: string;
  profileImgSrc: string;
}

export default contacts;
