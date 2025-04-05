import type { CollectionConfig } from 'payload';
import { QuizBlock } from './Blocks/QuizBlock';
import { VideoBlock } from './Blocks/VideoBlock';
import { FinishBlock } from './Blocks/FinishBlock';

export const Courses: CollectionConfig = {
  slug: "courses",
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user);
    },
    create: ({ req: { user } }) => {
      return user?.collection === "users";
    },
    update: ({ req: { user } }) => {
      return user?.collection === "users";
    },
    delete: ({ req: { user } }) => {
      return user?.collection === "users";
    }
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      label: "Image",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    {
      name: "curriculum",
      label: "Curriculum",
      type: "blocks",
      required: true,
      blocks: [
        QuizBlock,
        VideoBlock,
        FinishBlock
      ]
    }
  ]
}