export default {
  nested: {
    Pack: {
      fields: {
        title: {
          type: 'string',
          id: 1
        },
        author: {
          type: 'string',
          id: 2
        },
        cover: {
          type: 'Sticker',
          id: 3
        },
        stickers: {
          rule: 'repeated',
          type: 'Sticker',
          id: 4,
          options: {}
        }
      },
      nested: {
        Sticker: {
          fields: {
            id: {
              type: 'uint32',
              id: 1
            },
            emoji: {
              type: 'string',
              id: 2
            }
          }
        }
      }
    }
  }
};
