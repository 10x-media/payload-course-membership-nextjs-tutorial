import { CollectionConfig } from "payload";

export const Participation: CollectionConfig = {
  slug: "participation",
  access: {
    read: ({ req: { user } }) => {
      if(user?.collection === "users"){ 
        return true;
      } else {
      return { customer: { equals: user?.id } };
      }
    },
    create: ({ req: { user }, data }) => {
      if(user?.collection === "users"){ 
        return true;
      } else if (user?.collection === "customers" && data?.customer === user?.id) {
        return true;
      } else {
        return false;
      }
    },
    update: ({ req: { user } }) => {
      if(user?.collection === "users"){ 
        return true;
      } else {
      return { customer: { equals: user?.id } };
      }
    },
    delete: ({ req: { user } }) => {
      if(user?.collection === "users"){ 
        return true;
      } else {
      return { customer: { equals: user?.id } };
      }
    }
  },
  admin: {
    useAsTitle: "",
  },
  fields: [
    {
      name: "customer",
      label: "Customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
    },
    {
      name: "course",
      label: "Course",
      type: "relationship",
      relationTo: "courses",
      required: true,
    },
    {
      name: "progress",
      label: "Progress",
      type: "number",
    }
  ]
}