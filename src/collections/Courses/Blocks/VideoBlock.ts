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
    },
  ],
}