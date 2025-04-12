import type {  CategoryOption } from "./types"

export const categoryOptions: CategoryOption[] = [
  {
    id: "skincare",
    label: "Skincare",
    icon: "droplet",
    subcategories: [
      { id: "cleansers", label: "Cleansers" },
      { id: "toners", label: "Toners & Mists" },
      { id: "serums", label: "Serums & Ampoules" },
      { id: "moisturizers", label: "Moisturizers & Creams" },
      { id: "eyecare", label: "Eye Care" },
      { id: "masks", label: "Masks & Treatments" },
      { id: "sunscreen", label: "Sunscreen & UV Protection" },
    ],
  },
  {
    id: "makeup",
    label: "Makeup",
    icon: "palette",
    subcategories: [
      { id: "face", label: "Face Makeup" },
      { id: "lip", label: "Lip Products" },
      { id: "eye", label: "Eye Makeup" },
      { id: "base", label: "Makeup Base & Primers" },
      { id: "setting", label: "Setting & Finishing Products" },
    ],
  },
  {
    id: "hairbody",
    label: "Hair & Body",
    icon: "shower-head",
    subcategories: [
      { id: "shampoo", label: "Shampoo & Conditioners" },
      { id: "treatments", label: "Hair Treatments & Oils" },
      { id: "bodywash", label: "Body Wash & Soaps" },
      { id: "lotions", label: "Body Lotions & Creams" },
      { id: "hand", label: "Hand & Foot Care" },
      { id: "scrubs", label: "Body Scrubs & Exfoliators" },
      { id: "perfumes", label: "Deodorants & Perfumes" },
    ],
  },
]


