import { paidUser } from '@/utils/auth/paidUser'
import { Block } from 'payload'

export const FinishBlock: Block = {
  slug: 'finish',
  labels: {
    singular: 'Finish',
    plural: 'Finishes',
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
      access: {
        read: async ({ req: { user, payload }, id }) => {
          return await paidUser({
            collection: user?.collection,
            userId: user?.id,
            payload,
            id: id as string,
          })
        },
      },
    },
  ],
}
