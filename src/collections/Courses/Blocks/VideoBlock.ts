import { paidUser } from "@/utils/auth/paidUser";
import { Block } from "payload";

export const VideoBlock: Block = {
  slug: "video",
  labels: {
    singular: "Video",
    plural: "Videos",
  },
  fields: [
    {
      name: "title",
      label: "Titel",
      type: "text",
      required: true,
    },
    {
      name: "duration",
      label: "Dauer (in Minuten)",
      type: "number",
      required: true,
    },
    {
      name: "playerUrl",
      label: "Bunny Player URL",
      type: "text",
      required: true,
      access: {
        read: async ({ req: { user, payload }, id }) => {
          return await paidUser({ user, payload, id: id as string });
        },
      },
    },
  ],
}