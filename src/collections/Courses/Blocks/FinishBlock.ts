import { Block } from "payload";

export const FinishBlock: Block = {
  slug: "finish",
  labels: {
    singular: "Finish",
    plural: "Finishes",
  },
  fields: [
    {
      name: 'template',
      label: 'Certificate Template',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
      },
    },
  ],
}